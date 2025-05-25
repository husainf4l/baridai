// test-messages-endpoint.js
const axios = require('axios');

async function main() {
  try {
    console.log('Testing Instagram messages endpoint...');
    
    // Replace with your actual JWT token
    const token = 'YOUR_JWT_TOKEN_HERE';
    
    // Make the API call to get messages from Instagram
    console.log('Fetching Instagram messages...');
    const response = await axios.get('http://localhost:4008/api/webhook/messages/instagram', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

main();
