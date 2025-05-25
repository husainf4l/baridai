"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/providers/auth-context";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth-service";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { login, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check URL for error parameters
    const urlParams = new URLSearchParams(window.location.search);
    const errorType = urlParams.get("error");

    // Handle different types of auth errors
    if (errorType === "backend_unavailable") {
      setError(
        "Backend server is unavailable. Please try again later or contact support."
      );
    } else if (errorType === "auth_invalid") {
      setError("Your authentication is invalid. Please sign in again.");
    } else if (errorType === "session_expired") {
      setError("Your session has expired. Please sign in again to continue.");
    }

    // Clear the error parameter from URL to prevent showing again on refresh
    if (errorType) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("error");
      window.history.replaceState({}, document.title, newUrl.toString());
    }

    // Comment out the automatic redirection to allow users to stay on the login page
    // if (!isLoading && user) {
    //   router.push("/dashboard");
    // }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    try {
      // Always check if backend is available before attempting login
      try {
        // Use an AbortController to limit wait time
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        // Ping the backend with a lightweight request
        const pingResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/health`,
          {
            method: "GET",
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!pingResponse.ok) {
          throw new Error("Backend health check failed");
        }
      } catch (pingError) {
        console.error("Backend health check failed:", pingError);
        setError(
          "Authentication server is currently unavailable. Please try again later."
        );
        return;
      }

      console.log("Submitting login form...");
      const success = await login(username, password);

      if (success) {
        // Redirect to the user's home page after successful login
        if (username) {
          router.push(`/${username}/home`);
        } else {
          // fallback if username is not available
          router.push("/");
        }
        setLoginSuccess(true);
      }
    } catch (err: any) {
      console.error("Login error:", err);

      // Handle specific error messages
      if (
        err.message &&
        err.message.includes("Backend server is unavailable")
      ) {
        setError(
          "Authentication server is currently unavailable. Please try again later."
        );
      } else {
        setError(
          err.message || "Invalid username or password. Please try again."
        );
      }
    }
  };

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] bg-gradient-to-b from-[#0b1d3a] via-[#1e3a6d] to-[#5a6fa3] flex flex-col">
      {/* Navigation */}
      <div className="w-full max-w-7xl mx-auto px-4">
        <Link href="/" className="flex items-center space-x-2 py-6">
          <div className="bg-white p-2 rounded-md">
            <span className="font-bold text-blue-900">B</span>
          </div>
          <span className="text-white font-semibold text-lg">Barid AI</span>
        </Link>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-blue-200">Log in to your Barid AI account</p>
            </div>
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}
            {loginSuccess && (
              <div className="bg-green-500/20 border border-green-500/50 text-white px-4 py-3 rounded-lg mb-6">
                Login successful! You are now authenticated.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-blue-100 mb-2"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-blue-100 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-white/20 bg-white/5 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-blue-200"
                  >
                    Remember me
                  </label>
                </div>
                <div>
                  <a href="#" className="text-blue-300 hover:text-blue-200">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </div>
            </form>{" "}
            <div className="mt-8 text-center">
              <p className="text-blue-200">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-blue-300 hover:text-blue-200 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
