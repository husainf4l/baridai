import {
  Injectable,
  NotFoundException,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import axios from 'axios';
import { INTEGRATIONS } from '../../generated/prisma';

@Injectable()
export class IntegrationService {
  constructor(private prisma: PrismaService) {}

  async getUserIntegrations(userId: string) {
    const integrations = await this.prisma.integration.findMany({
      where: { userId },
    });

    return integrations;
  }

  async getIntegrationById(userId: string, integrationId: string) {
    const integration = await this.prisma.integration.findFirst({
      where: {
        id: integrationId,
        userId,
      },
    });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    return integration;
  }

  async createIntegration(
    userId: string,
    createIntegrationDto: CreateIntegrationDto,
  ) {
    // We no longer check if the user has existing integrations since they can have multiple

    // Check if token already exists
    const tokenExists = await this.prisma.integration.findUnique({
      where: { token: createIntegrationDto.token },
    });

    if (tokenExists) {
      throw new ConflictException('Token already in use');
    }

    return this.prisma.integration.create({
      data: {
        ...createIntegrationDto,
        userId,
      },
    });
  }

  async updateIntegration(
    userId: string,
    integrationId: string,
    createIntegrationDto: CreateIntegrationDto,
  ) {
    const existingIntegration = await this.prisma.integration.findFirst({
      where: {
        id: integrationId,
        userId,
      },
    });

    if (!existingIntegration) {
      throw new NotFoundException('Integration not found');
    }

    // Check if token already exists and is not the current one
    if (existingIntegration.token !== createIntegrationDto.token) {
      const tokenExists = await this.prisma.integration.findUnique({
        where: { token: createIntegrationDto.token },
      });

      if (tokenExists) {
        throw new ConflictException('Token already in use');
      }
    }

    return this.prisma.integration.update({
      where: { id: integrationId },
      data: createIntegrationDto,
    });
  }

  async deleteIntegration(userId: string, integrationId: string) {
    const existingIntegration = await this.prisma.integration.findFirst({
      where: {
        id: integrationId,
        userId,
      },
    });

    if (!existingIntegration) {
      throw new NotFoundException('Integration not found');
    }

    return this.prisma.integration.delete({
      where: { id: integrationId },
    });
  }

  async deleteAllIntegrations(userId: string) {
    return this.prisma.integration.deleteMany({
      where: { userId },
    });
  }

  // Process Instagram webhook data
  async processInstagramWebhook(payload: any): Promise<void> {
    // Extract data from the Instagram webhook payload
    try {
      // Instagram webhook payload structure
      // { object: 'instagram', entry: [ { id: 'instagram-user-id', time: timestamp, changes: [...] } ] }
      if (payload.object !== 'instagram') {
        console.log('Not an Instagram webhook, ignoring');
        return;
      }

      // Process each entry in the webhook
      for (const entry of payload.entry) {
        const instagramId = entry.id;

        // Find integrations associated with this Instagram ID
        const integrations = await this.prisma.integration.findMany({
          where: {
            instagramId: instagramId,
            name: 'INSTAGRAM',
          },
        });

        if (integrations.length === 0) {
          console.log(`No integrations found for Instagram ID: ${instagramId}`);
          continue;
        }

        // Process each change in the entry
        for (const change of entry.changes) {
          await this.processInstagramChange(change, integrations);
        }
      }
    } catch (error) {
      console.error('Error processing Instagram webhook:', error);
      throw error;
    }
  }

  // Helper method to process different types of Instagram changes
  private async processInstagramChange(
    change: any,
    integrations: any[],
  ): Promise<void> {
    const field = change.field;
    const value = change.value;

    switch (field) {
      case 'mentions':
        await this.processMentions(value, integrations);
        break;
      case 'comments':
        await this.processComments(value, integrations);
        break;
      case 'messages':
        await this.processMessages(value, integrations);
        break;
      case 'story_mentions':
        await this.processStoryMentions(value, integrations);
        break;
      default:
        console.log(`Unhandled Instagram webhook field type: ${field}`);
    }
  }

  // Process Instagram mentions
  private async processMentions(
    value: any,
    integrations: any[],
  ): Promise<void> {
    console.log('Processing Instagram mentions:', value);
    // Implementation for handling mentions
    // This would typically trigger automations based on the mention
  }

  // Process Instagram comments
  private async processComments(
    value: any,
    integrations: any[],
  ): Promise<void> {
    console.log('Processing Instagram comments:', value);
    // Implementation for handling comments
    // This would typically trigger automations based on comment content
  }

  // Process Instagram direct messages
  private async processMessages(
    value: any,
    integrations: any[],
  ): Promise<void> {
    console.log('Processing Instagram messages:', value);
    // Implementation for handling direct messages
    // This would typically trigger automations based on DM content
  }

  // Process Instagram story mentions
  private async processStoryMentions(
    value: any,
    integrations: any[],
  ): Promise<void> {
    console.log('Processing Instagram story mentions:', value);
    // Implementation for handling story mentions
    // This would typically trigger automations based on story mentions
  }

  /**
   * Exchange Instagram authorization code for access token and save to database
   * @param userId User ID to associate the integration with
   * @param code Authorization code from Instagram OAuth
   * @param redirectUri Redirect URI used in the initial auth request
   */
  async exchangeInstagramToken(userId: string, code: string, redirectUri: string) {
    try {
      // Instagram API credentials
      const clientId = process.env.INSTAGRAM_APP_ID;
      const clientSecret = process.env.INSTAGRAM_APP_SECRET;

      // Validate required environment variables
      if (!clientId || !clientSecret) {
        throw new HttpException(
          'Instagram API credentials not configured',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      console.log(`Exchanging Instagram code for token. userId: ${userId}, redirectUri: ${redirectUri}`);

      // Exchange code for short-lived access token
      let tokenResponse;
      try {
        tokenResponse = await axios.post(
          'https://api.instagram.com/oauth/access_token',
          new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
            code: code,
          } as Record<string, string>),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        );
      } catch (tokenError) {
        console.error('Error exchanging code for token:', tokenError.response?.data || tokenError.message);
        throw new HttpException(
          `Instagram authorization failed: ${tokenError.response?.data?.error_message || 'Invalid authorization code'}`,
          HttpStatus.BAD_REQUEST
        );
      }

      // Validate response data
      if (!tokenResponse.data || !tokenResponse.data.access_token) {
        console.error('Missing access_token in Instagram response:', tokenResponse.data);
        throw new HttpException(
          'Invalid response from Instagram: Missing access token',
          HttpStatus.BAD_REQUEST
        );
      }

      // Get short-lived access token and user ID
      const { access_token, user_id } = tokenResponse.data;
      console.log(`Received short-lived token for Instagram user_id: ${user_id}`);

      // Exchange short-lived token for long-lived token
      let longLivedTokenResponse;
      try {
        longLivedTokenResponse = await axios.get(
          'https://graph.instagram.com/access_token',
          {
            params: {
              grant_type: 'ig_exchange_token',
              client_secret: clientSecret,
              access_token: access_token,
            },
          },
        );
      } catch (longTokenError) {
        console.error('Error exchanging for long-lived token:', longTokenError.response?.data || longTokenError.message);
        throw new HttpException(
          'Failed to obtain long-lived Instagram token',
          HttpStatus.BAD_REQUEST
        );
      }

      // Validate long-lived token response
      if (!longLivedTokenResponse.data || !longLivedTokenResponse.data.access_token) {
        console.error('Missing access_token in long-lived token response:', longLivedTokenResponse.data);
        throw new HttpException(
          'Invalid response from Instagram: Failed to get long-lived token',
          HttpStatus.BAD_REQUEST
        );
      }

      const { access_token: longLivedToken, expires_in } =
        longLivedTokenResponse.data;

      // Calculate expiration date (expires_in is in seconds)
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);
      console.log(`Long-lived token received, expires in ${expires_in} seconds (${expiresAt.toISOString()})`);

      // Get information about the Instagram account
      let accountResponse;
      try {
        accountResponse = await axios.get(
          `https://graph.instagram.com/me`,
          {
            params: {
              fields: 'id,username,account_type,name',
              access_token: longLivedToken
            }
          }
        );
      } catch (accountError) {
        console.error('Error fetching Instagram account info:', accountError.response?.data || accountError.message);
        throw new HttpException(
          'Failed to retrieve Instagram account information',
          HttpStatus.BAD_REQUEST
        );
      }

      // Validate account response
      if (!accountResponse.data || !accountResponse.data.id) {
        console.error('Invalid account data response:', accountResponse.data);
        throw new HttpException(
          'Failed to retrieve Instagram account information',
          HttpStatus.BAD_REQUEST
        );
      }

      const instagramId = accountResponse.data.id;
      const instagramUsername = accountResponse.data.username;
      console.log(`Retrieved Instagram account info - ID: ${instagramId}, Username: ${instagramUsername}`);
      
      // Now fetch the connected Facebook Page ID if available
      let pageId = null;
      let pageName = null;
      
      try {
        // Attempt to get connected Facebook Page info
        const pagesResponse = await axios.get(
          `https://graph.facebook.com/v18.0/me/accounts`,
          {
            params: {
              access_token: longLivedToken,
            }
          }
        );
        
        // If we have page data, get the first connected page
        if (pagesResponse.data && 
            pagesResponse.data.data && 
            Array.isArray(pagesResponse.data.data) && 
            pagesResponse.data.data.length > 0) {
          const connectedPage = pagesResponse.data.data[0];
          pageId = connectedPage.id;
          pageName = connectedPage.name;
          console.log(`Found connected Facebook Page - ID: ${pageId}, Name: ${pageName}`);
        }
      } catch (pageError) {
        // Not treating this as a fatal error, just log it
        console.warn('Could not fetch connected Facebook Page:', pageError.message);
      }
      
      // Check if user already has an integration with this Instagram account
      const existingIntegration = await this.prisma.integration.findFirst({
        where: {
          userId: userId,
          instagramId: instagramId,
          name: INTEGRATIONS.INSTAGRAM,
        },
      });
      
      // Create integration object
      const integrationDto: CreateIntegrationDto = {
        name: INTEGRATIONS.INSTAGRAM,
        token: longLivedToken,
        expiresAt: expiresAt,
        instagramId: instagramId,
        // Include additional fields if available
        pageId: pageId || undefined,
        pageName: pageName || instagramUsername || undefined,
      };

      let integration;
      
      if (existingIntegration) {
        console.log(`Updating existing Instagram integration for user ${userId}`);
        // Update the existing integration instead of creating a new one
        integration = await this.updateIntegration(
          userId,
          existingIntegration.id,
          integrationDto,
        );
      } else {
        console.log(`Creating new Instagram integration for user ${userId}`);
        // Save new integration to database
        integration = await this.createIntegration(
          userId,
          integrationDto,
        );
      }

      // Return integration without exposing token in the response
      // Important for security: Don't send the token to the frontend
      const safeResponse = {
        success: true,
        integration: {
          id: integration.id,
          name: integration.name,
          instagramId: integration.instagramId,
          pageId: integration.pageId,
          pageName: integration.pageName || instagramUsername,
          expiresAt: expiresAt,
          connected: true
        }
      };

      return safeResponse;
    } catch (error) {
      console.error('Instagram token exchange error:', error.response?.data || error);
      
      // Provide more specific error messages based on the error
      if (error instanceof HttpException) {
        throw error; // Re-throw our custom exceptions
      } else if (error.response?.status === 400) {
        throw new HttpException(
          `Instagram authorization failed: ${error.response?.data?.error_message || 'Invalid code'}`,
          HttpStatus.BAD_REQUEST,
        );
      } else if (error.response?.status === 401) {
        throw new HttpException(
          'Instagram authentication failed: Invalid credentials',
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        throw new HttpException(
          'Failed to exchange Instagram token',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  /**
   * Refresh an existing Instagram token
   * @param userId User ID
   * @param integrationId Integration ID containing the token to refresh
   */
  async refreshInstagramToken(userId: string, integrationId: string) {
    try {
      // Get existing integration
      const integration = await this.getIntegrationById(
        userId,
        integrationId,
      );

      if (integration.name !== INTEGRATIONS.INSTAGRAM) {
        throw new HttpException(
          'Integration is not an Instagram integration',
          HttpStatus.BAD_REQUEST,
        );
      }
      
      // Check if token is already expired
      if (new Date(integration.expiresAt) < new Date()) {
        throw new HttpException(
          'Instagram token is already expired and cannot be refreshed. Please reconnect your Instagram account.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Refresh the long-lived token
      const refreshResponse = await axios.get(
        'https://graph.instagram.com/refresh_access_token',
        {
          params: {
            grant_type: 'ig_refresh_token',
            access_token: integration.token,
          },
        },
      );
      
      // Validate token refresh response
      if (!refreshResponse.data || !refreshResponse.data.access_token) {
        throw new HttpException(
          'Failed to refresh Instagram token: Invalid response',
          HttpStatus.BAD_REQUEST
        );
      }

      const { access_token: newToken, expires_in } = refreshResponse.data;

      // Calculate new expiration date
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);

      // Update integration with new token
      const integrationDto: CreateIntegrationDto = {
        name: INTEGRATIONS.INSTAGRAM,
        token: newToken,
        expiresAt: expiresAt,
        instagramId: integration.instagramId || undefined,
      };

      // Save updated integration to database
      const updatedIntegration = await this.updateIntegration(
        userId,
        integrationId,
        integrationDto,
      );

      return {
        integration: updatedIntegration,
        token: newToken,
        expiresAt: expiresAt,
      };
    } catch (error) {
      console.error('Instagram token refresh error:', error.response?.data || error);
      
      // Provide more specific error messages based on the error
      if (error instanceof HttpException) {
        throw error; // Re-throw our custom exceptions
      } else if (error.response?.status === 400) {
        throw new HttpException(
          `Instagram token refresh failed: ${error.response?.data?.error_message || 'Invalid token'}`,
          HttpStatus.BAD_REQUEST,
        );
      } else if (error.response?.status === 401) {
        throw new HttpException(
          'Instagram token refresh failed: Token expired or revoked',
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        throw new HttpException(
          'Failed to refresh Instagram token',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
