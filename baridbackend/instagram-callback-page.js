// pages/instagram/callback.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Card, Text, Spinner, Alert } from '@your-ui-library'; // Replace with your UI library

export default function InstagramCallback() {
  const router = useRouter();
  const { code, error } = router.query;
  
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    // Make sure we have the code parameter before proceeding
    if (!code) {
      // If there's an error from Instagram, show it
      if (error) {
        setStatus('error');
        setErrorMessage(`Instagram authorization error: ${error}`);
      }
      return;
    }
    
    const exchangeCodeForToken = async () => {
      try {
        // Send the auth code to our backend
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const redirectUri = `${window.location.origin}/instagram/callback`;
        
        // Make the API call to exchange the code for a token
        const response = await axios.post(
          `${apiBaseUrl}/integrations/instagram/token`,
          {
            code: code,
            redirectUri: redirectUri
          },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          }
        );
        
        // The token has been successfully saved on the backend
        setStatus('success');
        
        // Redirect to dashboard or integrations page after 2 seconds
        setTimeout(() => {
          router.push('/dashboard/integrations');
        }, 2000);
      } catch (error) {
        setStatus('error');
        setErrorMessage(error.response?.data?.message || 'Failed to connect to Instagram. Please try again.');
        console.error('Instagram token exchange error:', error);
      }
    };
    
    exchangeCodeForToken();
    
  }, [code, error, router]);
  
  // Render different UI based on the status
  return (
    <Card className="p-8 max-w-md mx-auto mt-10">
      {status === 'processing' && (
        <div className="text-center">
          <Spinner size="lg" className="mb-4" />
          <Text>Connecting your Instagram account...</Text>
        </div>
      )}
      
      {status === 'success' && (
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <Text variant="h2" className="mb-2">Successfully Connected!</Text>
          <Text>Your Instagram account has been connected successfully.</Text>
          <Text className="mt-4 text-sm text-gray-500">Redirecting you to dashboard...</Text>
        </div>
      )}
      
      {status === 'error' && (
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">✗</div>
          <Text variant="h2" className="mb-2">Connection Failed</Text>
          <Alert variant="error" className="mb-4">{errorMessage}</Alert>
          <button
            onClick={() => router.push('/dashboard/integrations')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </Card>
  );
}
