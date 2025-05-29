#!/usr/bin/env node

/**
 * Instagram Token Refresh Script
 * 
 * This script refreshes all Instagram tokens that are nearing expiration.
 * It should be run periodically via a cron job or scheduled task.
 * 
 * Example cron (weekly on Sunday):
 * 0 0 * * 0 cd /path/to/your/app && node scripts/refresh-instagram-tokens.js
 */

require('dotenv').config();
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Configuration
const DAYS_BEFORE_EXPIRY = 10; // Refresh tokens with less than 10 days left
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// Access token for system operations - you might want to implement a more secure way to handle this
const SYSTEM_TOKEN = process.env.SYSTEM_API_TOKEN;

async function refreshTokenDirectly(integration) {
  try {
    console.log(`Directly refreshing token for integration ${integration.id}`);
    
    // Call Instagram Graph API to refresh the token
    const refreshResponse = await axios.get(
      'https://graph.instagram.com/refresh_access_token',
      {
        params: {
          grant_type: 'ig_refresh_token',
          access_token: integration.token,
        },
      }
    );
    
    // Check for valid response
    if (!refreshResponse.data || !refreshResponse.data.access_token) {
      throw new Error('Invalid response from Instagram API');
    }
    
    const { access_token: newToken, expires_in } = refreshResponse.data;
    
    // Calculate new expiration date
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);
    
    // Update the integration in the database
    await prisma.integration.update({
      where: { id: integration.id },
      data: {
        token: newToken,
        expiresAt: expiresAt,
      },
    });
    
    return {
      success: true,
      expiresAt,
      message: `Token refreshed successfully. New expiry: ${expiresAt.toISOString()}`
    };
  } catch (error) {
    console.error(`Failed to refresh token directly:`, error.response?.data || error.message);
    throw error;
  }
}

async function main() {
  console.log('=== Instagram Token Refresh Tool ===');
  console.log(`Started at: ${new Date().toISOString()}`);
  
  try {
    // Calculate the date threshold for token refresh
    const refreshThreshold = new Date();
    refreshThreshold.setDate(refreshThreshold.getDate() + DAYS_BEFORE_EXPIRY);
    
    // Find all Instagram integrations that need refreshing
    const integrationsToRefresh = await prisma.integration.findMany({
      where: {
        name: 'INSTAGRAM',
        expiresAt: {
          lt: refreshThreshold
        }
      },
      include: {
        User: {
          select: {
            id: true,
            email: true,
            username: true
          }
        }
      }
    });
    
    console.log(`Found ${integrationsToRefresh.length} tokens to refresh`);
    
    // Process each integration
    for (const integration of integrationsToRefresh) {
      try {
        console.log(`Processing integration ${integration.id} for user ${integration.User?.username || integration.userId}`);
        
        // Try API first
        try {
          // Use the API to refresh the token
          const response = await axios.post(
            `${API_BASE_URL}/integration/instagram/refresh/${integration.id}`,
            {},
            { 
              headers: { 
                Authorization: `Bearer ${SYSTEM_TOKEN}` 
              } 
            }
          );
          
          console.log(`✅ Successfully refreshed token via API for integration ${integration.id}`);
          console.log(`   New expiry: ${new Date(response.data.expiresAt).toISOString()}`);
        } catch (apiError) {
          console.warn(`API refresh failed, trying direct method: ${apiError.message}`);
          
          // Fall back to direct refresh
          const directResult = await refreshTokenDirectly(integration);
          console.log(`✅ Successfully refreshed token directly for integration ${integration.id}`);
          console.log(`   ${directResult.message}`);
        }
      } catch (error) {
        console.error(`❌ Failed to refresh token for integration ${integration.id}:`, 
          error.response?.data?.message || error.message);
      }
    }
    
    console.log('\nToken refresh process completed');
  } catch (error) {
    console.error('Error in token refresh process:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
