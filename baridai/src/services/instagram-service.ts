/**
 * Instagram API Service
 * 
 * Provides utility functions to interact with the Instagram Graph API
 * Documentation: https://developers.facebook.com/docs/instagram-api/
 */

// Types for Instagram API responses
interface InsightsValue {
  value: number;
}

interface InsightData {
  name: string;
  period: string;
  values: InsightsValue[];
  title: string;
  description: string;
  id: string;
}

interface InsightsResponse {
  data: InsightData[];
  paging?: {
    previous?: string;
    next?: string;
  };
}

interface MediaItem {
  id: string;
  caption?: string;
  media_type: string;
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
  username: string;
}

interface MediaResponse {
  data: MediaItem[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

interface TokenResponse {
  access_token: string;
  user_id: string;
}

/**
 * Fetch Media Insights for a specific Instagram media post
 * Documentation: https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights
 * 
 * @param mediaId The ID of the Instagram media object
 * @param accessToken The Instagram Graph API access token
 * @param metrics Optional array of metric names to retrieve (default: engagement, impressions, reach)
 * @returns Promise containing the insights data
 */
export async function getMediaInsights(
  mediaId: string,
  accessToken: string,
  metrics: string[] = ['engagement', 'impressions', 'reach']
): Promise<InsightsResponse> {
  try {
    // The Instagram Graph API endpoint for media insights
    const endpoint = `https://graph.instagram.com/v18.0/${mediaId}/insights`;
    
    // Convert metrics array to comma-separated string
    const metricsParam = metrics.join(',');
    
    // Build the URL with parameters
    const url = `${endpoint}?metric=${metricsParam}&access_token=${accessToken}`;
    
    // Make the API request
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Instagram API Error: ${errorData.error.message}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Instagram media insights:', error);
    throw error;
  }
}

/**
 * Fetch a list of media objects from an Instagram Business/Creator account
 * 
 * @param userId The Instagram user ID
 * @param accessToken The Instagram Graph API access token
 * @param limit Optional number of media objects to retrieve (default: 25)
 * @returns Promise containing the media data
 */
export async function getUserMedia(
  userId: string,
  accessToken: string,
  limit: number = 25
): Promise<MediaResponse> {
  try {
    // The Instagram Graph API endpoint for user media
    const endpoint = `https://graph.instagram.com/v18.0/${userId}/media`;
    
    // Build the URL with parameters
    const url = `${endpoint}?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&limit=${limit}&access_token=${accessToken}`;
    
    // Make the API request
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Instagram API Error: ${errorData.error.message}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Instagram user media:', error);
    throw error;
  }
}

/**
 * Exchange an auth code for a long-lived access token
 * Note: This should be performed on the server side to keep your app secret secure
 * 
 * @param authCode The authorization code received from Instagram
 * @param clientId Your Instagram App ID
 * @param clientSecret Your Instagram App Secret (keep this secure!)
 * @param redirectUri The redirect URI used in the authorization request
 * @returns Promise containing the access token response
 */
export async function exchangeCodeForToken(
  authCode: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<TokenResponse> {
  try {
    // The Instagram OAuth token endpoint
    const tokenEndpoint = 'https://api.instagram.com/oauth/access_token';
    
    // Prepare the form data for the token request
    const formData = new FormData();
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);
    formData.append('grant_type', 'authorization_code');
    formData.append('redirect_uri', redirectUri);
    formData.append('code', authCode);
    
    // Make the API request
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Instagram OAuth Error: ${JSON.stringify(errorData)}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error exchanging code for access token:', error);
    throw error;
  }
}
