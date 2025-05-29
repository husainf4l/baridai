"use client";

import React, { useEffect, useState } from "react";
import {
  MessageCircle,
  Camera,
  Share2,
  CheckCircle,
  Edit2,
  Trash2,
  Calendar,
  Clock,
} from "lucide-react";
import {
  getIntegrations,
  Integration,
  addIntegration,
} from "@/services/integrations-service";
import { getInstagramAuthUrl } from "@/services/instagram-oauth-config";

export default function IntegrationsPage() {
  const [connectedPlatforms, setConnectedPlatforms] = useState<
    Record<string, boolean>
  >({
    Instagram: false,
    WhatsApp: false,
    Facebook: false,
  });
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoadingIntegrations, setIsLoadingIntegrations] = useState(true);

  useEffect(() => {
    // Listen for messages from the authentication popup
    const handleAuthMessage = async (event: MessageEvent) => {
      console.log("Received message:", event.data);
      if (event.data.type === "INSTAGRAM_AUTH_SUCCESS") {
        console.log("Instagram authentication successful", event.data);
        setConnectedPlatforms((prev) => ({ ...prev, Instagram: true }));
        setIsConnecting(null);

        // Save the integration through our API
        const saveIntegration = async () => {
          try {
            const jwtToken = localStorage.getItem("access_token");
            if (!jwtToken) {
              console.error("No JWT token found for saving integration");
              return;
            }
            
            // Get Instagram app credentials
            const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;
            const redirectUri = "https://baridai.com/webhook/instagram/auth-callback";
            
            // Save the integration with the token and account info we received
            await fetch("https://baridai.com/api/integrations/instagram", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${jwtToken}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                token: event.data.accessToken,
                instagramId: event.data.instagramId,
                username: event.data.username,
                expiresAt: event.data.expiresAt,
                clientId: clientId,
                redirectUri: redirectUri
              })
            });
            
            // Refresh integrations list after successful integration
            const integrations = await getIntegrations(jwtToken);
            setIntegrations(integrations);
          } catch (err) {
            console.error("Failed to save integration:", err);
          }
        };
        
        saveIntegration();
      }
    };

    // Also check for cookies as a fallback mechanism
    const checkForInstagramAuth = () => {
      // Check cookies for instagram_connected token
      const instagramConnected = document.cookie
        .split("; ")
        .find(row => row.startsWith("instagram_connected="));
      
      if (instagramConnected) {
        // Remove the cookie after reading it
        document.cookie = "instagram_connected=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        console.log("Instagram authentication detected via cookie");
        setConnectedPlatforms((prev) => ({ ...prev, Instagram: true }));
        setIsConnecting(null);
        
        // Save the integration through our API
        const saveIntegration = async () => {
          try {
            const jwtToken = localStorage.getItem("access_token");
            if (!jwtToken) return;
            
            await fetch("https://baridai.com/api/integrations/instagram", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${jwtToken}`,
                "Content-Type": "application/json"
              }
            });
            
            // Refresh integrations list
            const integrations = await getIntegrations(jwtToken);
            setIntegrations(integrations);
          } catch (err) {
            console.error("Failed to save integration:", err);
          }
        };
        
        saveIntegration();
      }
    };
    
    // Add event listener for messages and also check cookies
    window.addEventListener("message", handleAuthMessage);
    checkForInstagramAuth();
    
    // When window gets focus (popup closed), check again
    const handleFocus = () => {
      checkForInstagramAuth();
    };
    window.addEventListener("focus", handleFocus);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener("message", handleAuthMessage);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  useEffect(() => {
    console.log("=== INTEGRATIONS PAGE USEEFFECT ===");

    // Fetch available integrations from the service
    const jwtToken = localStorage.getItem("access_token");
    console.log("JWT Token found:", !!jwtToken);
    console.log("JWT Token value:", jwtToken);
    console.log("API Base URL:", process.env.NEXT_PUBLIC_API_URL);

    if (jwtToken) {
      console.log("About to fetch integrations...");
      setIsLoadingIntegrations(true);
      getIntegrations(jwtToken)
        .then((data) => {
          console.log("Fetched integrations successfully:", data);
          console.log("Data type:", typeof data);
          console.log("Is array:", Array.isArray(data));

          // Ensure data is an array
          const integrationsList = Array.isArray(data) ? data : [];
          setIntegrations(integrationsList);

          // Update connectedPlatforms based on integrations
          const platforms: Record<string, boolean> = {
            Instagram: false,
            WhatsApp: false,
            Facebook: false,
          };
          integrationsList.forEach((integration) => {
            if (integration.name === "INSTAGRAM") platforms.Instagram = true;
            if (integration.name === "WHATSAPP") platforms.WhatsApp = true;
            if (integration.name === "FACEBOOK") platforms.Facebook = true;
          });
          setConnectedPlatforms(platforms);
        })
        .catch((err) => {
          console.error("Failed to fetch integrations", err);
          if (err.response) {
            console.error(
              "Error details:",
              err.response.data,
              err.response.status
            );
          } else if (err.request) {
            console.error("No response received:", err.request);
          } else {
            console.error("Error setting up request:", err.message);
          }
          console.error("Full error object:", err);
        })
        .finally(() => {
          setIsLoadingIntegrations(false);
        });
    } else {
      console.log("No JWT token found in localStorage");
      console.log("All localStorage keys:", Object.keys(localStorage));
      setIsLoadingIntegrations(false);
    }
  }, []);

  const handleMetaAuthentication = () => {
    setIsConnecting("Instagram");

    try {
      // Get the Instagram App ID from environment variables
      const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID || "1406669200250374";
      
      console.log("Using Instagram App ID:", clientId);
      
      // Use the direct Instagram OAuth URL with environment variable
      const authUrl = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${clientId}&redirect_uri=https://baridai.com/webhook/instagram/auth-callback&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights`;

      console.log("Instagram OAuth URL:", authUrl);

      // Open Instagram OAuth dialog in a popup window with specific dimensions
      const popup = window.open(
        authUrl, 
        "instagram_login", 
        "width=600,height=700,status=yes,toolbar=no,menubar=no,location=no"
      );
      
      // Focus the popup
      if (popup) popup.focus();
      
      console.log("Initiating Instagram authentication...");
    } catch (error) {
      console.error("Failed to initiate Instagram authentication:", error);
      alert(
        "Could not connect to Instagram. Please check your environment configuration."
      );
      setIsConnecting(null);
    }
  };

  const handleIntegration = (platform: string) => {
    if (platform === "Instagram") {
      handleMetaAuthentication();
    } else {
      console.log(`Integrating with ${platform}...`);
      // Implementation for other platforms
    }
  };

  const handleEditIntegration = (integration: Integration) => {
    console.log("Edit integration:", integration);
    // TODO: Implement edit functionality
    alert(`Edit functionality for ${integration.name} coming soon!`);
  };

  const handleDeleteIntegration = async (integration: Integration) => {
    const confirmed = window.confirm(
      `Are you sure you want to disconnect ${integration.name.toLowerCase()}? This action cannot be undone.`
    );

    if (confirmed) {
      console.log("Delete integration:", integration);
      // TODO: Implement delete API call
      try {
        // For now, just remove from local state
        setIntegrations((prev) =>
          prev.filter((item) => item.id !== integration.id)
        );

        // Update connected platforms
        const updatedPlatforms = { ...connectedPlatforms };
        if (integration.name === "INSTAGRAM")
          updatedPlatforms.Instagram = false;
        if (integration.name === "WHATSAPP") updatedPlatforms.WhatsApp = false;
        if (integration.name === "FACEBOOK") updatedPlatforms.Facebook = false;
        setConnectedPlatforms(updatedPlatforms);

        alert(`${integration.name.toLowerCase()} disconnected successfully!`);
      } catch (error) {
        console.error("Failed to delete integration:", error);
        alert("Failed to disconnect integration. Please try again.");
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Social Media Integrations
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Connect your accounts to enhance your marketing capabilities.
        </p>
        {/* Integrations List */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Connected Integrations
          </h3>
          {isLoadingIntegrations ? (
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <div className="animate-spin h-8 w-8 mx-auto border-4 border-gray-300 border-t-blue-500 rounded-full"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading integrations...
              </p>
            </div>
          ) : integrations.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <Share2 className="h-8 w-8 mx-auto" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                No integrations connected yet.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Connect your social media accounts to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations.map((integration: Integration) => (
                <div
                  key={
                    integration.name +
                    (integration.instagramId ||
                      integration.instgramId ||
                      integration.id)
                  }
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                >
                  {/* Platform Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      {integration.name === "INSTAGRAM" && (
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg mr-3 shadow-sm">
                          <Camera className="h-4 w-4 text-white" />
                        </div>
                      )}
                      {integration.name === "WHATSAPP" && (
                        <div className="bg-green-500 p-2 rounded-lg mr-3 shadow-sm">
                          <MessageCircle className="h-4 w-4 text-white" />
                        </div>
                      )}
                      {integration.name === "FACEBOOK" && (
                        <div className="bg-blue-600 p-2 rounded-lg mr-3 shadow-sm">
                          <Share2 className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white capitalize">
                          {integration.name.toLowerCase()}
                        </h4>
                        <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleEditIntegration(integration)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit integration"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteIntegration(integration)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete integration"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Integration Details */}
                  <div className="space-y-2 text-sm">
                    {(integration.instagramId || integration.instgramId) && (
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <span className="font-medium mr-2">ID:</span>
                        <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {integration.instagramId || integration.instgramId}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Calendar className="h-3 w-3 mr-2" />
                      <span className="mr-2">Connected:</span>
                      <span className="text-xs">
                        {new Date(
                          integration.createdAt || Date.now()
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Clock className="h-3 w-3 mr-2" />
                      <span className="mr-2">Expires:</span>
                      <span className="text-xs">
                        {integration.expiresAt === "1970-01-01T00:00:00.000Z"
                          ? "Never"
                          : new Date(
                              integration.expiresAt
                            ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Status Bar */}
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">
                        Last updated:{" "}
                        {new Date(
                          integration.updatedAt || Date.now()
                        ).toLocaleDateString()}
                      </span>
                      <div className="flex items-center text-green-600 dark:text-green-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                        Active
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Instagram Integration */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
            <div className="flex items-center mb-2">
              <Camera className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-semibold">Instagram</h2>
            </div>
            <p className="text-white/80 text-sm">
              Share content and analyze engagement
            </p>
          </div>
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              Connect your Instagram account through Meta to schedule posts,
              manage DMs, and view analytics directly from your dashboard.
            </p>
            <button
              onClick={() => handleIntegration("Instagram")}
              disabled={
                connectedPlatforms.Instagram || isConnecting === "Instagram"
              }
              className={`w-full py-2 px-4 flex items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 ${
                connectedPlatforms.Instagram
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              } ${
                isConnecting === "Instagram"
                  ? "opacity-75 cursor-not-allowed"
                  : ""
              }`}
            >
              {isConnecting === "Instagram" ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Connecting...
                </>
              ) : connectedPlatforms.Instagram ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Connected to Instagram
                </>
              ) : (
                "Connect Instagram"
              )}
            </button>
          </div>
        </div>

        {/* WhatsApp Integration */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="bg-green-500 p-6 text-white">
            <div className="flex items-center mb-2">
              <MessageCircle className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-semibold">WhatsApp</h2>
            </div>
            <p className="text-white/80 text-sm">
              Manage customer conversations
            </p>
          </div>
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              Connect WhatsApp Business to send automated messages and engage
              with your customers in real-time.
            </p>
            <button
              onClick={() => handleIntegration("WhatsApp")}
              className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Connect WhatsApp
            </button>
          </div>
        </div>

        {/* Facebook Integration */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="bg-blue-600 p-6 text-white">
            <div className="flex items-center mb-2">
              <Share2 className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-semibold">Facebook</h2>
            </div>
            <p className="text-white/80 text-sm">Publish and monitor content</p>
          </div>
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              Connect your Facebook Business page to publish content and monitor
              audience engagement metrics.
            </p>
            <button
              onClick={() => handleIntegration("Facebook")}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Connect Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
