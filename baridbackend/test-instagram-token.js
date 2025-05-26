// Debug script to test the Instagram API token directly
const axios = require('axios');

// Token to test (replace with your actual token from the DB)
const token = "IGAATZCW7HZCVgZABZAE5xTHgyMXVZATV8zc2RHVWU0eFV6TU1TcFZAKX1dtWnFCYzVIUGlLZA29aT244ZA3R4N0d4NjctUzVKQVVwX2NsOUp0LUQ2QnYzdDZA5NmpwX0ZAGMTZAraXprV0RoTU9fTXdGSmp5S3dOOUZARZAk5kVUM4VXFSRlNWcwZDZD";

// Check if the token is actually valid
function validateToken(token) {
  // Check if token contains invalid characters
  const invalidChars = token.match(/[^a-zA-Z0-9_-]/g);
  if (invalidChars) {
    console.log('Warning: Token contains potentially invalid characters:', 
      [...new Set(invalidChars)].join(''));
  }
  
  // Check common token problems
  if (token.includes('\\r\\n') || token.includes('\r\n')) {
    console.log('Warning: Token contains newline characters');
  }
  
  if (token.includes(' ')) {
    console.log('Warning: Token contains spaces');
  }
  
  // Typical Facebook/Instagram token characteristics
  if (!token.startsWith('IGAAT') && !token.startsWith('EAAG')) {
    console.log('Warning: Token does not start with expected prefix (IGAAT or EAAG)');
  }
}

// Try the token with all common API versions
async function tryAllApiVersions() {
  const versions = ['v18.0', 'v19.0', 'v20.0', 'v21.0', 'v22.0'];
  
  for (const version of versions) {
    try {
      console.log(`\nTrying API ${version}...`);
      const url = `https://graph.facebook.com/${version}/me`;
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log(`Success with ${version}:`, response.data);
    } catch (error) {
      console.log(`Failed with ${version}:`, error.response?.data?.error || error.message);
    }
  }
}

// Instagram Business Account ID
const instagramBusinessId = "10035592709832816"; // Updated to the correct ID from your response

// Old Instagram Business Account ID 
const oldInstagramBusinessId = "17841473002033768";

// User to message
const recipientId = "663482183177210";

// Test the token using the debug endpoint
async function testTokenDebug() {
  try {
    const url = `https://graph.facebook.com/debug_token`;
    const response = await axios.get(url, {
      params: {
        input_token: token,
        access_token: token
      }
    });
    
    console.log('Token debug info:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error testing token debug:', error.response?.data || error.message);
  }
}

// Test sending a message
async function testSendMessage() {
  console.log("Testing with new Instagram Business ID:", instagramBusinessId);
  await trySendMessage(instagramBusinessId);
  
  console.log("\nTesting with old Instagram Business ID:", oldInstagramBusinessId);
  await trySendMessage(oldInstagramBusinessId);
}

// Helper function to try sending a message with different IDs
async function trySendMessage(businessId) {
  try {
    const url = `https://graph.facebook.com/v22.0/${businessId}/messages`;
    const requestBody = {
      recipient: { id: recipientId },
      message: { text: "Test message from API" },
      messaging_type: 'RESPONSE',
    };
    
    console.log(`Sending message to URL: ${url}`);
    console.log(`Request body: ${JSON.stringify(requestBody)}`);
    
    const response = await axios.post(url, requestBody, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Message sent successfully!');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error sending message:', 
      error.response?.data?.error || error.message);
    
    // Print full error for debugging
    if (error.response) {
      console.log('Status code:', error.response.status);
      console.log('Response headers:', error.response.headers);
      console.log('Response data:', error.response.data);
    }
  }
}

// Get Instagram account info
async function getAccountInfo() {
  try {
    const url = `https://graph.facebook.com/v22.0/${instagramBusinessId}`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Instagram account info:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error getting account info:', error.response?.data || error.message);
  }
}

// Check permissions on the token
async function checkPermissions() {
  try {
    const url = `https://graph.facebook.com/v22.0/me/permissions`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Token permissions:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error checking permissions:', error.response?.data || error.message);
  }
}

// Try with different API paths
async function testWithDifferentPaths() {
  const endpoints = [
    { name: "Me endpoint", path: `https://graph.facebook.com/v22.0/me?fields=id,name` },
    { name: "Instagram Business Account", path: `https://graph.facebook.com/v22.0/${instagramBusinessId}` },
    { name: "Pages endpoint", path: `https://graph.facebook.com/v22.0/me/accounts` },
    { name: "Instagram Business Accounts", path: `https://graph.facebook.com/v22.0/me/instagram_business_accounts` }
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\nTesting ${endpoint.name}...`);
      const response = await axios.get(endpoint.path, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log(`Success with ${endpoint.name}:`);
      console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log(`Failed with ${endpoint.name}:`, error.response?.data?.error || error.message);
    }
  }
}

// Run the tests
async function runTests() {
  console.log('Testing Instagram token...');
  console.log(`Token length: ${token.length}`);
  console.log(`First 10 chars: ${token.substring(0, 10)}`);
  console.log(`Last 10 chars: ${token.substring(token.length - 10)}`);
  
  console.log("\n------ BASIC VALIDATIONS ------");
  validateToken(token);
  
  console.log("\n------ TOKEN DEBUG INFO ------");
  await testTokenDebug();
  
  console.log("\n------ CHECKING PERMISSIONS ------");
  await checkPermissions();
  
  console.log("\n------ TESTING API ENDPOINTS ------");
  await testWithDifferentPaths();
  
  console.log("\n------ ACCOUNT INFO ------");
  await getAccountInfo();
  
  console.log("\n------ SENDING TEST MESSAGE ------");
  await testSendMessage();
}

runTests();
