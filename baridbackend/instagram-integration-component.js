// components/InstagramIntegration.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, Text, Alert, Spinner, Badge } from '@your-ui-library'; // Replace with your UI library

export default function InstagramIntegration({ apiBaseUrl, accessToken }) {
  const [integrations, setIntegrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(null); // Stores integration ID being refreshed

  // Instagram App ID from environment variables
  const instagramAppId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;
  
  // The redirect URI should be registered in your Instagram App
  const redirectUri = typeof window !== 'undefined' 
    ? `${window.location.origin}/instagram/callback` 
    : '';
  
  // Scopes needed for your app
  const scope = 'user_profile,user_media';

  // Load integrations when component mounts
  useEffect(() => {
    fetchIntegrations();
  }, []);

  // Function to fetch user's Instagram integrations
  const fetchIntegrations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${apiBaseUrl}/integrations`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      // Filter to only Instagram integrations
      const instagramIntegrations = response.data.filter(
        integration => integration.name === 'INSTAGRAM'
      );

      setIntegrations(instagramIntegrations);
    } catch (err) {
      console.error('Failed to fetch integrations:', err);
      setError('Failed to load Instagram connections. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to refresh a token
  const refreshToken = async (integrationId) => {
    setRefreshing(integrationId);
    setError(null);

    try {
      const response = await axios.post(
        `${apiBaseUrl}/integrations/instagram/refresh/${integrationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      // Update the integration in the state
      setIntegrations(prev => 
        prev.map(integration => 
          integration.id === integrationId 
            ? response.data.integration 
            : integration
        )
      );

      return response.data;
    } catch (err) {
      console.error('Failed to refresh token:', err);
      setError('Failed to refresh Instagram connection. Please try again.');
    } finally {
      setRefreshing(null);
    }
  };

  // Function to remove an integration
  const removeIntegration = async (integrationId) => {
    if (!confirm('Are you sure you want to disconnect this Instagram account?')) {
      return;
    }

    try {
      await axios.delete(`${apiBaseUrl}/integrations/${integrationId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      // Remove the integration from state
      setIntegrations(prev => 
        prev.filter(integration => integration.id !== integrationId)
      );
    } catch (err) {
      console.error('Failed to remove integration:', err);
      setError('Failed to disconnect Instagram account. Please try again.');
    }
  };

  // Function to initiate Instagram OAuth flow
  const connectInstagram = () => {
    // Construct the Instagram authorization URL
    const instagramAuthUrl = 
      `https://api.instagram.com/oauth/authorize?client_id=${instagramAppId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${scope}&response_type=code`;
    
    // Redirect to Instagram authorization page
    window.location.href = instagramAuthUrl;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Helper function to check if token is about to expire (within 7 days)
  const isTokenAboutToExpire = (expiresAt) => {
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    
    return (expiryDate - now) < sevenDaysInMs;
  };

  return (
    <div className="instagram-integration">
      <Text variant="h2" className="mb-4">Instagram Connections</Text>
      
      {error && (
        <Alert variant="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {isLoading ? (
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {integrations.length === 0 ? (
            <Card className="p-6 mb-4 text-center">
              <Text className="mb-4">No Instagram accounts connected yet.</Text>
              <Button
                onClick={connectInstagram}
                variant="primary"
              >
                Connect Instagram Account
              </Button>
            </Card>
          ) : (
            <>
              {integrations.map((integration) => (
                <Card key={integration.id} className="p-6 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <Text variant="h3">Instagram Account</Text>
                    <Badge color={
                      isTokenAboutToExpire(integration.expiresAt) 
                        ? "yellow" 
                        : "green"
                    }>
                      {isTokenAboutToExpire(integration.expiresAt) 
                        ? "Token Expiring Soon" 
                        : "Active"}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Text className="text-gray-500">Instagram ID:</Text>
                      <Text>{integration.instagramId}</Text>
                    </div>
                    <div>
                      <Text className="text-gray-500">Token Expires:</Text>
                      <Text>{formatDate(integration.expiresAt)}</Text>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => refreshToken(integration.id)}
                      variant="secondary"
                      disabled={refreshing === integration.id}
                    >
                      {refreshing === integration.id ? (
                        <>
                          <Spinner size="sm" className="mr-2" />
                          Refreshing...
                        </>
                      ) : (
                        "Refresh Token"
                      )}
                    </Button>
                    <Button
                      onClick={() => removeIntegration(integration.id)}
                      variant="outline"
                      color="red"
                    >
                      Disconnect
                    </Button>
                  </div>
                </Card>
              ))}
              
              <Button
                onClick={connectInstagram}
                variant="outline"
                className="mt-2"
              >
                Connect Another Account
              </Button>
            </>
          )}
        </>
      )}
    </div>
  );
}
