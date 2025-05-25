import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIntegrationDto } from './dto/create-integration.dto';

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
}
