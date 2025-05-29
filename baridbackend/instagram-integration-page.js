import { useState, useEffect } from 'react';
import axios from 'axios';

export default function InstagramIntegrationPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [integrations, setIntegrations] = useState([]);
  const [error, setError] = useState(null);

  // Instagram configuration
  const instagramAppId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;
  const redirectUri = typeof window !== 'undefined'
    ? `${window.location.origin}/instagram/callback`
    : '';
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  
  useEffect(() => {
    // Fetch existing integrations on component mount
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      setIsLoading(true);
      
      // Get auth token from localStorage (assuming you store it there)
      const token = localStorage.getItem('accessToken');

      if (!token) {
        setError('Authentication required');
        setIsLoading(false);
        return;
      }

      const response = await axios.get(`${apiBaseUrl}/integrations`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Filter for only Instagram integrations
      const instagramIntegrations = response.data.filter(
        integration => integration.name === 'INSTAGRAM'
      );
      
      setIntegrations(instagramIntegrations);
    } catch (err) {
      console.error('Failed to fetch integrations:', err);
      setError('Failed to load Instagram connections');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectInstagram = async (integrationId) => {
    if (!confirm('Are you sure you want to disconnect this Instagram account?')) {
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');

      await axios.delete(`${apiBaseUrl}/integrations/${integrationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh integrations list
      fetchIntegrations();
    } catch (err) {
      console.error('Failed to disconnect Instagram:', err);
      setError('Failed to disconnect Instagram account');
    } finally {
      setIsLoading(false);
    }
  };

  const connectInstagram = () => {
    if (!instagramAppId) {
      setError('Instagram App ID not configured');
      return;
    }
    
    // Construct Instagram authorization URL
    const scope = 'user_profile,user_media';
    const instagramAuthUrl = 
      `https://api.instagram.com/oauth/authorize` +
      `?client_id=${instagramAppId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${scope}` +
      `&response_type=code`;
    
    // Redirect to Instagram auth page
    window.location.href = instagramAuthUrl;
  };

  const refreshToken = async (integrationId) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');

      await axios.post(
        `${apiBaseUrl}/integrations/instagram/refresh/${integrationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh integrations list
      fetchIntegrations();
    } catch (err) {
      console.error('Failed to refresh token:', err);
      setError('Failed to refresh Instagram token');
    } finally {
      setIsLoading(false);
    }
  };

  // Format expiry date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Instagram Integration</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
          <button 
            className="text-sm underline"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center py-10">
          <div className="spinner">Loading...</div>
        </div>
      ) : (
        <div>
          {integrations.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="mb-4">No Instagram accounts connected yet.</p>
              <button
                onClick={connectInstagram}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Connect Instagram Account
              </button>
            </div>
          ) : (
            <div>
              {integrations.map((integration) => (
                <div key={integration.id} className="bg-white rounded-lg shadow p-6 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Instagram Account</h2>
                    <span className={`px-2 py-1 rounded text-sm ${
                      new Date(integration.expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {new Date(integration.expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        ? 'Token Expiring Soon'
                        : 'Active'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Instagram ID:</p>
                      <p>{integration.instagramId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Token Expires:</p>
                      <p>{formatDate(integration.expiresAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => refreshToken(integration.id)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                    >
                      Refresh Token
                    </button>
                    <button
                      onClick={() => disconnectInstagram(integration.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 font-bold py-2 px-4 rounded"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              ))}
              
              <button
                onClick={connectInstagram}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Connect Another Account
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
