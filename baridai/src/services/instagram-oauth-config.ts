// src/services/instagram-oauth-config.ts

import axios from "axios";

const INSTAGRAM_APP_ID = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
const SITE_URL = "https://baridai.com";
export const INSTAGRAM_VERIFY_TOKEN = "baridai_instagram_verify_token_12345"; // Custom verification token

interface TokenResponse {
  access_token: string;
  user_id: string;
  expires_in?: number; // in seconds
}

interface ShortLivedTokenResponse {
  access_token: string;
  user_id: string;
}

interface LongLivedTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number; // in seconds
}

interface InstagramUserProfile {
  id: string;
  username: string;
}

/**
 * Exchange short-lived token for a long-lived token
 * @param shortLivedToken The short-lived token from initial auth
 * @returns Long-lived token response (60 days validity)
 */
export async function exchangeForLongLivedToken(
  shortLivedToken: string
): Promise<LongLivedTokenResponse> {
  try {
    // Build the URL with parameters for token exchange
    const url = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${INSTAGRAM_APP_SECRET}&access_token=${shortLivedToken}`;

    const response = await axios.get<LongLivedTokenResponse>(url);

    if (response.status !== 200) {
      throw new Error(`Failed to exchange for long-lived token: ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error exchanging for long-lived token:", error);
    throw error;
  }
}

export async function exchangeCodeForToken(code: string): Promise<TokenResponse> {
  try {
    // Use the correct redirect URI that matches what we registered with Instagram
    const redirectUri = "https://baridai.com/webhook/instagram/auth-callback";

    const params = new URLSearchParams();
    params.append("client_id", INSTAGRAM_APP_ID || "");
    params.append("client_secret", INSTAGRAM_APP_SECRET || "");
    params.append("grant_type", "authorization_code");
    params.append("redirect_uri", redirectUri);
    params.append("code", code);

    console.log("Exchanging code for token with params:", {
      clientId: INSTAGRAM_APP_ID,
      redirectUri,
      codeLength: code?.length || 0
    });

    // First, get the short-lived access token
    const response = await axios.post<ShortLivedTokenResponse>(
      "https://api.instagram.com/oauth/access_token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const shortLivedToken: ShortLivedTokenResponse = response.data;
    console.log("Short-lived token obtained:", { userId: shortLivedToken.user_id });

    // Now exchange it for a long-lived token
    const longLivedToken = await exchangeForLongLivedToken(shortLivedToken.access_token);

    return {
      access_token: longLivedToken.access_token,
      user_id: shortLivedToken.user_id,
      expires_in: longLivedToken.expires_in
    };
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    throw error;
  }
}

export async function getUserProfile(accessToken: string): Promise<InstagramUserProfile> {
  try {
    const response = await axios.get<InstagramUserProfile>(
      `https://graph.instagram.com/v22.0/me?fields=id,username&access_token=${accessToken}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export function getInstagramAuthUrl(): string {
  if (!INSTAGRAM_APP_ID) {
    throw new Error("Instagram App ID not found in environment variables");
  }

  // Use webhook URL for redirect as configured in Meta for Developers settings
  const redirectUri = encodeURIComponent("https://baridai.com/webhook/instagram/auth-callback");

  // Instagram Business API scopes for enhanced functionality
  const scope = encodeURIComponent("instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish,instagram_business_manage_insights");

  console.log("Using App ID:", INSTAGRAM_APP_ID);
  console.log("Using Redirect URI:", "https://baridai.com/webhook/instagram/auth-callback");

  // Instagram Business OAuth URL with additional parameters
  return `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${INSTAGRAM_APP_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
}