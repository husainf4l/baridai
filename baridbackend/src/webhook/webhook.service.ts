import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WebhookService {
  constructor(private prisma: PrismaService) {}

  // Process Instagram webhook data
  async processInstagramWebhook(payload: any): Promise<void> {
    // Extract data from the Instagram webhook payload
    try {
      console.log('\n\n===============================');
      console.log('📨 WEBHOOK PAYLOAD RECEIVED 📨');
      console.log('===============================');
      console.log(JSON.stringify(payload, null, 2));
      console.log('===============================\n');

      // Instagram webhook payload structure
      // { object: 'instagram', entry: [ { id: 'instagram-user-id', time: timestamp, changes: [...] } ] }
      if (payload.object !== 'instagram') {
        console.log(' Not an Instagram webhook, ignoring');
        return;
      }

      if (!payload.entry || !Array.isArray(payload.entry)) {
        console.log(
          'Invalid webhook payload format: missing or invalid entry array',
        );
        return;
      }

      // Process each entry in the webhook
      for (const entry of payload.entry) {
        if (!entry || !entry.id) {
          console.log('Invalid entry format:', entry);
          continue;
        }

        const instagramId = entry.id;
        console.log(`Processing entry for Instagram ID: ${instagramId}`);

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

        console.log(
          `Found ${integrations.length} integrations for Instagram ID: ${instagramId}`,
        );

        // Handle different types of webhooks
        if (entry.messaging) {
          // This is a messaging webhook
          await this.processMessages(
            { messaging: entry.messaging },
            integrations,
          );
        } else if (entry.changes && Array.isArray(entry.changes)) {
          // This is a change webhook (comments, mentions, etc.)
          for (const change of entry.changes) {
            await this.processInstagramChange(change, integrations);
          }
        } else {
          console.log('Unrecognized webhook entry format:', entry);
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
    console.log('=== INSTAGRAM MESSAGE RECEIVED ===');
    console.log('---------------------------------');
    console.log(
      'Processing Instagram messages payload:',
      JSON.stringify(value, null, 2),
    );
    console.log('---------------------------------');

    try {
      // Check if this is a valid message object
      if (!value || !value.messaging || !Array.isArray(value.messaging)) {
        console.log(
          '❌ INVALID MESSAGE FORMAT:',
          JSON.stringify(value, null, 2),
        );
        return;
      }

      // Process each message in the messaging array
      for (const messageEvent of value.messaging) {
        // Extract message details
        const senderId = messageEvent.sender?.id;
        const recipientId = messageEvent.recipient?.id;
        const messageText = messageEvent.message?.text;

        if (!senderId || !messageText) {
          console.log(
            '❌ MISSING REQUIRED MESSAGE DATA:',
            JSON.stringify(messageEvent, null, 2),
          );
          continue;
        }

        console.log('📱 INSTAGRAM MESSAGE 📱');
        console.log(`From: ${senderId}`);
        console.log(`To: ${recipientId}`);
        console.log(`Message: "${messageText}"`);
        console.log('---------------------------------');

        // Find all automations for the Instagram account (via integrations)
        for (const integration of integrations) {
          const automations = await this.prisma.automation.findMany({
            where: {
              userId: integration.userId,
              active: true,
            },
            include: {
              listener: true,
              keywords: true,
            },
          });

          // Store the message for each active automation
          for (const automation of automations) {
            // Create a record of this DM in our database
            await this.prisma.dms.create({
              data: {
                automationId: automation.id,
                senderId: senderId,
                reciever: recipientId,
                message: messageText,
              },
            });

            // Check if we need to trigger any automation based on this message
            const shouldTrigger = this.shouldTriggerAutomation(
              automation,
              messageText,
            );

            if (shouldTrigger) {
              console.log(
                `Triggering automation ${automation.id} for message: "${messageText}"`,
              );
              // Here you would implement the logic to execute the automation
              // e.g. respond to the message, perform actions, etc.
            }
          }
        }
      }
    } catch (error) {
      console.error('Error processing Instagram message:', error);
    }
  }

  // Helper method to determine if an automation should be triggered based on message content
  private shouldTriggerAutomation(
    automation: any,
    messageText: string,
  ): boolean {
    // Check if this is a message-based listener
    const messageListener = automation.listener?.find(
      (l) => l.type === 'MESSAGE',
    );

    if (!messageListener) {
      return false;
    }

    // If there are keywords defined, check if the message contains any of them
    if (automation.keywords && automation.keywords.length > 0) {
      return automation.keywords.some((keyword) =>
        messageText.toLowerCase().includes(keyword.word.toLowerCase()),
      );
    }

    // If no keywords are defined but it's a message listener, trigger for all messages
    return true;
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

  // Get recent messages for a user
  async getRecentMessages(userId: string) {
    // Get all automations for this user
    const automations = await this.prisma.automation.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
      },
    });

    if (!automations.length) {
      return [];
    }

    // Get automation IDs
    const automationIds = automations.map((automation) => automation.id);

    // Get recent messages for these automations
    return this.prisma.dms.findMany({
      where: {
        automationId: {
          in: automationIds,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Limit to most recent 100 messages
    });
  }

  // Get messages for a specific automation
  async getMessagesForAutomation(userId: string, automationId: string) {
    // Verify that the automation belongs to the user
    const automation = await this.prisma.automation.findFirst({
      where: {
        id: automationId,
        userId: userId,
      },
    });

    if (!automation) {
      throw new NotFoundException('Automation not found');
    }

    // Get messages for this automation
    return this.prisma.dms.findMany({
      where: {
        automationId: automationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Retrieves Instagram DM messages for a user
   * @param userId The ID of the user
   * @param options Options for filtering and pagination
   * @returns Instagram messages data
   */
  async getInstagramMessages(
    userId: string,
    options: {
      pageId?: string;
      conversationId?: string;
      limit?: number;
    },
  ) {
    try {
      // First, get the user's Instagram integration to verify tokens and page access
      const integrations = await this.prisma.integration.findMany({
        where: {
          userId: userId,
          name: 'INSTAGRAM',
        },
      });

      if (!integrations.length) {
        return {
          success: false,
          error: 'No Instagram integration found for this user',
        };
      }

      // Get all automations for this user
      const automations = await this.prisma.automation.findMany({
        where: {
          userId: userId,
        },
        select: {
          id: true,
        },
      });

      if (!automations.length) {
        return {
          success: true,
          data: {
            messages: [],
            count: 0,
          },
        };
      }

      // Get automation IDs
      const automationIds = automations.map((automation) => automation.id);

      // Build query based on provided options
      const where: any = {
        automationId: {
          in: automationIds,
        },
      };

      // Filter by specific page if provided (or use the first integration's page ID)
      if (options.pageId) {
        // Use the specified page ID for filtering
        where.reciever = options.pageId;
      } else if (integrations[0]?.instagramId) {
        // Use the first integration's Instagram ID as a default if no page ID provided
        where.reciever = integrations[0].instagramId;
      }

      // Filter by conversation (sender) if provided
      if (options.conversationId) {
        where.senderId = options.conversationId;
      }

      // Get Instagram messages using Prisma
      const messages = await this.prisma.dms.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        take: options.limit || 50,
        include: {
          automation: {
            select: {
              name: true,
            },
          },
        },
      });

      // Include integration data for context
      const integrationData = integrations.map((integration) => ({
        instagramId: integration.instagramId,
        pageId: integration.pageId || null,
        pageName: integration.pageName || null,
      }));

      return {
        success: true,
        data: {
          messages,
          count: messages.length,
          integrations: integrationData,
        },
      };
    } catch (error) {
      console.error('Error retrieving Instagram messages:', error);
      return {
        success: false,
        error: 'Failed to retrieve Instagram messages',
      };
    }
  }

  // New method to send a response to an Instagram DM
  async sendInstagramMessage(
    userId: string,
    data: {
      pageId: string;
      recipientId: string;
      message: string;
    },
  ) {
    try {
      // Find the integration with the access token
      const integration = await this.prisma.integration.findFirst({
        where: {
          userId: userId,
          name: 'INSTAGRAM',
          pageId: data.pageId,
        },
      });

      if (!integration || !integration.token) {
        return {
          success: false,
          error: 'No valid Instagram integration found with access token',
        };
      }

      // Send message using the Graph API
      const url = `https://graph.facebook.com/v17.0/${data.pageId}/messages`;

      const requestBody = {
        recipient: { id: data.recipientId },
        message: { text: data.message },
        messaging_type: 'RESPONSE',
      };

      // Log the outgoing request (for debugging)
      console.log(`Sending message to Instagram API: ${url}`);
      console.log(`Body: ${JSON.stringify(requestBody)}`);
      console.log(`Using token: ${integration.token.substring(0, 10)}...`);

      // TODO: Use your HTTP client (axios, fetch, etc.) to make the API call
      // const response = await axios.post(url, requestBody, {
      //   headers: {
      //     'Authorization': `Bearer ${integration.token}`,
      //     'Content-Type': 'application/json',
      //   },
      // });

      // For now, we'll just return a mock success response
      return {
        success: true,
        data: {
          message: 'Message sent successfully',
          recipientId: data.recipientId,
          pageId: data.pageId,
        },
      };
    } catch (error) {
      console.error('Error sending Instagram message:', error);
      return {
        success: false,
        error: 'Failed to send Instagram message',
      };
    }
  }
}
