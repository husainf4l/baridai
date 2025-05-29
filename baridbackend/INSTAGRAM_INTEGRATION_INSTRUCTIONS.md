# Instagram Integration Setup Instructions

This document provides step-by-step instructions for setting up Instagram integration in your application, including both backend (NestJS) and frontend (NextJS) components.

## Prerequisites

1. A Facebook developer account
2. An Instagram Business or Creator account
3. A Facebook Page connected to your Instagram account

## Step 1: Facebook Developer Setup

1. Go to [Facebook for Developers](https://developers.facebook.com/)
2. Create a new app (Type: "Consumer")
3. Add the "Instagram Basic Display" product to your app
4. Configure your app settings:
   - Valid OAuth Redirect URIs: `https://yourdomain.com/instagram/callback` (and local development URL)
   - Deauthorize Callback URL (optional)
   - Data Deletion Request URL (optional)
5. Note your Instagram App ID and App Secret

## Step 2: Backend Setup (NestJS)

### Configure Environment Variables

Add to your `.env` file:

```
INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=your_custom_verify_token
```

### Endpoints

The following API endpoints are already implemented in your NestJS backend:

1. **Exchange Instagram Auth Code for Token**
   ```
   POST /integrations/instagram/token
   Body: { "code": "instagram_auth_code", "redirectUri": "your_redirect_uri" }
   ```

2. **Refresh Instagram Token**
   ```
   POST /integrations/instagram/refresh/:integrationId
   ```

3. **Get User Integrations**
   ```
   GET /integrations
   ```

4. **Delete Integration**
   ```
   DELETE /integrations/:integrationId
   ```

5. **Instagram Webhook Verification**
   ```
   GET /integrations/webhook/instagram
   Query: hub.mode, hub.challenge, hub.verify_token
   ```

6. **Instagram Webhook Data Processing**
   ```
   POST /integrations/webhook/instagram
   Body: Instagram webhook payload
   ```

## Step 3: Frontend Setup (NextJS)

### Configure Environment Variables

Create or update your `.env.local` file with:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000  # Your NestJS API URL
NEXT_PUBLIC_INSTAGRAM_APP_ID=your_instagram_app_id
```

### Required Components

1. **Instagram Connect Button Component**
   - Create in: `/components/InstagramConnect.js`
   - Purpose: Initiates Instagram OAuth flow

2. **Instagram Callback Page**
   - Create in: `/pages/instagram/callback.js`
   - Purpose: Handles OAuth redirect from Instagram and exchanges code for token

3. **Integrations Dashboard Page**
   - Create in: `/pages/dashboard/integrations.js`
   - Purpose: Displays and manages user's Instagram integrations

4. **Instagram API Service**
   - Create in: `/services/instagramService.js`
   - Purpose: Centralizes API calls to your backend

### Integration Flow

1. User clicks "Connect Instagram" on your integrations page
2. User is redirected to Instagram authorization page
3. After authorizing, Instagram redirects back to your callback URL with an auth code
4. Your callback page exchanges the code for a token via your backend API
5. The token is stored in your database and associated with the user
6. User is redirected back to your dashboard or integrations page

## Step 4: Token Refresh Setup

Instagram tokens expire after 60 days. Set up automatic token refreshing:

1. Copy the refresh script to your server: `scripts/refresh-instagram-tokens.js`

2. Set up a cron job to run weekly:
   ```bash
   0 0 * * 0 cd /path/to/your/app && node scripts/refresh-instagram-tokens.js
   ```

## Step 5: Testing Your Integration

Use the included testing script to verify your Instagram integration:

```bash
node test-instagram-integration.js
```

This script allows you to:
- Generate Instagram auth links
- Exchange auth codes for tokens
- View existing integrations
- Refresh tokens manually

## Common Issues & Troubleshooting

1. **Invalid Redirect URI**
   - Ensure the redirect URI matches exactly what's configured in Facebook Developer Portal
   - Check for trailing slashes and protocol differences

2. **Token Exchange Failures**
   - Verify your INSTAGRAM_APP_ID and INSTAGRAM_APP_SECRET
   - Make sure you're sending the correct redirect URI in the token exchange request
   - Auth codes expire quickly (usually after one use)

3. **Token Refresh Failures**
   - Check if the token has already expired (60+ days old)
   - Verify the token is valid and hasn't been revoked

4. **Permissions Issues**
   - Ensure you're requesting the correct scopes (`user_profile,user_media`)
   - Check if user has a valid Instagram Business or Creator account

5. **Webhook Verification Failures**
   - Verify your INSTAGRAM_WEBHOOK_VERIFY_TOKEN matches what you configured

## Resources

- [Instagram Basic Display API Documentation](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api)
- [Facebook Developer Portal](https://developers.facebook.com/)

## Checklist

- [ ] Created Facebook Developer App
- [ ] Added Instagram Basic Display product
- [ ] Configured OAuth Redirect URIs
- [ ] Set up environment variables
- [ ] Implemented frontend components
- [ ] Tested connecting an Instagram account
- [ ] Set up token refresh mechanism
- [ ] Configured webhook handling (if needed)
