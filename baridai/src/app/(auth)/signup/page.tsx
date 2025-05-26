"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/providers/auth-context";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const success = await signup(username, email, password);
      console.log("Registration complete, success:", success);

      // Show success message before redirect happens
      setSuccessMessage(
        "Account created successfully! Redirecting to dashboard..."
      );

      // The auth context will handle redirection and token storage
    } catch (err: unknown) {
      console.error("Signup error:", err);

      // Check for common API errors and provide user-friendly messages
      if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof err.message === "string"
      ) {
        if (
          err.message.includes("already exists") ||
          err.message.includes("already taken")
        ) {
          setError(
            "Username or email already in use. Please try a different one."
          );
        } else if (
          err.message.includes("network") ||
          err.message.includes("connect")
        ) {
          setError(
            "Cannot connect to the server. Please check your internet connection and try again."
          );
        } else {
          setError(
            err.message ||
              "There was a problem creating your account. Please try again."
          );
        }
      } else {
        setError(
          "There was a problem creating your account. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] bg-gradient-to-b from-[#0b1d3a] via-[#1e3a6d] to-[#5a6fa3] flex flex-col">
      {/* Navigation - Using the proper Navbar component */}
      {/* <Navbar transparent={true} showToggle={false} /> */}

      <main className="flex-1 flex relative overflow-hidden">
        <div className="w-full flex flex-col lg:flex-row items-stretch">
          {/* Left side: Signup form */}
          <div className="w-full lg:w-2/5 px-8 py-12 flex items-center justify-center z-20">
            <div className="w-full max-w-md">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Create Your Account
                  </h1>
                  <p className="text-blue-200">
                    Start managing your Instagram with AI
                  </p>
                </div>
                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-lg mb-6">
                    {error}
                  </div>
                )}
                {successMessage && (
                  <div className="bg-green-500/20 border border-green-500/50 text-white px-4 py-3 rounded-lg mb-6">
                    {successMessage}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
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
                      placeholder="yourUsername"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-blue-100 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="you@example.com"
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
                      placeholder="Create a strong password"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-medium text-blue-100 mb-2"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Confirm your password"
                    />
                  </div>

                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        required
                        className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-white/20 bg-white/5 rounded"
                      />
                    </div>
                    <div className="ml-3">
                      <label
                        htmlFor="terms"
                        className="text-xs text-blue-200 leading-relaxed"
                      >
                        I agree to the{" "}
                        <a
                          href="#"
                          className="text-blue-300 hover:text-blue-200 font-medium"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="text-blue-300 hover:text-blue-200 font-medium"
                        >
                          Privacy Policy
                        </a>
                      </label>
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
                          <span>Creating account...</span>
                        </>
                      ) : (
                        <span>Create Account</span>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-blue-200">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-blue-300 hover:text-blue-200 font-medium"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Image with overlay text (hidden on mobile) */}
          <div className="hidden lg:block absolute right-0 top-0 w-[60%] h-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0b1d3a]/60 to-[#0b1d3a] z-10"></div>
            <img
              src="/images/auth/signup.webp"
              alt="Barid AI Dashboard"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-center px-16 z-20">
              <div className="lg:max-w-xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  AI-Powered <br />
                  Social Media Management
                </h1>
                <p className="text-xl text-blue-100">
                  Join thousands of creators using our platform to supercharge
                  their social media presence with AI assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}
