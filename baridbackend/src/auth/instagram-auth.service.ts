import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { IntegrationService } from '../integration/integration.service';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class InstagramAuthService {
  constructor(
    private integrationService: IntegrationService,
    private prisma: PrismaService
  ) { }

  /**
   * Generate a secure state parameter for Instagram OAuth
   * @param userId User ID to encode in the state
   * @returns Base64-encoded state string with userId and timestamp
   */
  generateOAuthState(userId: string): string {
    // Create state object with userId and nonce for security
    const stateObj = {
      userId,
      timestamp: Date.now(),
      nonce: crypto.randomBytes(16).toString('hex')
    };

    // Encode as base64
    return Buffer.from(JSON.stringify(stateObj)).toString('base64');
  }

  /**
   * Validate Instagram OAuth state parameter
   * @param state The state parameter returned from Instagram
   * @returns Decoded userId from the state or null if invalid
   */
  validateOAuthState(state: string): string | null {
    try {
      // Decode state parameter
      const decodedState = JSON.parse(
        Buffer.from(state, 'base64').toString('utf-8')
      );

      // Check if state contains required fields
      if (!decodedState.userId || !decodedState.timestamp) {
        return null;
      }

      // Check if state is expired (valid for 30 minutes)
      const expiryTime = 30 * 60 * 1000; // 30 minutes in milliseconds
      if (Date.now() - decodedState.timestamp > expiryTime) {
        return null;
      }

      return decodedState.userId;
    } catch (error) {
      console.error('Error validating Instagram OAuth state:', error);
      return null;
    }
  }

  /**
   * Generate Instagram authorization URL
   * @param userId User ID to include in state parameter
   * @returns URL to redirect user for Instagram authorization
   */
  getAuthorizationUrl(userId: string): string {
    const clientId = process.env.INSTAGRAM_APP_ID;
    if (!clientId) {
      throw new HttpException(
        'Instagram App ID not configured',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // Generate secure state parameter with user ID
    const state = this.generateOAuthState(userId);

    // Use the same redirect URI that frontend uses to maintain consistency
    const redirectUri = "https://baridai.com/webhook/instagram/auth-callback";

    // Determine required scopes
    // user_profile: Basic profile info
    // user_media: Media content
    // instagram_basic: Comments, likes, etc.
    // instagram_manage_messages: For DM access
    const scope = 'user_profile,user_media,instagram_basic,instagram_manage_messages';

    // Build authorization URL
    return `https://api.instagram.com/oauth/authorize` +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${scope}` +
      `&response_type=code` +
      `&state=${encodeURIComponent(state)}`;
  }

  /**
   * Process Instagram OAuth callback and create integration
   * @param code Authorization code from Instagram
   * @param state State parameter for verification
   * @param redirectUri Optional custom redirect URI
   * @returns Integration data with token information
   */
  async handleOAuthCallback(code: string, state: string, redirectUri?: string): Promise<any> {
    // Validate state parameter
    const userId = this.validateOAuthState(state);
    if (!userId) {
      throw new HttpException(
        'Invalid or expired OAuth state',
        HttpStatus.BAD_REQUEST
      );
    }

    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new HttpException(
        'User not found',
        HttpStatus.NOT_FOUND
      );
    }

    // Use provided redirectUri or construct the default one
    const finalRedirectUri = redirectUri ||
      `${process.env.API_BASE_URL || 'https://baridai.com/api'}/webhook/instagram`;

    // Exchange code for access token and create integration
    return this.integrationService.exchangeInstagramToken(userId, code, finalRedirectUri);
  }
}