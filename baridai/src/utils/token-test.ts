// Token validation test utility
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../services/auth-service';

/**
 * Tests token generation and validation to ensure they work properly
 * Run with: npx ts-node -r tsconfig-paths/register src/utils/token-test.ts
 */
async function testTokenValidation() {
  console.log('===== JWT TOKEN VALIDATION TEST =====');
  
  // 1. Use an existing token instead of creating a mock one
  console.log('\n1. Using existing token from localStorage...');
  
  // Check if we're in a browser environment, otherwise use a test token
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('access_token') 
    : null;
    
  if (!token) {
    console.log('No token found in localStorage. Please login first or provide a token manually.');
    return;
  }
  
  console.log('Using token:', token.substring(0, 20) + '...');
  
  // 2. Try to decode the token directly
  try {
    console.log('\n2. Decoding token...');
    const decoded = jwtDecode(token);
    console.log('Successfully decoded token:', decoded);
  } catch (error) {
    console.error('Failed to decode token:', error);
  }
  
  // 3. Test validateSession method
  try {
    console.log('\n3. Testing validateSession...');
    // We need to temporarily set the token so validateSession can find it
    AuthService.setToken(token);
    
    // Since we can't directly test the backend validation on a mock token,
    // we'll focus on the local validation part
    try {
      const validationResult = await AuthService.validateSession();
      console.log('Validation result:', validationResult);
      
      // Check if we at least got past the local token verification
      if (validationResult.errorType !== 'token_expired' && 
          validationResult.errorType !== 'token_invalid') {
        console.log('Local validation passed!');
      }
      
      // The backend validation will likely fail because we're using a mock token
      if (validationResult.errorType === 'backend_unavailable') {
        console.log('Backend validation failed as expected with mock token');
      }
    } catch (error) {
      console.error('Error during validateSession:', error);
    }
    
    // Clean up - remove test token
    AuthService.removeToken();
  } catch (error) {
    console.error('Error during validateSession:', error);
  }
  
  console.log('\n===== TEST COMPLETE =====');
}

// Run the test
testTokenValidation().catch(console.error);
