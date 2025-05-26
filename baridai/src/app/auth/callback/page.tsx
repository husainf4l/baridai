"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  exchangeCodeForToken,
  getUserProfile,
} from "@/services/instagram-oauth-config";
import { addIntegration } from "@/services/integrations-service";

// Wrapper component that uses searchParams
function CallbackContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      try {
        // Get the authorization code from the URL
        const code = searchParams.get("code");
        if (!code) {
          const error = searchParams.get("error");
          const errorReason = searchParams.get("error_reason");
          const errorDescription = searchParams.get("error_description");
          throw new Error(
            `Authentication failed: ${error || ""} ${errorReason || ""} ${
              errorDescription || ""
            }`
          );
        }

        // Exchange the code for an access token
        const tokenResponse = await exchangeCodeForToken(code);
        console.log("Token response:", tokenResponse);

        // Get user profile to get the Instagram ID
        const userProfile = await getUserProfile(tokenResponse.access_token);
        console.log("User profile:", userProfile);

        // Get JWT token from localStorage
        const jwtToken = localStorage.getItem("access_token");
        if (!jwtToken) {
          throw new Error(
            "You are not logged in. Please log in to connect your Instagram account."
          );
        }

        // Calculate expiration date (Instagram tokens typically last 60 days)
        const expiresInSeconds = tokenResponse.expires_in || 5184000; // Default to 60 days if not specified
        const expiresAt = new Date(
          Date.now() + expiresInSeconds * 1000
        ).toISOString();

        // Save the integration to the backend
        await addIntegration(
          {
            name: "INSTAGRAM",
            token: tokenResponse.access_token,
            expiresAt,
            instagramId: userProfile.id,
          },
          jwtToken
        );

        // Send message to parent window if it exists
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "META_AUTH_SUCCESS",
              accessToken: tokenResponse.access_token,
              expiresAt,
              instagramId: userProfile.id,
            },
            window.location.origin
          );
        }

        setStatus("success");

        // Close the popup after a short delay
        setTimeout(() => {
          if (window.opener) {
            window.close();
          } else {
            // If not opened as a popup, redirect back to integrations page
            router.push("/integrations");
          }
        }, 2000);
      } catch (error) {
        console.error("Instagram OAuth Error:", error);
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "An unknown error occurred"
        );

        // Send error message to parent window if it exists
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "META_AUTH_ERROR",
              error:
                error instanceof Error
                  ? error.message
                  : "An unknown error occurred",
            },
            window.location.origin
          );

          setTimeout(() => {
            window.close();
          }, 3000);
        }
      }
    }

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Connecting Instagram...
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Please wait while we complete the authentication process.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-green-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Instagram Connected!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              You can now close this window and return to the app.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-red-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Connection Failed
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {errorMessage ||
                "There was a problem connecting your Instagram account."}
            </p>
            <button
              onClick={() => window.close()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Main component that wraps the content in a Suspense boundary
export default function InstagramCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Loading...
            </h1>
          </div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
