// pages/api/refresh-instagram-token.js
import axios from 'axios';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Extract token from request
    const { integrationId } = req.body;
    const { authorization } = req.headers;

    if (!integrationId || !authorization) {
      return res.status(400).json({ message: 'Missing integration ID or authorization header' });
    }

    // Call your backend API to refresh the token
    const apiBaseUrl = process.env.API_BASE_URL;
    const response = await axios.post(
      `${apiBaseUrl}/integrations/instagram/refresh/${integrationId}`,
      {},
      {
        headers: {
          Authorization: authorization,
        },
      }
    );

    // Return the refreshed token info
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error refreshing Instagram token:', error.response?.data || error);
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Failed to refresh Instagram token',
    });
  }
}
