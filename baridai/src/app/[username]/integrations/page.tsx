"use client";

import React from "react";
import { MessageCircle, Camera, Share2 } from "lucide-react";

export default function IntegrationsPage() {
  const handleIntegration = (platform: string) => {
    console.log(`Integrating with ${platform}...`);
    // Here you would implement actual integration logic
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
              Connect your Instagram account to schedule posts and view
              analytics directly from your dashboard.
            </p>
            <button
              onClick={() => handleIntegration("Instagram")}
              className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              Connect Instagram
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
