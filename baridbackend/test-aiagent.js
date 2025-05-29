// Test script for the AI agent
const axios = require('axios');

async function testAiAgent() {
  try {
    console.log('Testing AI agent...');
    
    // Sample request payload (similar to the one from your n8n workflow)
    const payload = {
      body: {
        createdDm: {
          senderId: 'test-user-123',
          message: 'Hello, I would like to know more about Toppik hair fibers. What sizes are available and how much do they cost?',
          isVoice: false
        }
      }
    };
    
    console.log('Sending request to AI agent...');
    const response = await axios.post('http://localhost:3000/aiagent/process', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('AI Agent Response:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error testing AI agent:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAiAgent();
