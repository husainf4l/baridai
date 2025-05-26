/**
 * Instagram Token Debugging Script
 * Use this script to test if your Instagram token is valid and properly formatted
 * Run with: node instagram-token-debug.js YOUR_TOKEN
 */

const axios = require('axios');

async function validateToken(token) {
    console.log('====================================');
    console.log('INSTAGRAM TOKEN VALIDATION TOOL');
    console.log('====================================');
    
    if (!token) {
        console.error('❌ ERROR: No token provided');
        console.log('Usage: node instagram-token-debug.js YOUR_TOKEN');
        process.exit(1);
    }
    
    // Clean the token
    const cleanToken = token.trim();
    
    // Token analysis
    console.log('\n📊 TOKEN ANALYSIS:');
    console.log('------------------------------------');
    console.log(`📏 Raw token length: ${token.length}`);
    console.log(`📏 Clean token length: ${cleanToken.length}`);
    console.log(`🔍 First 10 chars: ${cleanToken.substring(0, 10)}...`);
    console.log(`🔍 Last 10 chars: ...${cleanToken.substring(cleanToken.length - 10)}`);
    
    // Check for common issues
    if (cleanToken.length < 50) {
        console.log('⚠️ WARNING: Token seems too short for a Facebook/Instagram token');
    }
    
    if (cleanToken.includes('\n') || cleanToken.includes('\r')) {
        console.log('⚠️ WARNING: Token contains newline characters that should be removed');
    }
    
    if (cleanToken.includes(' ')) {
        console.log('⚠️ WARNING: Token contains spaces that should be removed');
    }
    
    console.log('\n🔄 TESTING TOKEN WITH INSTAGRAM API...');
    console.log('------------------------------------');
    
    try {
        // Try to use the token with the Instagram Graph API
        // We'll make a call to get the Facebook Page info as a simple validation
        const response = await axios.get(`https://graph.facebook.com/v22.0/me`, {
            headers: {
                'Authorization': `Bearer ${cleanToken}`
            }
        });
        
        console.log('✅ TOKEN IS VALID!');
        console.log('Response:', JSON.stringify(response.data, null, 2));
        
        // If we got here, token works for basic API calls
        // Now test a call to the messages endpoint
        try {
            console.log('\n🔄 TESTING PERMISSIONS FOR MESSAGING...');
            console.log('------------------------------------');
            
            // You need to use the page ID from your integration
            const pageId = response.data.id || 'YOUR_PAGE_ID';
            
            console.log(`Using Page ID: ${pageId}`);
            
            // Try to get conversations list (requires pages_messaging permission)
            const msgResponse = await axios.get(`https://graph.facebook.com/v22.0/${pageId}/conversations`, {
                headers: {
                    'Authorization': `Bearer ${cleanToken}`
                }
            });
            
            console.log('✅ MESSAGING PERMISSIONS OK!');
            console.log('Found conversations:', msgResponse.data.data.length);
        } catch (msgError) {
            console.error('❌ MESSAGING PERMISSIONS FAILED:');
            console.error('This indicates the token may be valid but lacks the pages_messaging permission');
            console.error('Error details:', msgError.response?.data?.error || msgError.message);
        }
        
    } catch (error) {
        console.error('❌ TOKEN VALIDATION FAILED:');
        console.error(error.response?.data?.error || error.message);
        
        if (error.response?.status === 401) {
            console.error('❌ Authentication failed - token is invalid or expired');
        }
    }
    
    console.log('\n====================================');
    console.log('Token debugging completed');
    console.log('====================================');
}

// Get token from command line arguments
const token = process.argv[2];
validateToken(token);
