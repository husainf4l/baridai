// Authentication service for interacting with the backend API

import { jwtDecode } from "jwt-decode";

export type User = {
  id: number | string;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
};

type TokenPayload = {
  sub: number | string; // JWT standard for subject (user id)
  username: string; // The username from the token
  exp: number;     // Token expiration timestamp
  iat: number;     // Token issue timestamp
  // Note: email is not included in the token, it comes from the user object in the response
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
      
      // Get stored user data from localStorage to get the email
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        console.error("Token exists but no user data found in localStorage");
        return null;
      }
      
      try {
        // Parse stored user data
        const userData = JSON.parse(storedUser);
        
        // Return combined user data from token and stored user info
        return {
          id: decoded.sub,
          username: decoded.username,
          email: userData.email // Email comes from stored user data
        };
      } catch (parseError) {
        console.error("Failed to parse stored user data:", parseError);
        return null;
      }
    } catch (error) {
      console.error("Failed to decode token:", error);
      this.removeToken();
      return null;
    }
  }

  // Login with username and password
  static async login(username: string, password: string): Promise<AuthResponse> {
    try {
      console.log("Attempting login with backend...");
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        // Add timeout to prevent long waiting times when backend is down
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (!response.ok) {
        // Try to get error message from response
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || `Login failed with status: ${response.status}`);
        } catch (jsonError) {
          // If we can't parse JSON, use status text
          throw new Error(`Login failed: ${response.statusText || response.status}`);
        }
      }
      
      const data = await response.json();
      
      // Verify the response format matches what we expect
      if (!data.access_token) {
        throw new Error("No access token returned from server");
      }
      
      if (!data.user || !data.user.id || !data.user.username || !data.user.email) {
        throw new Error("Invalid user data returned from server");
      }
      
      // Store user data in localStorage for later use
      localStorage.setItem("user", JSON.stringify(data.user));
      
      console.log("Login successful, received token and user data:", {
        token: data.access_token.substring(0, 20) + "...",
        user: data.user
      });
      
      // Use the method to set the token in both cookie and localStorage
      this.setToken(data.access_token);
      
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  // Register a new user
  static async register(username: string, email: string, password: string): Promise<AuthResponse> {
    try {
      console.log("Sending registration request to backend...");
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
        // Add timeout to prevent long waiting times when backend is down
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (!response.ok) {
        // Try to get error message from response
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || `Registration failed with status: ${response.status}`);
        } catch (jsonError) {
          // If we can't parse JSON, use status text
          throw new Error(`Registration failed: ${response.statusText || response.status}`);
        }
      }
      
      const data = await response.json();
      
      if (!data.access_token) {
        console.log("Registration successful, but no token provided. User must login separately.");
        return data;
      }
      
      console.log("Registration successful with token");
      
      // Set the token if it was returned from the registration endpoint
      this.setToken(data.access_token);
      
      return data;
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

  // Verify token with backend to ensure backend is available and token is valid
  static async verifyTokenWithBackend(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;
      
      // In NestJS, we typically use a profile or protected endpoint to verify tokens
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: "GET",
        headers: {
          ...this.getAuthHeader(),
        },
        // Add timeout to prevent long waiting times
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      // A successful response means the token is valid
      if (!response.ok) {
        console.error("Token verification failed:", response.status);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Backend verification failed:", error);
      return false;
    }
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
  
  /**
   * Validates the current session by checking token validity with backend
   * Returns an object with validation status and error details
   */
  static async validateSession(): Promise<{
    valid: boolean;
    errorType?: 'token_missing' | 'token_expired' | 'backend_unavailable' | 'token_invalid';
    message?: string;
  }> {
    // First check if token exists
    const token = this.getToken();
    if (!token) {
      return { 
        valid: false, 
        errorType: 'token_missing',
        message: 'No authentication token found'
      };
    }
    
    // Check if token is expired locally (to avoid unnecessary API calls)
    try {
      console.log("Attempting to decode token:", token.substring(0, 20) + "...");
      
      // Validate token format before attempting to decode
      if (!token.includes('.') || token.split('.').length !== 3) {
        console.error("Invalid token format - missing parts");
        return {
          valid: false,
          errorType: 'token_invalid',
          message: 'Invalid token format'
        };
      }
      
      const decoded = jwtDecode<TokenPayload>(token);
      console.log("Token decoded successfully:", decoded);
      
      const currentTime = Date.now() / 1000;
      
      if (!decoded.exp) {
        console.error("Token missing expiration");
        return {
          valid: false,
          errorType: 'token_invalid',
          message: 'Token missing expiration date'
        };
      }
      
      if (decoded.exp < currentTime) {
        // Token is expired
        console.log("Token expired:", decoded.exp, "Current time:", currentTime);
        this.removeToken();
        return { 
          valid: false, 
          errorType: 'token_expired',
          message: 'Authentication token has expired' 
        };
      }
      
      // Validate with backend
      try {
        // In NestJS, JWT strategy typically validates tokens via the Authorization header
        // We'll call a protected endpoint that requires an authentic token
        const response = await fetch(`${API_URL}/auth/profile`, {
          method: "GET", 
          headers: {
            "Content-Type": "application/json",
            ...this.getAuthHeader(),
          },
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });
        
        if (!response.ok) {
          // Check specific status codes
          if (response.status === 401) {
            return { 
              valid: false, 
              errorType: 'token_invalid',
              message: 'Authentication token is invalid or expired' 
            };
          }
          
          return { 
            valid: false, 
            errorType: 'token_invalid',
            message: `Server rejected token validation with status ${response.status}` 
          };
        }
        
        // If we got a successful response, the token is valid
        const userData = await response.json();
        console.log("Token validation successful, user profile:", userData);
        
        // Token is valid
        return { valid: true };
        
      } catch (error) {
        // Network error or timeout
        console.error("Backend validation error:", error);
        return { 
          valid: false, 
          errorType: 'backend_unavailable',
          message: 'Could not connect to authentication server' 
        };
      }
    } catch (error) {
      // Token decoding error
      console.error("Token decode error:", error);
      
      // Get more detailed error information
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error details:", errorMessage);
      
      // Remove the invalid token
      this.removeToken();
      
      return { 
        valid: false, 
        errorType: 'token_invalid',
        message: `Invalid authentication token: ${errorMessage}` 
      };
    }
  }
  
  // Mock token functionality has been removed
}
