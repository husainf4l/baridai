# Complete Instagram Integration Guide for NestJS/NextJS Application

This comprehensive guide will walk you through the entire process of integrating Instagram with your NestJS backend and NextJS frontend. Follow the steps in sequence to ensure a complete and working integration.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Facebook Developer Portal Setup](#facebook-developer-portal-setup)
3. [Backend (NestJS) Configuration](#backend-nestjs-configuration)
4. [Frontend (NextJS) Implementation](#frontend-nextjs-implementation)
5. [Instagram Token Management](#instagram-token-management)
6. [Testing the Integration](#testing-the-integration)
7. [Webhook Configuration](#webhook-configuration)
8. [Troubleshooting](#troubleshooting)
9. [Resources and References](#resources-and-references)

## Prerequisites
Before you begin, make sure you have:
- A Facebook Developer Account
- An Instagram Business or Creator account
- A Facebook Page connected to your Instagram account
- Access to your NestJS backend project
- Access to your NextJS frontend project

## Facebook Developer Portal Setup

### 1. Create a Facebook App
1. Go to [Facebook for Developers](https://developers.facebook.com/)
2. Click on "My Apps" and then "Create App"
3. Select "Consumer" as the app type
4. Fill in the app details and create your app

### 2. Add Instagram Basic Display Product
1. In your Facebook App dashboard, navigate to "Add Products"
2. Find and add the "Instagram Basic Display" product

### 3. Configure Instagram Basic Display Settings
1. In your app dashboard, go to "Instagram Basic Display" → "Settings"
2. Configure the following:
   - **Valid OAuth Redirect URIs**:
     - Development: `http://localhost:3000/instagram/callback`
     - Production: `https://yourdomain.com/instagram/callback`
   - **Deauthorize Callback URL** (optional)
   - **Data Deletion Request URL** (optional)
3. Save your changes
4. Note your Instagram App ID and App Secret for later use

## Backend (NestJS) Configuration

### 1. Environment Variables
Add the following to your `.env` file:

```
# Instagram API credentials
INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=your_custom_verify_token
```

### 2. Integration Service Implementation
The `integration.service.ts` file has already been modified to handle Instagram integration with the following functionality:

- Exchange Instagram authorization code for short-lived token
- Convert short-lived token to long-lived token (60 days validity)
- Refresh tokens before they expire
- Error handling for various scenarios

Key features included:
- Proper typing for URLSearchParams using `as Record<string, string>`
- Handling null `instagramId` with fallback to undefined
- Checking for existing integrations to prevent duplicates
- Specific error handling based on response status codes

### 3. Available API Endpoints

The following API endpoints are implemented in your NestJS backend:

#### Exchange Instagram Auth Code for Token
```
POST /integrations/instagram/token
```
Request body:
```json
{
  "code": "instagram_auth_code",
  "redirectUri": "your_redirect_uri"
}
```

#### Refresh Instagram Token
```
POST /integrations/instagram/refresh/:integrationId
```

#### Get User Integrations
```
GET /integrations
```

#### Delete Integration
```
DELETE /integrations/:integrationId
```

#### Instagram Webhook Verification
```
GET /integrations/webhook/instagram
Query: hub.mode, hub.challenge, hub.verify_token
```

#### Instagram Webhook Data Processing
```
POST /integrations/webhook/instagram
Body: Instagram webhook payload
```

## Frontend (NextJS) Implementation

### 1. Environment Variables
Create or update your `.env.local` file with:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000  # Your NestJS API URL
NEXT_PUBLIC_INSTAGRAM_APP_ID=your_instagram_app_id
```

### 2. Required Components

#### Instagram Connect Button Component
Create a component to initiate the Instagram OAuth flow:

**File: `/components/InstagramConnect.js`**

```jsx
import { useState } from 'react';

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

#### Instagram Callback Page
Create a page to handle the OAuth callback from Instagram:

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
    
    // Handle Instagram OAuth errors
    if (instagramError) {
      setStatus('error');
      setError(`Instagram authorization error: ${instagramError}`);
      return;
    }
    
    // If no code is provided, return to integrations page
    if (!code) {
      setStatus('error');
      setError('No authorization code provided');
      setTimeout(() => router.push('/dashboard/integrations'), 3000);
      return;
    }
    
    // Exchange code for token
    const exchangeCodeForToken = async () => {
      try {
        setStatus('exchanging');
        
        // Get the redirect URI that was used for the initial request
        const redirectUri = `${window.location.origin}/instagram/callback`;
        
        // Send code to backend for exchange
        const response = await axios.post(`${apiBaseUrl}/integrations/instagram/token`, {
          code,
          redirectUri
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        
        setStatus('success');
        
        // Redirect back to integrations page after successful connection
        setTimeout(() => router.push('/dashboard/integrations'), 3000);
      } catch (err) {
        setStatus('error');
        setError(err.response?.data?.message || 'Failed to exchange Instagram code for token');
        console.error('Instagram token exchange error:', err);
      }
    };
    
    exchangeCodeForToken();
  }, [router, code, instagramError]);
  
  // Status messages to display to user
  const statusMessages = {
    initializing: 'Initializing...',
    exchanging: 'Connecting your Instagram account...',
    success: 'Successfully connected your Instagram account!',
    error: `Error: ${error}`
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Head>
        <title>Instagram Connection | Your App</title>
      </Head>
      
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Instagram Integration
          </h2>
        </div>
        
        <div className="mt-8 space-y-6">
          {status === 'exchanging' && (
            <div className="flex justify-center">
              <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-center text-green-600">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-center text-red-600">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          )}
          
          <div className="text-center text-lg">
            {statusMessages[status]}
          </div>
          
          {status === 'success' && (
            <p className="text-center text-sm text-gray-500">
              Redirecting you back to the dashboard...
            </p>
          )}
          
          {status === 'error' && (
            <div className="text-center">
              <button 
                onClick={() => router.push('/dashboard/integrations')}
                className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

#### Instagram Integration Management Component
Create a component to display and manage Instagram integrations:

**File: `/components/IntegrationsList.js`**

```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import InstagramConnect from './InstagramConnect';

export default function IntegrationsList() {
  const [integrations, setIntegrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  
  // Fetch user integrations
  const fetchIntegrations = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${apiBaseUrl}/integrations`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      setIntegrations(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch integrations');
      console.error('Error fetching integrations:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete an integration
  const deleteIntegration = async (integrationId) => {
    if (!window.confirm('Are you sure you want to disconnect this integration?')) {
      return;
    }
    
    try {
      await axios.delete(`${apiBaseUrl}/integrations/${integrationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      // Update integrations list after deletion
      fetchIntegrations();
    } catch (err) {
      setError('Failed to delete integration');
      console.error('Error deleting integration:', err);
    }
  };
  
  // Refresh an integration token
  const refreshIntegration = async (integrationId) => {
    try {
      setIsLoading(true);
      await axios.post(
        `${apiBaseUrl}/integrations/instagram/refresh/${integrationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
      
      // Re-fetch integrations after refresh
      fetchIntegrations();
    } catch (err) {
      setError('Failed to refresh integration token');
      console.error('Error refreshing token:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch integrations on component mount
  useEffect(() => {
    fetchIntegrations();
  }, []);
  
  // Handle successful new integration
  const handleIntegrationSuccess = () => {
    fetchIntegrations();
  };
  
  // Find Instagram integration
  const instagramIntegration = integrations.find(
    integration => integration.name === 'INSTAGRAM'
  );
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Account Integrations</h2>
      
      {error && (
        <div className="bg-red-100 p-4 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Instagram</h3>
            
            {instagramIntegration ? (
              <div>
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Connected to Instagram
                </div>
                
                <div className="text-sm text-gray-600 mb-4">
                  <div><strong>Account ID:</strong> {instagramIntegration.instagramId}</div>
                  <div><strong>Connected:</strong> {new Date(instagramIntegration.createdAt).toLocaleDateString()}</div>
                  <div><strong>Expires:</strong> {new Date(instagramIntegration.expiresAt).toLocaleDateString()}</div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => refreshIntegration(instagramIntegration.id)}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded hover:bg-blue-100"
                  >
                    Refresh Token
                  </button>
                  
                  <button
                    onClick={() => deleteIntegration(instagramIntegration.id)}
                    className="px-3 py-1 bg-red-50 text-red-700 text-sm rounded hover:bg-red-100"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <InstagramConnect onSuccess={handleIntegrationSuccess} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

#### Integrations Dashboard Page
Create a page to show the integrations dashboard:

**File: `/pages/dashboard/integrations.js`**

```jsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import IntegrationsList from '../../components/IntegrationsList';

export default function IntegrationsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    setIsAuthenticated(true);
    setIsLoading(false);
  }, [router]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <svg className="animate-spin h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Head>
        <title>Integrations | Your App</title>
      </Head>
      
      <IntegrationsList />
    </div>
  );
}
```

## Instagram Token Management

### Token Lifecycle

1. **Short-lived access token** (obtained during initial authorization)
   - Valid for 1 hour
   - Needs to be exchanged for a long-lived token

2. **Long-lived access token**
   - Valid for 60 days
   - Can be refreshed before expiration

### Automatic Token Refreshing

Set up a scheduled task to refresh Instagram tokens before they expire:

**File: `/scripts/refresh-instagram-tokens.js`**

```javascript
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Number of days before expiration to refresh tokens
const REFRESH_THRESHOLD_DAYS = 7;

async function refreshTokens() {
  try {
    console.log('Starting Instagram token refresh job');
    
    // Calculate the date threshold for tokens that need refreshing
    const refreshThreshold = new Date();
    refreshThreshold.setDate(refreshThreshold.getDate() + REFRESH_THRESHOLD_DAYS);
    
    // Find all Instagram integrations with tokens expiring soon
    const expiredIntegrations = await prisma.integration.findMany({
      where: {
        name: 'INSTAGRAM',
        expiresAt: {
          lt: refreshThreshold
        }
      }
    });
    
    console.log(`Found ${expiredIntegrations.length} tokens to refresh`);
    
    // Process each integration that needs refreshing
    for (const integration of expiredIntegrations) {
      try {
        console.log(`Refreshing token for integration ID: ${integration.id}`);
        
        // Call your API to refresh the token
        const response = await axios.post(
          `http://localhost:3000/integrations/instagram/refresh/${integration.id}`,
          {},
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log(`Successfully refreshed token for integration ID: ${integration.id}`);
        console.log(`New expiration date: ${response.data.expiresAt}`);
      } catch (error) {
        console.error(`Failed to refresh token for integration ID: ${integration.id}`);
        console.error(`Error: ${error.message}`);
        
        if (error.response) {
          console.error(`Status: ${error.response.status}`);
          console.error(`Response: ${JSON.stringify(error.response.data)}`);
        }
      }
    }
    
    console.log('Instagram token refresh job completed');
  } catch (error) {
    console.error('Error in token refresh job:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the refresh function
refreshTokens();
```

### Setting Up a Cron Job

Configure a cron job to run the token refresh script regularly:

```bash
# Run weekly on Sunday at midnight
0 0 * * 0 cd /path/to/your/app && node scripts/refresh-instagram-tokens.js >> /path/to/your/app/logs/token-refresh.log 2>&1
```

## Testing the Integration

### Test Script

Use this script to test your Instagram integration:

**File: `/test-instagram-integration.js`**

```javascript
const axios = require('axios');
const readline = require('readline');
const dotenv = require('dotenv');
dotenv.config();

// Create readline interface for CLI interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get environment variables
const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID;
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
let AUTH_TOKEN = '';

// Main menu options
const MENU_OPTIONS = {
  '1': 'Generate Instagram Auth URL',
  '2': 'Exchange Auth Code for Token',
  '3': 'View Integrations',
  '4': 'Refresh Token',
  '5': 'Delete Integration',
  '6': 'Set Auth Token',
  '7': 'Exit'
};

// Function to display the menu
function displayMenu() {
  console.log('\n===== Instagram Integration Test Tool =====\n');
  Object.entries(MENU_OPTIONS).forEach(([key, value]) => {
    console.log(`${key}. ${value}`);
  });
  console.log('\n');
}

// Generate Instagram auth URL
async function generateAuthUrl() {
  const redirectUri = await promptUser('Enter redirect URI (e.g., http://localhost:3000/instagram/callback): ');
  
  if (!INSTAGRAM_APP_ID) {
    console.error('Error: INSTAGRAM_APP_ID not set in .env file');
    return;
  }
  
  const authUrl = `https://api.instagram.com/oauth/authorize` +
    `?client_id=${INSTAGRAM_APP_ID}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=user_profile,user_media` +
    `&response_type=code`;
  
  console.log('\nInstagram Auth URL:');
  console.log(authUrl);
  console.log('\nOpen this URL in your browser to authorize the app.');
  console.log('After authorization, you will be redirected with a code in the URL.');
}

// Exchange auth code for token
async function exchangeCodeForToken() {
  const code = await promptUser('Enter Instagram auth code: ');
  const redirectUri = await promptUser('Enter redirect URI (must match the one used to get the code): ');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/integrations/instagram/token`, {
      code,
      redirectUri
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });
    
    console.log('\nSuccess! Instagram account connected:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    handleApiError(error);
  }
}

// View all integrations
async function viewIntegrations() {
  try {
    const response = await axios.get(`${API_BASE_URL}/integrations`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });
    
    console.log('\nUser Integrations:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    handleApiError(error);
  }
}

// Refresh an integration token
async function refreshToken() {
  const integrationId = await promptUser('Enter integration ID to refresh: ');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/integrations/instagram/refresh/${integrationId}`, {}, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });
    
    console.log('\nToken refreshed successfully:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    handleApiError(error);
  }
}

// Delete an integration
async function deleteIntegration() {
  const integrationId = await promptUser('Enter integration ID to delete: ');
  
  try {
    const response = await axios.delete(`${API_BASE_URL}/integrations/${integrationId}`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });
    
    console.log('\nIntegration deleted successfully.');
  } catch (error) {
    handleApiError(error);
  }
}

// Set auth token
async function setAuthToken() {
  AUTH_TOKEN = await promptUser('Enter your authentication token: ');
  console.log('\nAuthentication token set.');
}

// Helper function to prompt user for input
function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Helper function to handle API errors
function handleApiError(error) {
  console.error('\nError:');
  if (error.response) {
    console.error(`Status: ${error.response.status}`);
    console.error('Response:', error.response.data);
  } else if (error.request) {
    console.error('Request was made but no response was received');
    console.error(error.request);
  } else {
    console.error('Error setting up the request:', error.message);
  }
}

// Main function
async function main() {
  while (true) {
    displayMenu();
    const choice = await promptUser('Enter your choice: ');
    
    switch (choice) {
      case '1':
        await generateAuthUrl();
        break;
      case '2':
        await exchangeCodeForToken();
        break;
      case '3':
        await viewIntegrations();
        break;
      case '4':
        await refreshToken();
        break;
      case '5':
        await deleteIntegration();
        break;
      case '6':
        await setAuthToken();
        break;
      case '7':
        console.log('\nExiting...');
        rl.close();
        return;
      default:
        console.log('\nInvalid option. Please try again.');
    }
    
    await promptUser('\nPress Enter to continue...');
  }
}

// Start the program
main();
```

## Webhook Configuration

### 1. Enable Instagram Webhooks in Developer Portal
1. In your Facebook App dashboard, navigate to "Webhooks"
2. Add a new subscription for "Instagram"
3. Enter your webhook URL: `https://yourdomain.com/integrations/webhook/instagram`
4. Enter your verification token (should match `INSTAGRAM_WEBHOOK_VERIFY_TOKEN` in your .env)
5. Select the fields you want to subscribe to

### 2. Webhook Implementation
Your NestJS backend already has endpoints for webhook handling:

- `GET /integrations/webhook/instagram` - For webhook verification
- `POST /integrations/webhook/instagram` - For receiving webhook events

## Troubleshooting

### Common Issues & Solutions

#### 1. Invalid Redirect URI
**Problem:** Instagram returns "Invalid redirect_uri" error.
**Solution:** 
- Double-check that your redirect URI exactly matches what's configured in Facebook Developer Portal
- Be careful with trailing slashes and http vs https differences
- Make sure the URI is added to the Valid OAuth Redirect URIs in your app settings

#### 2. Token Exchange Failures
**Problem:** Unable to exchange code for token.
**Solution:**
- Verify your INSTAGRAM_APP_ID and INSTAGRAM_APP_SECRET are correct
- Make sure the redirect URI in the exchange request matches the one used for authorization
- Remember that auth codes are single-use and expire quickly (usually after one use)
- Check your server logs for detailed error messages

#### 3. Token Refresh Failures
**Problem:** Unable to refresh Instagram token.
**Solution:**
- Check if the token has already expired (60+ days old)
- Verify the token is valid and hasn't been revoked
- Make sure the user's Instagram account is still active
- Check if your app still has the necessary permissions

#### 4. Permissions Issues
**Problem:** Missing data or functionality after connecting Instagram.
**Solution:**
- Verify you're requesting the correct scopes (`user_profile,user_media`)
- Ensure the user has a valid Instagram Business or Creator account
- Check if your app has been approved for the required permissions

#### 5. Webhook Verification Failures
**Problem:** Webhook verification fails.
**Solution:**
- Verify your INSTAGRAM_WEBHOOK_VERIFY_TOKEN matches what you configured
- Make sure your webhook endpoint is publicly accessible
- Check server logs for detailed error messages

## Resources and References

- [Instagram Basic Display API Documentation](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api)
- [Facebook Developer Portal](https://developers.facebook.com/)
- [Instagram Authentication Guide](https://developers.facebook.com/docs/instagram-basic-display-api/guides/getting-access-tokens-and-permissions)
- [Instagram Token Management](https://developers.facebook.com/docs/instagram-basic-display-api/reference/refresh_access_token)
- [Instagram Webhooks](https://developers.facebook.com/docs/instagram-api/webhooks)

## Integration Checklist

- [ ] Created Facebook Developer App
- [ ] Added Instagram Basic Display product
- [ ] Configured OAuth Redirect URIs
- [ ] Set up environment variables for backend and frontend
- [ ] Implemented backend endpoints for token exchange and management
- [ ] Created frontend components for Instagram integration
- [ ] Added token refresh mechanism
- [ ] Tested connecting an Instagram account
- [ ] Configured webhook handling (if needed)
- [ ] Created documentation for developers and users
