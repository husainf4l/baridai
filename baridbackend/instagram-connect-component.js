// components/InstagramConnect.js
import { useState } from 'react';
import { Button, Alert, Card, Text, Spinner } from '@your-ui-library'; // Replace with your UI library
import axios from 'axios';

export default function InstagramConnect({ onSuccess, apiBaseUrl }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Instagram App ID from environment variables
  const instagramAppId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;
  
  // The redirect URI should be registered in your Instagram App
  const redirectUri = `${window.location.origin}/instagram/callback`;
  
  // Scopes needed for your app (common ones for Instagram)
  const scope = 'user_profile,user_media';
  
  // Function to initiate Instagram OAuth flow
  const connectInstagram = () => {
    // Construct the Instagram authorization URL
    const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${instagramAppId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`;
    
    // Redirect to Instagram authorization page
    window.location.href = instagramAuthUrl;
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <Text variant="h2" className="mb-4">Connect Instagram Account</Text>
      
      {error && <Alert variant="error" className="mb-4">{error}</Alert>}
      
      <Button 
        onClick={connectInstagram}
        variant="primary"
        disabled={isLoading}
        className="flex items-center justify-center"
      >
        {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
        Connect to Instagram
      </Button>
      
      <Text variant="small" className="mt-4 text-gray-500">
        Connecting your Instagram account allows us to post and manage your Instagram content.
      </Text>
    </Card>
  );
}
