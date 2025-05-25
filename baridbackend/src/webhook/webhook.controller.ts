import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { WebhookService } from './webhook.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateListenerDto } from './dto/create-listener.dto';

@Controller('webhook')
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  // Instagram Webhook Verification Endpoint
  @Get('instagram')
  async verifyInstagramWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.challenge') challenge: string,
    @Query('hub.verify_token') verifyToken: string,
    @Res() res: Response,
  ) {
    console.log('Instagram webhook verification request received:');
    console.log(
      `Mode: ${mode}, Challenge: ${challenge}, Token: ${verifyToken}`,
    );

    // Verify token should match what was configured in the Instagram app
    const expectedToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || 'test';

    if (mode === 'subscribe' && verifyToken === expectedToken) {
      // Respond with the challenge token from the request
      console.log(
        `Instagram webhook verified successfully, returning challenge: ${challenge}`,
      );
      return res.status(HttpStatus.OK).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      console.log('Instagram webhook verification failed:');
      console.log(`Expected token: ${expectedToken}, received: ${verifyToken}`);
      console.log(`Mode: ${mode}`);
      return res.status(HttpStatus.FORBIDDEN).send('Verification failed');
    }
  }

  // Instagram Webhook Data Processing Endpoint
  @Post('instagram')
  async processInstagramWebhook(@Body() payload: any, @Res() res: Response) {
    try {
      const requestId = Math.random().toString(36).substring(2, 15);
      const timestamp = new Date().toISOString();

      console.log('\n');
      console.log('🔔 🔔 🔔 INSTAGRAM WEBHOOK REQUEST RECEIVED 🔔 🔔 🔔');
      console.log(`⏰ Timestamp: ${timestamp}`);
      console.log('🆔 Request ID:', requestId);

      // Log the entry structure for debugging
      if (payload.entry && payload.entry.length > 0) {
        console.log(`📦 Received ${payload.entry.length} entries`);
        console.log(`📝 Object type: ${payload.object}`);
        
        // Log each entry's ID to help with debugging
        payload.entry.forEach((entry, index) => {
          console.log(`Entry ${index + 1} ID: ${entry.id}`);
          
          // If this is a messaging webhook, log more details
          if (entry.messaging && Array.isArray(entry.messaging)) {
            entry.messaging.forEach((msg, i) => {
              const sender = msg.sender?.id || 'unknown';
              const recipient = msg.recipient?.id || 'unknown';
              const text = msg.message?.text ? `"${msg.message.text.substring(0, 30)}..."` : 'no text';
              console.log(`📱 Message ${i + 1}: From ${sender} to ${recipient}: ${text}`);
            });
          }
        });
      }

      // Always respond with 200 OK quickly (required by Meta webhooks)
      // Even if processing fails, we should acknowledge receipt
      res.status(HttpStatus.OK).send('EVENT_RECEIVED');

      // Verify this is a page/instagram webhook event
      if (payload.object === 'instagram') {
        // Process the incoming webhook data in the background
        this.webhookService.processInstagramWebhook(payload).catch((error) => {
          console.error(
            `Background processing of webhook ${requestId} failed:`,
            error,
          );
        });
      } else {
        console.log(`Unhandled webhook object type: ${payload.object}`);
      }

      return;
    } catch (error) {
      console.error('Error processing Instagram webhook:', error);
      // Still return 200 OK to Instagram to avoid webhook retries
      return res.status(HttpStatus.OK).send();
    }
  }

  // Get recent messages for a user
  @UseGuards(JwtAuthGuard)
  @Get('messages')
  async getRecentMessages(
    @Req() req,
    @Query('platform') platform?: string,
    @Query('limit') limit?: number,
    @Query('before') before?: string,
  ) {
    const userId = req.user.userId;
    const options = {
      platform,
      limit: limit ? parseInt(String(limit)) : 50,
      before: before || undefined,
    };
    return this.webhookService.getRecentMessages(userId, options);
  }

  // Get messages for a specific automation
  @UseGuards(JwtAuthGuard)
  @Get('messages/automation/:automationId')
  async getAutomationMessages(
    @Req() req,
    @Param('automationId') automationId: string,
    @Query('limit') limit?: number,
  ) {
    const userId = req.user.userId;
    return this.webhookService.getMessagesForAutomation(userId, automationId);
  }

  // Get Instagram DM messages for a user
  @UseGuards(JwtAuthGuard)
  @Get('messages/instagram')
  async getInstagramMessages(
    @Req() req,
    @Query('pageId') pageId?: string,
    @Query('conversationId') conversationId?: string,
    @Query('limit') limit?: number,
  ) {
    const userId = req.user.userId;
    return this.webhookService.getInstagramMessages(userId, {
      pageId,
      conversationId,
      limit: limit ? parseInt(String(limit)) : 50,
    });
  }

  // Send a message to an Instagram user
  @UseGuards(JwtAuthGuard)
  @Post('messages/instagram/send')
  async sendInstagramMessage(
    @Req() req,
    @Body()
    messageData: {
      pageId: string;
      recipientId: string;
      message: string;
    },
  ) {
    const userId = req.user.userId;
    return this.webhookService.sendInstagramMessage(userId, messageData);
  }

  // Handle Instagram OAuth callback
  @Get('instagram/auth-callback')
  async handleInstagramAuthCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    try {
      await this.webhookService.processInstagramAuthCallback(code, state);
      return res.redirect('/integration/success');
    } catch (error) {
      console.error('Error processing Instagram auth callback:', error);
      return res.redirect('/integration/error');
    }
  }

  // Handle Instagram deauthorize callback
  @Post('instagram/deauthorize')
  async handleInstagramDeauthorize(
    @Body() data: any,
    @Res() res: Response,
  ) {
    try {
      await this.webhookService.processInstagramDeauthorize(data);
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      console.error('Error processing Instagram deauthorize:', error);
      return res.status(HttpStatus.OK).send();
    }
  }

  // Handle Instagram data deletion request
  @Post('instagram/data-deletion')
  async handleInstagramDataDeletion(
    @Body() data: any,
    @Res() res: Response,
  ) {
    try {
      const confirmationCode = await this.webhookService.processInstagramDataDeletion(data);
      return res.status(HttpStatus.OK).json({ confirmationCode });
    } catch (error) {
      console.error('Error processing Instagram data deletion:', error);
      return res.status(HttpStatus.OK).json({ confirmationCode: 'error' });
    }
  }

  // Create a new listener
  @UseGuards(JwtAuthGuard)
  @Post('listeners')
  async createListener(
    @Req() req,
    @Body() createListenerDto: CreateListenerDto,
  ) {
    const userId = req.user.userId;
    return this.webhookService.createListener(userId, createListenerDto);
  }

  // Get all listeners for the authenticated user
  @UseGuards(JwtAuthGuard)
  @Get('listeners')
  async getListeners(@Req() req) {
    const userId = req.user.userId;
    return this.webhookService.getListeners(userId);
  }

  // Get a specific listener by ID
  @UseGuards(JwtAuthGuard)
  @Get('listeners/:id')
  async getListenerById(@Req() req, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.webhookService.getListenerById(userId, id);
  }

  // Update a listener by ID
  @UseGuards(JwtAuthGuard)
  @Post('listeners/:id')
  async updateListener(
    @Req() req,
    @Param('id') id: string,
    @Body() updateListenerDto: CreateListenerDto,
  ) {
    const userId = req.user.userId;
    return this.webhookService.updateListener(userId, id, updateListenerDto);
  }

  // Delete a listener by ID
  @UseGuards(JwtAuthGuard)
  @Post('listeners/:id/delete')
  async deleteListener(@Req() req, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.webhookService.deleteListener(userId, id);
  }
}
