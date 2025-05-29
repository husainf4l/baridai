# Instagram Integration Guide

This guide explains how to set up and use Instagram integration in your application.

## Backend Setup

The backend provides endpoints for:
- Exchanging an Instagram auth code for a long-lived token
- Refreshing an existing token
- Handling Instagram webhooks

### Environment Variables

Add these to your `.env` file:

```
# Instagram API credentials
INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token
```

### API Endpoints

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

Response:
```json
{
  "integration": {
    "id": "integration_id",
    "name": "INSTAGRAM",
    "token": "long_lived_token",
    "expiresAt": "2023-06-01T00:00:00.000Z",
    "instagramId": "instagram_user_id"
  },
  "token": "long_lived_token",
  "expiresAt": "2023-06-01T00:00:00.000Z"
}
```

#### Refresh Instagram Token

```
POST /integrations/instagram/refresh/:integrationId
```

Response:
```json
{
  "integration": {
    "id": "integration_id",
    "name": "INSTAGRAM",
    "token": "new_token",
    "expiresAt": "2023-06-01T00:00:00.000Z",
    "instagramId": "instagram_user_id"
  },
  "token": "new_token",
  "expiresAt": "2023-06-01T00:00:00.000Z"
}
```

## Frontend Implementation

1. Create an Instagram App on the [Facebook Developer Portal](https://developers.facebook.com/)
2. Configure valid OAuth redirect URIs in your Instagram App settings
3. Set up the frontend components for Instagram integration

### Example Flow

1. User clicks "Connect Instagram" button
2. User is redirected to Instagram authorization page
3. After authorization, Instagram redirects to your callback URL with an auth code
4. Your callback page exchanges the code for a long-lived token via your backend API
5. The token is saved in your database and associated with the user

### NextJS Configuration

Add these to your `.env.local` file:

```
NEXT_PUBLIC_INSTAGRAM_APP_ID=your_instagram_app_id
NEXT_PUBLIC_API_BASE_URL=your_api_base_url
```

### Token Refreshing

Instagram tokens expire after 60 days. You should set up a scheduled task to refresh tokens before they expire.

Example cron job (run weekly):
```
0 0 * * 0 node /path/to/refresh-instagram-tokens.js
```

## Testing Instagram Integration

1. Use the Instagram Graph API Explorer to test API endpoints
2. Use the included debug scripts to test your integration
3. Set up a test Instagram account for development

## Common Issues

- **Invalid auth code**: Make sure your redirect URI exactly matches what's configured in your Instagram App
- **Token refresh failures**: Check if the original token has already expired
- **Missing permissions**: Ensure you're requesting the correct scopes during authorization
