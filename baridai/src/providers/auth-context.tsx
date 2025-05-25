"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthService } from "@/services/auth-service";

// Define the shape of the user object
interface User {
  id: string;
  email: string;
  username: string; // Make sure username is included
  name?: string;
}

// Define the shape of the auth context
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // First check if there's a token using AuthService
        const token = AuthService.getToken();

        // Then check localStorage for existing user data
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          console.log("Found stored user:", JSON.parse(storedUser));
          console.log("Found auth token:", token.substring(0, 20) + "...");
          
          // Always validate token with backend before accepting it
          try {
            const isValid = await AuthService.verifyTokenWithBackend();
            if (isValid) {
              console.log("Token validated with backend");
              setUser(JSON.parse(storedUser));
            } else {
              console.warn("Token validation failed - clearing auth data");
              AuthService.removeToken();
              localStorage.removeItem("user");
            }
          } catch (verifyError) {
            console.error("Backend validation error:", verifyError);
            console.warn("Backend unavailable, clearing auth data");
            AuthService.removeToken();
            localStorage.removeItem("user");
          }
        } else if (!token && storedUser) {
          // If we have user data but no token, clear it and require re-authentication
          console.log("Found user data but no token - requiring re-authentication");
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Clean up if there was an error
        AuthService.removeToken();
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Route protection for /app routes
  useEffect(() => {
    if (!isLoading) {
      // Check if the route is a app route
      const isProtectedRoute = pathname?.startsWith("/app");

      if (isProtectedRoute && !user) {
        console.log(
          "Unauthorized access attempt to protected route:",
          pathname
        );
        router.push("/login");
      }
    }
  }, [isLoading, user, pathname, router]);

  // Session validation check
  useEffect(() => {
    // Initial check when route changes
    const validateUserSession = async () => {
      // Only check when user is logged in and on protected routes
      if (user && pathname?.startsWith("/app")) {
        try {
          console.log("Validating user session...");
          const sessionStatus = await AuthService.validateSession();

          if (!sessionStatus.valid) {
            console.error(
              `Session validation failed: ${sessionStatus.errorType}`,
              sessionStatus.message
            );

            // Clean up authentication data
            AuthService.removeToken();
            localStorage.removeItem("user");
            setUser(null);

            // Redirect to login with appropriate error message
            let errorParam = "auth_invalid";

            // Use specific error types for better user experience
            if (sessionStatus.errorType === "token_expired") {
              errorParam = "session_expired";
            } else if (sessionStatus.errorType === "backend_unavailable") {
              errorParam = "backend_unavailable";
            }

            router.push(`/login?error=${errorParam}`);
          } else {
            console.log("Session validation successful");
          }
        } catch (error) {
          console.error("Session validation check failed:", error);
        }
      }
    };

    // Run initial check
    validateUserSession();

    // Set up periodic token validation (every 5 minutes)
    const sessionCheckInterval = setInterval(async () => {
      if (user) {
        console.log("Running periodic session validation check");
        const sessionStatus = await AuthService.validateSession();

        if (!sessionStatus.valid) {
          console.error(
            `Periodic session check failed: ${sessionStatus.errorType}`,
            sessionStatus.message
          );

          // Clean up authentication data
          AuthService.removeToken();
          localStorage.removeItem("user");
          setUser(null);

          // Redirect to login with appropriate error message
          router.push(`/login?error=session_expired`);
        }
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Clean up interval
    return () => clearInterval(sessionCheckInterval);
  }, [user, pathname, router]);

  // Debug user state changes
  useEffect(() => {
    console.log("Auth state changed:", { user, isLoading });
  }, [user, isLoading]);

  // Login function
  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    console.log("Login attempt for:", username);
    setIsLoading(true);

    try {
      // Validate input
      if (!username || !password) {
        throw new Error("Username and password are required");
      }

      try {
        // Call the real backend API through our AuthService
        const authResponse = await AuthService.login(username, password);

        if (!authResponse || !authResponse.user) {
          throw new Error("Invalid response from server");
        }

        const userData = authResponse.user;

        // Extract user information from the response
        const userInfo = {
          id: userData.id.toString(),
          username: userData.username,
          email: userData.email,
          // Add any additional fields from the response
        };

        console.log("Login successful, user:", userInfo);

        // Update state with the user data from server
        setUser(userInfo);

        // Store user in localStorage
        localStorage.setItem("user", JSON.stringify(userInfo));

        // Note: The token is already set by AuthService.login
        // No need to generate a mock token anymore

        // After successful login, navigate to the app
        router.push("/app");

        return true;
      } catch (apiError: any) {
        // Handle API errors
        console.error("API login error:", apiError);

        // Display appropriate error based on connection status
        if (apiError.message && apiError.message.includes("NetworkError") || 
            apiError.message && apiError.message.includes("Failed to fetch") ||
            apiError.name === "AbortError") {
          throw new Error("Backend server is unavailable. Please try again later.");
        }
        // In all cases, rethrow the error for proper handling
        throw apiError;
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    try {
      console.log("Logging out user");

      // Clear user data from localStorage
      localStorage.removeItem("user");

      // Use AuthService to properly remove tokens from cookies and localStorage
      AuthService.removeToken();

      // Reset user state
      setUser(null);

      // Navigate to login page
      router.push("/login");

      console.log("Logout completed successfully");
    } catch (error) {
      console.error("Error during logout:", error);

      // Ensure token is removed even if other steps fail
      AuthService.removeToken();

      // Force page reload as fallback if router navigation fails
      window.location.href = "/login";
    }
  };

  // Signup function
  const signup = async (
    username: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    console.log("Sign up attempt for:", username, email);
    setIsLoading(true);

    try {
      // Validate input
      if (!username || !email || !password) {
        throw new Error("Username, email, and password are required");
      }

      try {
        // Call the real backend API through AuthService
        const response = await AuthService.register(username, email, password);

        if (!response) {
          throw new Error("No response from server");
        }

        // Check if we have user data in the response
        const userData = response.user;
        if (!userData) {
          throw new Error("Invalid response: missing user data");
        }

        // Create a user object from the response
        const userInfo = {
          id: userData.id.toString(),
          username: userData.username,
          email: userData.email,
          // Add any additional fields from the response
        };

        console.log("Registration successful, user:", userInfo);

        // Update state with the user data from server
        setUser(userInfo);

        // Store user in localStorage
        localStorage.setItem("user", JSON.stringify(userInfo));

        // If token wasn't already set by AuthService.register, we should login manually
        if (!response.access_token) {
          console.log(
            "No token in registration response, redirecting to login"
          );
          router.push("/login");
          return true;
        }

        // Otherwise navigate to the app since we're already logged in
        console.log("User registered and authenticated, redirecting to app");
        router.push("/app/home");

        return true;
      } catch (apiError: any) {
        // Handle API errors
        console.error("API registration error:", apiError);

        // Display appropriate error based on connection status
        if (apiError.message && apiError.message.includes("NetworkError") || 
            apiError.message && apiError.message.includes("Failed to fetch") ||
            apiError.name === "AbortError") {
          throw new Error("Backend server is unavailable. Please try again later.");
        }
        // In all cases, rethrow the error for proper handling
        throw apiError;
      }
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
