"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
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
          setUser(JSON.parse(storedUser));
        } else if (!token && storedUser) {
          // If we have user data but no token, set the token
          console.log("Found user but no token, restoring token...");
          const userData = JSON.parse(storedUser);
          // Generate a mock token for this user
          const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIke3VzZXJEYXRhLmlkfSIsInVzZXJuYW1lIjoiJHt1c2VyRGF0YS51c2VybmFtZX0iLCJlbWFpbCI6IiR7dXNlckRhdGEuZW1haWx9IiwiZXhwIjoxNzE2MzI5NjAwfQ.signature`;
          AuthService.setToken(mockToken);
          setUser(userData);
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
      // For development: simple validation to avoid empty users
      if (!username || !password) {
        throw new Error("Username and password are required");
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful login - in production this would be an API call
      const newUser = {
        id: Date.now().toString(),
        email: `${username}@example.com`,
        username: username,
      };

      console.log("Login successful, user:", newUser);

      // Update state
      setUser(newUser);

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(newUser));

      // Generate a mock token for development purposes
      const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIke25ld1VzZXIuaWR9Iiwibm9uY2UiOiIke0RhdGUubm93KCl9IiwidXNlcm5hbWUiOiIke3VzZXJuYW1lfSIsImVtYWlsIjoiJHtuZXdVc2VyLmVtYWlsfSIsImV4cCI6JHtNYXRoLmZsb29yKERhdGUubm93KCkgLyAxMDAwICsgNjAgKiA2MCAqIDI0ICogNyl9fQ.signature`;

      // Set token in cookies and localStorage using AuthService
      AuthService.setToken(mockToken);

      // Return success and let the component handle navigation
      return true;
    } catch (error: any) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    // Use AuthService to properly remove tokens from cookies and localStorage
    AuthService.removeToken();
    setUser(null);
    router.push("/login");
  };

  // Signup function
  const signup = async (
    username: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful signup
      const newUser = { id: Date.now().toString(), email, username };
      setUser(newUser);

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(newUser));

      // Navigate to dashboard after successful signup
      router.push("/dashboard");
      return true;
    } catch (error) {
      console.error("Signup failed:", error);
      return false;
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
