# Instagram Integration Setup Guide

This guide will walk you through setting up Instagram integration with your application step by step.

## Prerequisites

1. A Facebook developer account
2. An Instagram Business or Creator account
3. A Facebook Page connected to your Instagram account

## Step 1: Create a Facebook App

1. Go to [Facebook for Developers](https://developers.facebook.com/)
2. Click on "My Apps" and then "Create App"
3. Select "Consumer" as the app type
4. Fill in the app details and create your app
5. In the app dashboard, add the "Instagram Basic Display" product

## Step 2: Configure Instagram Basic Display

1. In your Facebook App dashboard, go to "Instagram Basic Display"
2. Under "Basic Display", click "Settings"
3. Add your OAuth Redirect URIs:
   - For development: `http://localhost:3000/instagram/callback`
   - For production: `https://yourdomain.com/instagram/callback`
4. Add your Deauthorize Callback URL
5. Add your Data Deletion Request URL (if applicable)
6. Save changes
7. Note your Instagram App ID and App Secret for later use

## Step 3: Set Up Environment Variables

Create or update your `.env` file with the following variables:

```
# Instagram API credentials
INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=your_custom_verify_token
```

For your frontend Next.js app, add to `.env.local`:

```
NEXT_PUBLIC_INSTAGRAM_APP_ID=your_instagram_app_id
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## Step 4: Run the Application

1. Start your backend server:
   ```bash
   npm run start:dev
   ```

2. Start your frontend app (if separate):
   ```bash
   npm run dev
   ```

## Step 5: Test the Integration

You can test the integration in two ways:

### Using the UI:

1. Navigate to your Instagram integration page (e.g., `/dashboard/integrations`)
2. Click "Connect Instagram Account"
3. Authorize your app on Instagram
4. You will be redirected back to your application with an auth code
5. Your backend will exchange this code for a long-lived token and save the integration

### Using the Test Script:

```bash
node test-instagram-integration.js
```

## Step 6: Verify the Integration

1. Check that the integration is saved in your database:
   ```bash
   npx prisma studio
   ```

2. Navigate to the "Integration" table to verify the Instagram token is saved

## Step 7: Set Up Token Auto-Refresh (Optional)

Instagram tokens expire after 60 days. You should set up a scheduled task to refresh tokens before they expire:

1. Create a cron job that runs weekly:
   ```bash
   0 0 * * 0 cd /path/to/your/app && node scripts/refresh-instagram-tokens.js
   ```

## Troubleshooting

### Common Issues:

1. **Invalid redirect URI**: Make sure the redirect URI exactly matches what's configured in your Facebook App settings

2. **Invalid client_id**: Verify your INSTAGRAM_APP_ID is correct

3. **Token exchange failures**: Check the Instagram API response for detailed error messages

4. **Expired token**: If a token is already expired, you'll need to reconnect the account

### Debugging Tools:

1. Use the `test-instagram-integration.js` script to test different aspects of the integration

2. Check your server logs for detailed error messages

3. Use Facebook's Graph API Explorer to test API endpoints

## Next Steps

1. Implement webhook handlers to respond to Instagram events
2. Set up monitoring to detect and alert on token expiration
3. Add more Instagram API features based on your application needs

For detailed Instagram API documentation, visit [Facebook's Developer Documentation](https://developers.facebook.com/docs/instagram-basic-display-api/).
