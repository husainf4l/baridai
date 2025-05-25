// simulate-real-instagram.js
require('dotenv').config();
const axios = require('axios');
const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

async function simulateRealInstagramMessage() {
  try {
    // Get integration details from database
    console.log('Getting integration data...');
    const integration = await prisma.integration.findFirst({
      where: { name: 'INSTAGRAM' },
    });
    
    if (!integration) {
      console.error('No Instagram integration found in the database');
      return;
    }
    
    console.log(`Using integration: ID=${integration.id}, InstagramID=${integration.instagramId}`);
    
    // Create a webhook payload that more closely matches real Instagram webhook format
    const instagramId = integration.instagramId || '17841473002033768';
    const pageId = integration.pageId || instagramId;
    const senderId = 'real_instagram_user_123'; // This would be a real Instagram user ID
    
    const timestamp = Date.now();
    const webhookPayload = {
      "object": "instagram",
      "entry": [
        {
          "id": instagramId,
          "time": timestamp,
          "messaging": [
            {
              "sender": {
                "id": senderId
              },
              "recipient": {
                "id": pageId
              },
              "timestamp": timestamp,
              "message": {
                "mid": `real_message_${timestamp}`,
                "text": "Hello, this is a simulated real user message to your Instagram page!"
              }
            }
          ]
        }
      ]
    };
    
    console.log('\nSending webhook payload to simulate real Instagram message:');
    console.log(JSON.stringify(webhookPayload, null, 2));
    
    // Send the webhook
    const response = await axios.post('http://localhost:4008/api/webhook/instagram', webhookPayload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`\nWebhook simulation response: ${response.status} ${response.statusText}`);
    console.log('Response data:', response.data);
    
    console.log('\nMessage simulation complete. The message should now be stored in your database.');
    console.log('You can view it at: http://localhost:4008/api/webhook/messages/instagram');
    
  } catch (error) {
    console.error('Error simulating Instagram message:', error.response?.data || error.message);
  } finally {
    await prisma.$disconnect();
  }
}

simulateRealInstagramMessage();
