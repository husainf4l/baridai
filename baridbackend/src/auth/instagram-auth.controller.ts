import { Controller, Get, Post, Query, Req, Res, UseGuards, Body, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { InstagramAuthService } from './instagram-auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import * as cookieUtils from '../utils/cookie.utils';
import { InstagramTokenDto } from '../integration/dto/instagram-token.dto';

@Controller('auth/instagram')
export class InstagramAuthController {
  constructor(private instagramAuthService: InstagramAuthService) {}

  /**
   * Initiates Instagram OAuth flow
   * Redirects user to Instagram authorization page
   */
  @Get('connect')
  @UseGuards(JwtAuthGuard)
  async initiateAuth(@Req() req: any, @Res() res: Response) {
    try {
      // Get user ID from JWT token
      const userId = req.user.userId;
      
      // Store user ID in secure cookie for the OAuth callback
      cookieUtils.setUserIdCookie(res, userId);
      
      // Get Instagram auth URL with secure state parameter
      const instagramAuthUrl = this.instagramAuthService.getAuthorizationUrl(userId);
      
      // Redirect to Instagram authorization page
      return res.redirect(instagramAuthUrl);
    } catch (error) {
      console.error('Error initiating Instagram OAuth:', error);
      return res.redirect('/dashboard/integrations?error=Failed to connect Instagram');
    }
  }

  /**
   * Handles Instagram OAuth callback
   * This endpoint is called by Instagram after user authorization
   */
  @Get('callback')
  async handleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Query('error_reason') errorReason: string,
    @Query('error_description') errorDescription: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      // Check for errors from Instagram OAuth
      if (error) {
        console.error(`Instagram OAuth error: ${error}`, {
          reason: errorReason,
          description: errorDescription
        });
        return res
          .status(HttpStatus.BAD_REQUEST)
          .redirect(`/dashboard/integrations?error=${encodeURIComponent(errorDescription || 'Authentication failed')}`);
      }

      // Validate that code is provided
      if (!code || !state) {
        console.error('Missing code or state parameter in Instagram OAuth callback');
        return res
          .status(HttpStatus.BAD_REQUEST)
          .redirect('/dashboard/integrations?error=Invalid authentication response');
      }

      // Process OAuth callback and create/update integration
      const result = await this.instagramAuthService.handleOAuthCallback(code, state);
      
      // Clear user ID cookie as it's no longer needed
      cookieUtils.clearUserIdCookie(res);
      
      // Successful integration - redirect to dashboard with success message
      return res.redirect('/dashboard/integrations?success=true&provider=instagram');
    } catch (error) {
      console.error('Error processing Instagram OAuth:', error);
      const errorMessage = error.message || 'Failed to connect Instagram account';
      
      // Clear user ID cookie even on error
      cookieUtils.clearUserIdCookie(res);
      
      // Redirect with error message
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .redirect(`/dashboard/integrations?error=${encodeURIComponent(errorMessage)}`);
    }
  }

  /**
   * Directly exchange Instagram authorization code for token
   * This is an alternative API endpoint for frontend-initiated flows
   */
  @Post('token')
  @UseGuards(JwtAuthGuard)
  async exchangeToken(@Req() req: any, @Body() tokenDto: InstagramTokenDto) {
    const userId = req.user.userId;
    
    // Generate a secure state with the user's ID
    const state = this.instagramAuthService.generateOAuthState(userId);
    
    // Use the handleOAuthCallback method which will validate the state and exchange the token
    // Pass the redirect URI from the DTO
    return this.instagramAuthService.handleOAuthCallback(
      tokenDto.code,
      state,
      tokenDto.redirectUri
    );
  }
}