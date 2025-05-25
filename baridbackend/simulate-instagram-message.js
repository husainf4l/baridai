require('dotenv').config();
const axios = require('axios');

// Function to simulate an incoming Instagram message
async function simulateInstagramMessage() {
  try {
    // Use the values from your integration
    // Fetch Instagram integration from the database first
    const { PrismaClient } = require('./generated/prisma');
    const prisma = new PrismaClient();
    
    console.log('Getting integration data from database...');
    const integration = await prisma.integration.findFirst({
      where: { name: 'INSTAGRAM' },
    });
    
    if (!integration) {
      console.error('No Instagram integration found in the database');
      return;
    }
    
    console.log(`Using integration: ${JSON.stringify(integration, null, 2)}`);
    
    // Use the real Instagram ID from the integration
    const INSTAGRAM_ID = integration.instagramId || '17841473002033768'; 
    const INSTAGRAM_USER_ID = 'simulated_user_123';
    
    console.log('Simulating Instagram message webhook...');
    
    // Create a webhook payload similar to what Instagram would send
    const webhookPayload = {
      object: 'instagram',
      entry: [
        {
          id: INSTAGRAM_ID,
          time: Date.now(),
          messaging: [
            {
              sender: { id: INSTAGRAM_USER_ID },
              recipient: { id: INSTAGRAM_ID },
              timestamp: Date.now(),
              message: {
                mid: `test_message_${Date.now()}`,
                text: 'This is a test message from the webhook simulator'
              }
            }
          ]
        }
      ]
    };
    
    console.log('\nSending webhook payload:');
    console.log(JSON.stringify(webhookPayload, null, 2));
    
    // Send the webhook to our endpoint with the correct API prefix
    const response = await axios.post('http://localhost:4008/api/webhook/instagram', webhookPayload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`\nWebhook simulation response: ${response.status} ${response.statusText}`);
    console.log('Response data:', response.data);
    
    console.log('\nNow, try viewing messages at: http://localhost:4008/api/webhook/messages/instagram');

  } catch (error) {
    console.error('Error simulating Instagram message:', error.response?.data || error.message);
  }
}

// Run the simulation
simulateInstagramMessage();
