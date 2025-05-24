// Authentication service for interacting with the backend API

import { jwtDecode } from "jwt-decode";

export type User = {
  id: number;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
};

type TokenPayload = {
  sub: number; // JWT standard for subject (user id)
  username: string;
  email: string;
  exp: number;
  iat: number;
};

export type AuthResponse = {
  access_token: string;
  user: User;
};

// Your backend API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4008";

export class AuthService {
  // Get current user from token
  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;
    
    // Get token from cookies instead of localStorage for better compatibility with middleware
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        // Token expired
        this.removeToken();
        return null;
      }
      
      return {
        id: decoded.sub,
        username: decoded.username,
        email: decoded.email
      };
    } catch (error) {
      console.error("Failed to decode token:", error);
      this.removeToken();
      return null;
    }
  }

  // Login with username and password
  static async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
      
      const data = await response.json();
      // Use the new method to set the token in both cookie and localStorage
      this.setToken(data.access_token);
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  // Register a new user
  static async register(username: string, email: string, password: string): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
      
      const userData = await response.json();
      
      // After successful registration, you might want to log in the user automatically
      // or just return the created user data
      return userData;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  // Set token in both cookie (for middleware) and localStorage (for client usage)
  static setToken(token: string): void {
    if (typeof window === "undefined") return;
    
    // Set cookie for middleware with SameSite=Lax for better browser compatibility
    document.cookie = `access_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`; // 7 days
    
    // Also store in localStorage for client-side usage
    localStorage.setItem("access_token", token);
    
    console.log("Token set in cookie and localStorage");
  }
  
  // Remove token from both cookie and localStorage
  static removeToken(): void {
    if (typeof window === "undefined") return;
    
    // Remove from cookie
    document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // Remove from localStorage
    localStorage.removeItem("access_token");
  }

  // Logout the current user
  static logout(): void {
    this.removeToken();
  }

  // Check if user is logged in
  static isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  // Get auth token - first try from cookie, then from localStorage
  static getToken(): string | null {
    if (typeof window === "undefined") return null;
    
    // Try from cookie first
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'access_token') {
        return value;
      }
    }
    
    // Fall back to localStorage
    return localStorage.getItem("access_token");
  }
  
  // Get authorization header for API requests
  static getAuthHeader(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
