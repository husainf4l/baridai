"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Debug information
  useEffect(() => {
    console.log("Dashboard rendering state:", { user, isLoading });
  }, [user, isLoading]);

  // Protect the dashboard route
  useEffect(() => {
    if (!isLoading && !user) {
      // Redirect to login if not authenticated
      console.log("Not authenticated, redirecting to login");
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0b1d3a] via-[#1e3a6d] to-[#5a6fa3] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mr-4"></div>
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // If not authenticated, don't render anything (will be redirected)
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0b1d3a] via-[#1e3a6d] to-[#5a6fa3] flex items-center justify-center">
        <div className="text-white text-xl">Redirecting to login...</div>
      </div>
    );
  }

  // Safe access to user properties to avoid runtime errors
  const username = user.username || user.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1d3a] via-[#1e3a6d] to-[#5a6fa3] p-6">
      {errorMessage && (
        <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-4 max-w-7xl mx-auto">
          {errorMessage}
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>
          <p className="text-blue-200 mt-2">Welcome back, {username}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              Instagram Account
            </h2>
            <p className="text-blue-200">
              Connect your Instagram account to start managing your DMs
            </p>
            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition">
              Connect Instagram
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              Recent Activity
            </h2>
            <p className="text-blue-200">No recent activity yet.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              Account Status
            </h2>
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <p className="text-white">Active</p>
            </div>
            <p className="text-blue-200">Free Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
