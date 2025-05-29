#!/usr/bin/env node

/**
 * Test script for Instagram token flow
 * 
 * This script helps test the Instagram token exchange and refresh functionality
 * without having to go through the UI.
 */

const axios = require('axios');
const readline = require('readline');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID;
const REDIRECT_URI = 'https://yourapp.com/instagram/callback';

async function promptForInput(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, answer => {
      resolve(answer);
    });
  });
}

async function main() {
  try {
    console.log('=== Instagram Integration Test Tool ===');
    
    // Get auth token
    const token = await promptForInput('Enter your authentication token (JWT): ');
    
    // Show options menu
    console.log('\nOptions:');
    console.log('1. Test token exchange (you need an Instagram auth code)');
    console.log('2. Get existing Instagram integrations');
    console.log('3. Refresh an existing Instagram token');
    console.log('4. Generate Instagram auth link');
    console.log('5. Exit');

    const option = await promptForInput('\nSelect an option (1-5): ');

    switch (option) {
      case '1': {
        // Test token exchange
        const code = await promptForInput('Enter Instagram authorization code: ');
        
        console.log('\nExchanging code for token...');
        const response = await axios.post(
          `${API_BASE_URL}/integrations/instagram/token`,
          { code, redirectUri: REDIRECT_URI },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        console.log('\n✅ Success! Integration created:');
        console.log(JSON.stringify(response.data, null, 2));
        break;
      }

      case '2': {
        // Get integrations
        console.log('\nFetching Instagram integrations...');
        const response = await axios.get(
          `${API_BASE_URL}/integrations`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Filter for Instagram integrations
        const instagramIntegrations = response.data.filter(i => i.name === 'INSTAGRAM');
        
        if (instagramIntegrations.length === 0) {
          console.log('\n⚠️ No Instagram integrations found');
        } else {
          console.log(`\n✅ Found ${instagramIntegrations.length} Instagram integration(s):`);
          instagramIntegrations.forEach((integration, idx) => {
            console.log(`\n--- Integration ${idx + 1} ---`);
            console.log(`ID: ${integration.id}`);
            console.log(`Instagram ID: ${integration.instagramId}`);
            console.log(`Token: ${integration.token.substring(0, 15)}...`);
            console.log(`Expires: ${new Date(integration.expiresAt).toLocaleString()}`);
          });
        }
        break;
      }
      
      case '3': {
        // Refresh token
        console.log('\nFetching integrations first...');
        const integrationsResponse = await axios.get(
          `${API_BASE_URL}/integrations`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const instagramIntegrations = integrationsResponse.data.filter(i => i.name === 'INSTAGRAM');
        
        if (instagramIntegrations.length === 0) {
          console.log('\n⚠️ No Instagram integrations found to refresh');
          break;
        }
        
        console.log('\nAvailable Instagram integrations:');
        instagramIntegrations.forEach((integration, idx) => {
          console.log(`${idx + 1}. ID: ${integration.id} (Expires: ${new Date(integration.expiresAt).toLocaleString()})`);
        });
        
        const integrationIdx = parseInt(await promptForInput('\nSelect integration to refresh (number): ')) - 1;
        
        if (integrationIdx < 0 || integrationIdx >= instagramIntegrations.length) {
          console.log('Invalid selection');
          break;
        }
        
        const integrationId = instagramIntegrations[integrationIdx].id;
        console.log(`\nRefreshing token for integration ${integrationId}...`);
        
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/integrations/instagram/refresh/${integrationId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        console.log('\n✅ Token refreshed successfully:');
        console.log(`New expiration: ${new Date(refreshResponse.data.expiresAt).toLocaleString()}`);
        break;
      }
      
      case '4': {
        // Generate auth link
        if (!INSTAGRAM_APP_ID) {
          console.log('\n⚠️ INSTAGRAM_APP_ID not set in environment variables');
          break;
        }
        
        const authUrl = `https://api.instagram.com/oauth/authorize` +
          `?client_id=${INSTAGRAM_APP_ID}` +
          `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
          `&scope=user_profile,user_media` +
          `&response_type=code`;
        
        console.log('\n✅ Instagram authorization URL:');
        console.log(authUrl);
        console.log('\nOpen this URL in a browser, authorize the app, and copy the code from the redirect URL');
        break;
      }
      
      case '5': {
        console.log('Exiting...');
        break;
      }
      
      default: {
        console.log('Invalid option');
        break;
      }
    }
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  } finally {
    rl.close();
  }
}

main();
