import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function InstagramCallback() {
  const router = useRouter();
  const { code, error: instagramError } = router.query;
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState('');
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  
  useEffect(() => {
    if (!router.isReady) return; // Wait until router is ready
    
    if (!code) {
      if (instagramError) {
        setStatus('error');
        setError(`Instagram authorization error: ${instagramError}`);
      }
      return;
    }
    
    const exchangeCodeForToken = async () => {
      try {
        // Get auth token
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          setStatus('error');
          setError('Authentication required');
          return;
        }
        
        // Prepare the redirect URI (must match what was used to get the code)
        const redirectUri = `${window.location.origin}/instagram/callback`;
        
        // Exchange code for token via your backend API
        const response = await axios.post(
          `${apiBaseUrl}/integrations/instagram/token`,
          { code, redirectUri },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setStatus('success');
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard/integrations');
        }, 2000);
      } catch (err) {
        setStatus('error');
        setError(err.response?.data?.message || 'Failed to connect Instagram account');
        console.error('Instagram connection error:', err);
      }
    };
    
    exchangeCodeForToken();
  }, [router.isReady, code, instagramError, router, apiBaseUrl]);
  
  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'processing' && (
          <>
            <div className="spinner mx-auto mb-4"></div>
            <h2 className="text-xl font-bold mb-2">Connecting Instagram</h2>
            <p className="text-gray-600">Please wait while we connect your Instagram account...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-xl font-bold mb-2">Instagram Connected!</h2>
            <p className="text-gray-600">Your Instagram account has been successfully connected.</p>
            <p className="text-sm text-gray-500 mt-4">Redirecting to dashboard...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="text-red-500 text-6xl mb-4">✗</div>
            <h2 className="text-xl font-bold mb-2">Connection Failed</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/dashboard/integrations')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Back to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
