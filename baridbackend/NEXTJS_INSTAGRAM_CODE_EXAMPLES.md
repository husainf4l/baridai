# Instagram Integration - Next.js Code Examples

This document provides code examples for implementing Instagram integration in a Next.js frontend application.

## 1. Instagram Connect Component

Create this component to show a "Connect Instagram" button and initiate the OAuth flow.

**File: `/components/InstagramConnect.js`**

```jsx
import { useState } from 'react';
import axios from 'axios';

export default function InstagramConnect({ onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Instagram App ID from environment variables
  const instagramAppId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;
  
  // The redirect URI should match what's configured in Facebook Developer Portal
  const redirectUri = typeof window !== 'undefined' ? 
    `${window.location.origin}/instagram/callback` : '';
  
  // Scopes needed for your app
  const scope = 'user_profile,user_media';
  
  // Function to initiate Instagram OAuth flow
  const connectInstagram = () => {
    if (!instagramAppId) {
      setError('Instagram App ID not configured');
      return;
    }
    
    setIsLoading(true);
    
    // Construct the Instagram authorization URL
    const instagramAuthUrl = `https://api.instagram.com/oauth/authorize` +
      `?client_id=${instagramAppId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${scope}` +
      `&response_type=code`;
    
    // Redirect to Instagram authorization page
    window.location.href = instagramAuthUrl;
  };

  return (
    <div>
      {error && (
        <div className="bg-red-100 p-4 mb-4 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <button 
        onClick={connectInstagram}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded flex items-center"
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        Connect Instagram Account
      </button>
      
      <p className="text-sm text-gray-500 mt-2">
        Connect your Instagram account to post and manage content.
      </p>
    </div>
  );
}
```

## 2. Instagram Callback Page

This page handles the OAuth callback from Instagram after the user authorizes your app.

**File: `/pages/instagram/callback.js`**

```jsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';

export default function InstagramCallback() {
  const router = useRouter();
  const { code, error: instagramError } = router.query;
  const [status, setStatus] = useState('initializing');
  const [error, setError] = useState('');
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  
  useEffect(() => {
    // Wait until router is ready with query params
    if (!router.isReady) return;
    
    // Handle Instagram error response
    if (instagramError) {
      setStatus('error');
      setError(`Instagram authorization error: ${instagramError}`);
      return;
    }
    
    // If no code is provided, we can't proceed
    if (!code) {
      if (!instagramError) {
        setStatus('error');
        setError('No authorization code received from Instagram');
      }
      return;
    }
    
    setStatus('processing');
    
    // Exchange code for token
    const exchangeCode = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          setStatus('error');
          setError('Authentication required. Please log in.');
          return;
        }
        
        // Get the current URL origin for the redirectUri
        const redirectUri = `${window.location.origin}/instagram/callback`;
        
        // Call our backend API to exchange the code for a token
        await axios.post(`${apiBaseUrl}/integrations/instagram/token`, 
          { code, redirectUri },
          { headers: { Authorization: `Bearer ${token}` }}
        );
        
        // Success! Show success message and redirect after delay
        setStatus('success');
        setTimeout(() => {
          router.push('/dashboard/integrations');
        }, 3000);
        
      } catch (err) {
        console.error('Instagram connection error:', err);
        setStatus('error');
        setError(err.response?.data?.message || 'Failed to connect your Instagram account. Please try again.');
      }
    };
    
    exchangeCode();
  }, [router.isReady, code, instagramError, router, apiBaseUrl]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Head>
        <title>Instagram Connection | Your App</title>
      </Head>
      
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
        {status === 'initializing' && <p>Initializing...</p>}
        
        {status === 'processing' && (
          <>
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-bold mb-2">Connecting Instagram</h2>
            <p className="text-gray-600">Please wait while we connect your Instagram account...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <svg className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h2 className="text-xl font-bold mb-2">Instagram Connected!</h2>
            <p className="text-gray-600">Your Instagram account has been successfully connected.</p>
            <p className="text-sm text-gray-500 mt-4">Redirecting to dashboard...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <svg className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <h2 className="text-xl font-bold mb-2">Connection Failed</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/dashboard/integrations')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Back to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
```

## 3. Integrations Dashboard Page

This page displays all Instagram integrations and provides management options.

**File: `/pages/dashboard/integrations.js`**

```jsx
import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import InstagramConnect from '../../components/InstagramConnect';

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  
  // Fetch all integrations on component mount
  useEffect(() => {
    fetchIntegrations();
  }, []);
  
  const fetchIntegrations = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setError('Authentication required');
        setIsLoading(false);
        return;
      }
      
      const response = await axios.get(`${apiBaseUrl}/integrations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIntegrations(response.data);
    } catch (err) {
      console.error('Failed to fetch integrations:', err);
      setError('Failed to load integrations');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Refresh an Instagram token
  const refreshToken = async (integrationId) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      
      await axios.post(`${apiBaseUrl}/integrations/instagram/refresh/${integrationId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchIntegrations();
    } catch (err) {
      console.error('Failed to refresh token:', err);
      setError('Failed to refresh Instagram token');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete an integration
  const deleteIntegration = async (integrationId) => {
    if (!confirm('Are you sure you want to disconnect this account?')) {
      return;
    }
    
    try {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      
      await axios.delete(`${apiBaseUrl}/integrations/${integrationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchIntegrations();
    } catch (err) {
      console.error('Failed to delete integration:', err);
      setError('Failed to disconnect account');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter to only Instagram integrations
  const instagramIntegrations = integrations.filter(i => i.name === 'INSTAGRAM');
  
  // Format date helper
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Integrations | Your App</title>
      </Head>
      
      <h1 className="text-2xl font-bold mb-6">Account Integrations</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="text-sm underline">Dismiss</button>
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Instagram</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            {instagramIntegrations.length === 0 ? (
              <div className="bg-white rounded shadow p-6">
                <p className="mb-4">No Instagram accounts connected yet.</p>
                <InstagramConnect />
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  {instagramIntegrations.map(integration => (
                    <div key={integration.id} className="bg-white rounded shadow p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Instagram Account</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          new Date(integration.expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {new Date(integration.expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                            ? 'Token Expiring Soon'
                            : 'Active'}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <p><span className="text-gray-600">Instagram ID:</span> {integration.instagramId}</p>
                        <p><span className="text-gray-600">Expires:</span> {formatDate(integration.expiresAt)}</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => refreshToken(integration.id)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                        >
                          Refresh Token
                        </button>
                        <button 
                          onClick={() => deleteIntegration(integration.id)}
                          className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded"
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 border-t pt-6">
                  <h3 className="font-medium mb-3">Connect Another Account</h3>
                  <InstagramConnect />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
```

## 4. Instagram Service

Create a central service for Instagram-related API calls.

**File: `/services/instagramService.js`**

```javascript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

// Helper to get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

// Create axios instance with auth header
const createAuthAxios = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_BASE_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
};

const instagramService = {
  // Get all integrations
  getIntegrations: async () => {
    try {
      const api = createAuthAxios();
      const response = await api.get('/integrations');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch integrations:', error);
      throw error;
    }
  },
  
  // Get Instagram integrations only
  getInstagramIntegrations: async () => {
    try {
      const api = createAuthAxios();
      const response = await api.get('/integrations');
      return response.data.filter(i => i.name === 'INSTAGRAM');
    } catch (error) {
      console.error('Failed to fetch Instagram integrations:', error);
      throw error;
    }
  },
  
  // Exchange Instagram auth code for token
  exchangeAuthCode: async (code) => {
    try {
      const api = createAuthAxios();
      const redirectUri = `${window.location.origin}/instagram/callback`;
      
      const response = await api.post('/integrations/instagram/token', {
        code,
        redirectUri
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to exchange Instagram auth code:', error);
      throw error;
    }
  },
  
  // Refresh Instagram token
  refreshToken: async (integrationId) => {
    try {
      const api = createAuthAxios();
      const response = await api.post(`/integrations/instagram/refresh/${integrationId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to refresh Instagram token:', error);
      throw error;
    }
  },
  
  // Delete integration
  deleteIntegration: async (integrationId) => {
    try {
      const api = createAuthAxios();
      const response = await api.delete(`/integrations/${integrationId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete integration:', error);
      throw error;
    }
  },
  
  // Get Instagram auth URL
  getAuthUrl: () => {
    const instagramAppId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;
    const redirectUri = `${window.location.origin}/instagram/callback`;
    const scope = 'user_profile,user_media';
    
    return `https://api.instagram.com/oauth/authorize` +
      `?client_id=${instagramAppId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${scope}` +
      `&response_type=code`;
  }
};

export default instagramService;
```

## 5. Usage with React Context (Optional)

For larger applications, you might want to create a context to manage Instagram integration state:

**File: `/contexts/InstagramContext.js`**

```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import instagramService from '../services/instagramService';

const InstagramContext = createContext();

export const InstagramProvider = ({ children }) => {
  const [instagramAccounts, setInstagramAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const loadInstagramAccounts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const accounts = await instagramService.getInstagramIntegrations();
      setInstagramAccounts(accounts);
    } catch (err) {
      console.error('Failed to load Instagram accounts:', err);
      setError('Failed to load Instagram connections');
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshToken = async (integrationId) => {
    try {
      setIsLoading(true);
      await instagramService.refreshToken(integrationId);
      await loadInstagramAccounts();
    } catch (err) {
      setError('Failed to refresh Instagram token');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const disconnectAccount = async (integrationId) => {
    try {
      setIsLoading(true);
      await instagramService.deleteIntegration(integrationId);
      await loadInstagramAccounts();
    } catch (err) {
      setError('Failed to disconnect Instagram account');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load accounts on mount
  useEffect(() => {
    loadInstagramAccounts();
  }, []);
  
  const value = {
    instagramAccounts,
    isLoading,
    error,
    refreshToken,
    disconnectAccount,
    loadInstagramAccounts,
  };
  
  return (
    <InstagramContext.Provider value={value}>
      {children}
    </InstagramContext.Provider>
  );
};

export const useInstagram = () => useContext(InstagramContext);

// Usage example:
// 
// import { useInstagram } from '../contexts/InstagramContext';
// 
// function MyComponent() {
//   const { instagramAccounts, isLoading } = useInstagram();
//   ...
// }
```

## Implementation Steps

1. Create all component files in their respective directories
2. Add the Instagram callback page
3. Add the integrations dashboard page 
4. Set up environment variables in `.env.local`
5. Test the full integration flow

## Environment Variables

Make sure to set up these environment variables in your `.env.local` file:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000  # Your NestJS backend URL
NEXT_PUBLIC_INSTAGRAM_APP_ID=your_instagram_app_id
```
