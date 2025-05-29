import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { addInstagramToken } from "@/services/integrations-service";

// Define types for Instagram API responses
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

// Instagram app credentials
const INSTAGRAM_APP_ID = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
const REDIRECT_URI = "https://baridai.com/webhook/instagram/auth-callback";

// Log environment variables (excluding secret values)
console.log("Instagram App Configuration:", {
    appIdExists: !!INSTAGRAM_APP_ID,
    appSecretExists: !!INSTAGRAM_APP_SECRET,
    redirectUri: REDIRECT_URI
});
// Make sure these URLs point to your actual integrations page path
const FRONTEND_SUCCESS_URL = "https://baridai.com/upthouse/integrations?auth=success";
const FRONTEND_ERROR_URL = "https://baridai.com/upthouse/integrations?auth=error";

export async function GET(request: NextRequest) {
    try {
        // Get the authorization code from the URL
        const url = new URL(request.url);
        const code = url.searchParams.get("code");

        if (!code) {
            const error = url.searchParams.get("error");
            const errorReason = url.searchParams.get("error_reason");
            const errorDescription = url.searchParams.get("error_description");

            console.error("Instagram OAuth error:", { error, errorReason, errorDescription });
            return NextResponse.redirect(FRONTEND_ERROR_URL);
        }

        // Exchange the code for an access token
        const params = new URLSearchParams();
        params.append("client_id", INSTAGRAM_APP_ID || "");
        params.append("client_secret", INSTAGRAM_APP_SECRET || "");
        params.append("grant_type", "authorization_code");
        params.append("redirect_uri", REDIRECT_URI);
        params.append("code", code);

        console.log("Exchanging code for token with params:", {
            clientId: INSTAGRAM_APP_ID,
            redirectUri: REDIRECT_URI,
            codeLength: code?.length || 0
        });

        // First, get the short-lived access token
        const response = await axios.post(
            "https://api.instagram.com/oauth/access_token",
            params,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        const { access_token: shortLivedToken, user_id: instagramId } = response.data as ShortLivedTokenResponse;
        console.log("Short-lived token obtained:", { userId: instagramId });

        // Now exchange it for a long-lived token
        const longLivedTokenResponse = await axios.get(
            `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${INSTAGRAM_APP_SECRET}&access_token=${shortLivedToken}`
        );

        const { access_token: longLivedToken, expires_in } = longLivedTokenResponse.data as LongLivedTokenResponse;

        // Get user profile to verify the connection
        const userProfileResponse = await axios.get(
            `https://graph.instagram.com/v22.0/me?fields=id,username&access_token=${longLivedToken}`
        );

        const { id, username } = userProfileResponse.data as InstagramUserProfile;
        console.log("Instagram user profile:", { id, username });

        // Calculate expiration date (Instagram tokens typically last 60 days)
        const expiresAt = new Date(Date.now() + expires_in * 1000);

        // Save the token directly to the backend
        try {
            // Try to get the JWT token from cookies
            const jwtToken = request.cookies.get("access_token")?.value;

            if (jwtToken) {
                console.log("Found JWT token in cookies, saving Instagram token to backend");

                try {
                    // Use the integrations service method to save the token with the correct format
                    await addInstagramToken(
                        longLivedToken,
                        id,
                        username,
                        expiresAt.toISOString(),
                        jwtToken
                    );
                    console.log("Successfully saved Instagram token to backend");
                } catch (serviceError) {
                    console.error("Error using service to save token:", serviceError);

                    // Fallback: try direct API call if service method fails
                    console.log("Attempting direct API call as fallback");
                    const payload = {
                        name: "INSTAGRAM",
                        token: longLivedToken,
                        instagramId: id,
                        expiresAt: expiresAt.toISOString(),
                        pageName: username
                    };
                    console.log("Payload:", JSON.stringify(payload));
                    const saveResponse = await axios.post(
                        "https://baridai.com/api/integrations/instagram",
                        payload,
                        {
                            headers: {
                                "Authorization": `Bearer ${jwtToken}`,
                                "Content-Type": "application/json"
                            }
                        }
                    );

                    console.log("Saved Instagram token to backend:", saveResponse.status);
                }
            } else {
                console.log("No JWT token found in cookies, will rely on frontend to save token");
            }
        } catch (saveError) {
            console.error("Error saving Instagram token to backend:", saveError);
            // Continue with the flow even if saving fails
        }

        // Instead of redirecting, return HTML that saves the token and closes the window
        const htmlResponse = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Instagram Authentication Complete</title>
        <script>
          // This function will run immediately when the page loads
          (function() {
            // Block any redirects by capturing popstate events
            history.pushState(null, "", window.location.href);
            window.addEventListener("popstate", function() {
              history.pushState(null, "", window.location.href);
            });
            
            // Function to send message to parent and close
            function completeAuth() {
              if (window.opener) {
                try {
                  // Send the message to the opener window
                  window.opener.postMessage({
                    type: "INSTAGRAM_AUTH_SUCCESS",
                    accessToken: "${longLivedToken}",
                    expiresAt: "${expiresAt.toISOString()}",
                    instagramId: "${id}",
                    username: "${username}"
                  }, "*");
                  
                  console.log("Message sent to opener");
                  
                  // Force close the window after a short delay
                  setTimeout(function() {
                    window.close();
                    // As a fallback, if window doesn't close, redirect to success URL
                    setTimeout(function() {
                      window.location.href = "https://baridai.com/upthouse/integrations?auth=success";
                    }, 300);
                  }, 100);
                } catch (e) {
                  console.error("Error sending message:", e);
                  // Fallback: redirect to success URL
                  window.location.href = "https://baridai.com/upthouse/integrations?auth=success";
                }
              } else {
                // If not opened as popup, redirect directly
                window.location.href = "https://baridai.com/upthouse/integrations?auth=success";
              }
            }
            
            // Execute immediately
            completeAuth();
          })();
        </script>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
            color: white;
            height: 100vh;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
          .container {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 40px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }
          h1 {
            margin-top: 0;
          }
          .spinner {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 4px solid white;
            width: 40px;
            height: 40px;
            margin: 20px auto;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Instagram Connected!</h1>
          <div class="spinner"></div>
          <p>Authentication successful. This window will close automatically.</p>
        </div>
      </body>
    </html>
    `;

        const response2 = new NextResponse(htmlResponse, {
            headers: {
                "Content-Type": "text/html",
            },
        });

        // Set cookies with the token information
        response2.cookies.set({
            name: "instagram_access_token",
            value: longLivedToken,
            expires: expiresAt,
            httpOnly: true,
            secure: true,
            path: "/",
        });

        response2.cookies.set({
            name: "instagram_user_id",
            value: instagramId,
            expires: expiresAt,
            httpOnly: true,
            secure: true,
            path: "/",
        });

        // Set a non-HttpOnly cookie to indicate successful authentication to the frontend
        response2.cookies.set({
            name: "instagram_connected",
            value: "true",
            expires: expiresAt,
            httpOnly: false,
            secure: true,
            path: "/",
        });

        return response2;

    } catch (error) {
        console.error("Error in Instagram OAuth callback:", error);
        return NextResponse.redirect(FRONTEND_ERROR_URL);
    }
}
