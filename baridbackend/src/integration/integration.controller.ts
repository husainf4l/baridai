import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IntegrationService } from './integration.service';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { InstagramTokenDto } from './dto/instagram-token.dto';

@Controller('integrations')
export class IntegrationController {
  constructor(private integrationService: IntegrationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserIntegrations(@Request() req) {
    return this.integrationService.getUserIntegrations(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getIntegrationById(@Request() req, @Param('id') integrationId: string) {
    return this.integrationService.getIntegrationById(
      req.user.userId,
      integrationId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createIntegration(
    @Request() req,
    @Body() createIntegrationDto: CreateIntegrationDto,
  ) {
    console.log(createIntegrationDto);
    return this.integrationService.createIntegration(
      req.user.userId,
      createIntegrationDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateIntegration(
    @Request() req,
    @Param('id') integrationId: string,
    @Body() createIntegrationDto: CreateIntegrationDto,
  ) {
    return this.integrationService.updateIntegration(
      req.user.userId,
      integrationId,
      createIntegrationDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteIntegration(@Request() req, @Param('id') integrationId: string) {
    return this.integrationService.deleteIntegration(
      req.user.userId,
      integrationId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteAllIntegrations(@Request() req) {
    return this.integrationService.deleteAllIntegrations(req.user.userId);
  }

  // Instagram Webhook Verification Endpoint
  @Get('webhook/instagram')
  async verifyInstagramWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.challenge') challenge: string,
    @Query('hub.verify_token') verifyToken: string,
    @Res() res: Response,
  ) {
    // Verify token should match what was configured in the Instagram app
    const expectedToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;

    if (mode === 'subscribe' && verifyToken === expectedToken) {
      // Respond with the challenge token from the request
      console.log('Instagram webhook verified successfully');
      return res.status(HttpStatus.OK).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      console.log('Instagram webhook verification failed');
      return res.status(HttpStatus.FORBIDDEN).send('Verification failed');
    }
  } // Instagram Webhook Data Processing Endpoint
  @Post('webhook/instagram')
  async processInstagramWebhook(@Body() payload: any, @Res() res: Response) {
    try {
      console.log(
        'Received Instagram webhook payload:',
        JSON.stringify(payload),
      );

      // Process the incoming webhook data
      await this.integrationService.processInstagramWebhook(payload);

      // Instagram expects a 200 OK response
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      console.error('Error processing Instagram webhook:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }

  /**
   * Exchange Instagram authorization code for access token and save as integration
   */
  @UseGuards(JwtAuthGuard)
  @Post('instagram/token')
  async exchangeInstagramToken(
    @Request() req,
    @Body() instagramTokenDto: InstagramTokenDto,
  ) {
    const { code, redirectUri } = instagramTokenDto;
    return this.integrationService.exchangeInstagramToken(
      req.user.userId,
      code,
      redirectUri,
    );
  }

  /**
   * Refresh an existing Instagram token
   */
  @UseGuards(JwtAuthGuard)
  @Post('instagram/refresh/:id')
  async refreshInstagramToken(@Request() req, @Param('id') integrationId: string) {
    return this.integrationService.refreshInstagramToken(
      req.user.userId,
      integrationId,
    );
  }
}
