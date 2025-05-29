// utils/refreshInstagramTokens.js
import axios from 'axios';

/**
 * Utility to refresh Instagram tokens before they expire
 * This can be run as a scheduled job/cron task
 * @param {string} apiBaseUrl - Base URL for your API
 * @param {string} accessToken - Admin or system access token
 */
export async function refreshAllInstagramTokens(apiBaseUrl, accessToken) {
  try {
    // Get all Instagram integrations
    const integrationsResponse = await axios.get(
      `${apiBaseUrl}/integrations`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    
    const integrations = integrationsResponse.data;
    const refreshPromises = [];
    const now = new Date();
    
    // For each integration that's about to expire soon (e.g., within 2 days)
    for (const integration of integrations) {
      if (
        integration.name === 'INSTAGRAM' &&
        new Date(integration.expiresAt) < new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
      ) {
        // Refresh the token
        const refreshPromise = axios.post(
          `${apiBaseUrl}/integrations/instagram/refresh/${integration.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        )
        .then(response => {
          console.log(`Refreshed token for integration ID ${integration.id}`);
          return response.data;
        })
        .catch(error => {
          console.error(`Failed to refresh token for integration ID ${integration.id}:`, error);
          return null;
        });
        
        refreshPromises.push(refreshPromise);
      }
    }
    
    // Wait for all refresh operations to complete
    const results = await Promise.all(refreshPromises);
    
    return {
      success: true,
      message: `Refreshed ${results.filter(Boolean).length} Instagram tokens`,
      results
    };
  } catch (error) {
    console.error('Error refreshing Instagram tokens:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
      error
    };
  }
}
