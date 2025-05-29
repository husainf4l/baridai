import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListenerDto } from './dto/create-listener.dto';
import { IntegrationService } from '../integration/integration.service';
import axios from 'axios';

@Injectable()
export class WebhookService {
  constructor(
    private prisma: PrismaService,
    private integrationService: IntegrationService
  ) { }

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
              OR: [
                { integrationId: integration.id }, // Filter by specific integration
                { integrationId: null }            // Include automations not tied to any specific integration
              ]
            },
            include: {
              listener: true,
              keywords: true,
            },
          });

          console.log(`Found ${automations.length} active automations for user ${integration.userId}`);

          if (automations.length === 0) {
            console.log('⚠️ No active automations found for this integration, creating message will be skipped');
            continue;
          }

          // Store the message for each active automation
          for (const automation of automations) {
            console.log(`Creating DM record for automation: ${automation.id}`);

            // Create a record of this DM in our database
            try {
              const createdDm = await this.prisma.dms.create({
                data: {
                  automationId: automation.id,
                  senderId: senderId,
                  reciever: recipientId,
                  message: messageText,
                },
              });

              console.log(`✅ Successfully created DM record: ${createdDm.id}`);

              // Send message info to external webhook before responding
              let webhookResponse = null;
              let responseMessage = "received";

              try {
                console.log(`📤 Sending message info to widd.ai webhook`);
                const webhookResult = await axios.post('https://widd.ai/webhook/baridai', {
                  automationId: automation.id,
                  automationName: automation.name,
                  senderId,
                  recipientId,
                  messageText,
                  createdDm,
                  integration: {
                    userId: integration.userId,
                    pageId: integration.pageId,
                    instagramId: integration.instagramId,
                    pageName: integration.pageName,
                  },
                  timestamp: new Date().toISOString(),
                }, {
                  timeout: 10000, // 10 second timeout
                  headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'BaridAI-Webhook/1.0'
                  }
                });

                console.log('✅ Sent message info to widd.ai webhook');
                console.log('📊 Webhook response:', JSON.stringify(webhookResult.data, null, 2));

                // If the webhook returns a response message, use it
                if (webhookResult.data && webhookResult.data.message) {
                  responseMessage = webhookResult.data.message;
                  console.log(`Using webhook response message: "${responseMessage}"`);
                }
              } catch (webhookError) {
                console.error('❌ Failed to send info to widd.ai webhook:', webhookError?.response?.data || webhookError.message);
                console.error('🔍 Webhook error details:', JSON.stringify({
                  status: webhookError?.response?.status,
                  statusText: webhookError?.response?.statusText,
                  data: webhookError?.response?.data
                }, null, 2));
              }

              // Automatically respond with the message
              try {
                console.log(`🔄 Sending automatic response to sender ${senderId}: "${responseMessage}"`);

                // Send response using the Instagram Graph API
                const response = await this.sendInstagramMessage(
                  integration.userId,
                  {
                    pageId: integration.pageId,
                    recipientId: senderId,
                    message: responseMessage
                  }
                );

                if (response.success) {
                  console.log(`✅ Automatic response sent successfully`);
                } else {
                  console.error(`❌ Failed to send automatic response: ${response.error}`);
                }
              } catch (responseError) {
                console.error(`❌ Failed to send automatic response:`, responseError);
              }
            } catch (error) {
              console.error('❌ Failed to create DM record:', error);
            }

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
  async getRecentMessages(userId: string, options?: any) {
    console.log(`Getting recent messages for user: ${userId}`);

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
      console.log(`No automations found for user: ${userId}`);
      return [];
    }

    console.log(`Found ${automations.length} automations for user`);

    // Get automation IDs
    const automationIds = automations.map((automation) => automation.id);

    // Build query
    const where: any = {
      automationId: {
        in: automationIds,
      },
    };

    // Apply platform filter if provided
    if (options?.platform) {
      console.log(`Filtering by platform: ${options.platform}`);
      // This would need to be mapped to the correct field in your schema
      // Currently no platform field exists in Dms model
    }

    // Apply before filter if provided
    if (options?.before) {
      console.log(`Filtering messages before: ${options.before}`);
      where.createdAt = {
        lt: new Date(options.before),
      };
    }

    // Determine limit
    const limit = options?.limit ? parseInt(String(options.limit)) : 100;
    console.log(`Using limit: ${limit}`);

    // Get recent messages for these automations
    const messages = await this.prisma.dms.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    console.log(`Found ${messages.length} messages`);

    return messages;
  }

  // Get messages for a specific automation
  async getMessagesForAutomation(userId: string, automationId: string) {
    console.log(`Getting messages for automation: ${automationId}, user: ${userId}`);

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

    console.log(`Found automation: ${automation.name}`);

    // Get messages for this automation
    const messages = await this.prisma.dms.findMany({
      where: {
        automationId: automationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`Found ${messages.length} messages for automation: ${automationId}`);

    return messages;
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
      console.log(`Fetching Instagram messages for user: ${userId}`);
      console.log(`Options:`, JSON.stringify(options));

      // First, get the user's Instagram integration to verify tokens and page access
      const integrations = await this.prisma.integration.findMany({
        where: {
          userId: userId,
          name: 'INSTAGRAM',
        },
      });

      console.log(`Found ${integrations.length} Instagram integrations for user ${userId}`);

      if (!integrations.length) {
        console.log(`No Instagram integrations found for user ${userId}`);
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

      console.log(`Found ${automations.length} automations for user ${userId}`);

      if (!automations.length) {
        console.log(`No automations found for user ${userId}`);
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

      // Get all relevant Instagram IDs and Page IDs from integrations
      const instagramIds = integrations
        .map(integration => integration.instagramId)
        .filter(Boolean);

      const pageIds = integrations
        .map(integration => integration.pageId)
        .filter(Boolean);

      console.log(`Instagram IDs for filtering: ${JSON.stringify(instagramIds)}`);
      console.log(`Page IDs for filtering: ${JSON.stringify(pageIds)}`);

      // Build combined list of IDs to check in receiver field
      // This should include both Instagram IDs and Page IDs since
      // sometimes we store one or the other depending on the source
      const possibleReceiverIds = [...instagramIds];

      // Add page IDs if they exist and aren't already included
      if (pageIds.length > 0) {
        for (const pageId of pageIds) {
          if (!possibleReceiverIds.includes(pageId)) {
            possibleReceiverIds.push(pageId);
          }
        }
      }

      // If we have any IDs to filter by, add them to the query
      if (possibleReceiverIds.length > 0) {
        console.log(`Filtering by receiver IDs: ${JSON.stringify(possibleReceiverIds)}`);
        where.reciever = {
          in: possibleReceiverIds
        };
      }

      // Filter by specific page if explicitly provided as parameter
      if (options.pageId) {
        console.log(`Filtering by specific pageId: ${options.pageId}`);
        where.reciever = options.pageId;
      }

      // Filter by conversation (sender) if provided
      if (options.conversationId) {
        console.log(`Filtering by conversationId: ${options.conversationId}`);
        where.senderId = options.conversationId;
      }

      console.log("Final query where clause:", JSON.stringify(where, null, 2));

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

      console.log(`Found ${messages.length} messages matching criteria`);

      console.log(`Found ${messages.length} messages matching criteria`);

      // Log first few messages for debugging
      if (messages.length > 0) {
        console.log('Sample messages:');
        messages.slice(0, 3).forEach((msg, i) => {
          console.log(`Message ${i + 1}: From: ${msg.senderId}, To: ${msg.reciever}, Text: ${msg.message?.substring(0, 30)}...`);
        });
      } else {
        console.log('NO MESSAGES FOUND with query:', JSON.stringify(where, null, 2));

        // Debug - Get all DMs to see what's in the database
        const allDms = await this.prisma.dms.findMany({
          take: 10
        });
        console.log(`DEBUGGING - Total DMs in database: ${allDms.length}`);
        if (allDms.length > 0) {
          console.log('Sample DMs from database:');
          allDms.forEach((dm, i) => {
            console.log(`DM ${i + 1}: AutomationId: ${dm.automationId}, From: ${dm.senderId}, To: ${dm.reciever}`);
          });
        }
      }

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

  // Method to send a response to an Instagram DM
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

      // Make sure we have an Instagram ID to send from
      if (!integration.instagramId) {
        return {
          success: false,
          error: 'Instagram Business Account ID not found in the integration',
        };
      }

      // Send message using the Graph API - Using instagramId instead of pageId for the URL
      // Instagram requires using graph.instagram.com domain for Instagram API requests
      const url = `https://graph.instagram.com/v22.0/${integration.instagramId}/messages`;

      const requestBody = {
        recipient: { id: data.recipientId },
        message: { text: data.message },
        messaging_type: 'RESPONSE',
      };

      // Log the outgoing request (for debugging)
      console.log(`Sending message to Instagram API: ${url}`);
      console.log(`Body: ${JSON.stringify(requestBody)}`);
      console.log(`Using token: ${integration.token.substring(0, 10)}...`);

      try {
        // Make the actual API call to Instagram
        // Clean the token to remove any whitespace, newline characters, or other problematic chars
        let cleanToken = integration.token;

        // Handle null or undefined token
        if (!cleanToken) {
          console.error('Token is null or undefined');
          return {
            success: false,
            error: 'Token is missing in the integration',
          };
        }

        // Convert to string if not already and perform thorough cleaning
        cleanToken = String(cleanToken)
          .trim()
          .replace(/[\r\n\t\f\v ]/g, ''); // Remove all whitespace characters

        // Log token diagnostics for debugging
        console.log('Raw token length:', integration.token.length);
        console.log('Clean token length:', cleanToken.length);
        console.log('Token first 10 chars:', cleanToken.substring(0, 10));
        console.log('Token last 10 chars:', cleanToken.substring(cleanToken.length - 10));

        // Check for extremely short or malformed tokens
        if (cleanToken.length < 20) {
          console.error('Token appears too short to be valid');
          return {
            success: false,
            error: 'Token appears to be invalid (too short)',
          };
        }

        const response = await axios.post(url, requestBody, {
          headers: {
            'Authorization': `Bearer ${cleanToken}`,
            'Content-Type': 'application/json',
          },
        });

        console.log(`Instagram API response: ${response.status} ${response.statusText}`);
        console.log(`Response data:`, JSON.stringify(response.data, null, 2));

        return {
          success: true,
          data: {
            message: 'Message sent successfully',
            recipientId: data.recipientId,
            pageId: data.pageId,
            apiResponse: response.data
          },
        };
      } catch (apiError) {
        console.error('Instagram API error:', apiError.response?.data || apiError.message);
        if (apiError.response?.status === 401) {
          console.error('Authentication failed - invalid token or permissions');
          return {
            success: false,
            error: 'Authentication failed with Instagram API - invalid token',
            details: apiError.response?.data?.error || apiError.message
          };
        }
        return {
          success: false,
          error: 'Instagram API error',
          details: apiError.response?.data || apiError.message
        };
      }
    } catch (error) {
      console.error('Error sending Instagram message:', error);
      return {
        success: false,
        error: 'Failed to send Instagram message',
        details: error.message
      };
    }
  }

  /**
   * Process Instagram OAuth callback
   * @param code Authorization code from Instagram
   * @param state State parameter to verify request
   */
  async processInstagramAuthCallback(code: string, state: string): Promise<void> {
    try {
      console.log('Processing Instagram OAuth callback');
      console.log(`Authorization code: ${code.substring(0, 5)}...`);
      console.log(`State: ${state}`);

      // Parse state parameter (should contain userId and other metadata)
      let stateData;
      try {
        stateData = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'));
      } catch (error) {
        console.error('Failed to parse state parameter:', error);
        throw new Error('Invalid state parameter');
      }

      const { userId } = stateData;
      if (!userId) {
        throw new Error('Invalid state: missing userId');
      }

      // Use the same redirect URI that the frontend is using
      const redirectUri = "https://baridai.com/webhook/instagram/auth-callback";

      // Exchange code for token using the integration service
      const result = await this.integrationService.exchangeInstagramToken(
        userId,
        code,
        redirectUri
      );

      console.log(`Created Instagram integration for user: ${userId}`);
    } catch (error) {
      console.error('Error processing Instagram auth callback:', error);
      throw error;
    }
  }

  /**
   * Process Instagram deauthorization webhook
   * @param data Deauthorization data
   */
  async processInstagramDeauthorize(data: any): Promise<void> {
    try {
      console.log('Processing Instagram deauthorize webhook');
      console.log(JSON.stringify(data, null, 2));

      // Extract signed request
      const signedRequest = data.signed_request;
      if (!signedRequest) {
        throw new Error('Missing signed_request parameter');
      }

      // In a real implementation, you would:
      // 1. Parse and verify the signed_request
      // 2. Extract the user ID
      // 3. Delete the relevant integrations

      // For now, just log that we received the request
      console.log('Received Instagram deauthorize webhook');
      console.log('In a production environment, would delete the integration');
    } catch (error) {
      console.error('Error processing Instagram deauthorize:', error);
      throw error;
    }
  }

  /**
   * Process Instagram data deletion request
   * @param data Data deletion request
   * @returns Confirmation code
   */
  async processInstagramDataDeletion(data: any): Promise<string> {
    try {
      console.log('Processing Instagram data deletion request');
      console.log(JSON.stringify(data, null, 2));

      // Extract signed request
      const signedRequest = data.signed_request;
      if (!signedRequest) {
        throw new Error('Missing signed_request parameter');
      }

      // In a real implementation, you would:
      // 1. Parse and verify the signed_request
      // 2. Extract the user ID
      // 3. Delete all user data associated with the Instagram account

      // For now, just generate a confirmation code
      const confirmationCode = `DELETION_CONFIRMED_${Math.random().toString(36).substring(2, 10)}`;
      console.log(`Generated confirmation code: ${confirmationCode}`);

      return confirmationCode;
    } catch (error) {
      console.error('Error processing Instagram data deletion:', error);
      throw error;
    }
  }

  // Create a new listener for an automation
  async createListener(userId: string, createListenerDto: CreateListenerDto) {
    // Check if the automation belongs to the user
    const automation = await this.prisma.automation.findFirst({
      where: {
        id: createListenerDto.automationId,
        userId: userId,
      },
    });

    if (!automation) {
      throw new NotFoundException('Automation not found or does not belong to the user');
    }

    // Create the listener
    return this.prisma.listener.create({
      data: {
        type: createListenerDto.type,
        automationId: createListenerDto.automationId,
      },
    });
  }

  // Get all listeners for a user
  async getListeners(userId: string) {
    // Get all automations for the user
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

    const automationIds = automations.map((automation) => automation.id);

    // Get listeners for these automations
    return this.prisma.listener.findMany({
      where: {
        automationId: {
          in: automationIds,
        },
      },
      include: {
        automation: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  // Get a specific listener by ID
  async getListenerById(userId: string, listenerId: string) {
    // Get all automations for the user
    const automations = await this.prisma.automation.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
      },
    });

    if (!automations.length) {
      throw new NotFoundException('No automations found for this user');
    }

    const automationIds = automations.map((automation) => automation.id);

    // Get the listener if it belongs to one of the user's automations
    const listener = await this.prisma.listener.findFirst({
      where: {
        id: listenerId,
        automationId: {
          in: automationIds,
        },
      },
      include: {
        automation: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!listener) {
      throw new NotFoundException('Listener not found');
    }

    return listener;
  }

  // Update a listener
  async updateListener(userId: string, listenerId: string, updateListenerDto: CreateListenerDto) {
    // Check if the automation belongs to the user
    const automation = await this.prisma.automation.findFirst({
      where: {
        id: updateListenerDto.automationId,
        userId: userId,
      },
    });

    if (!automation) {
      throw new NotFoundException('Automation not found or does not belong to the user');
    }

    // Check if listener exists and belongs to one of the user's automations
    const existingListener = await this.prisma.listener.findFirst({
      where: {
        id: listenerId,
        automation: {
          userId: userId,
        },
      },
    });

    if (!existingListener) {
      throw new NotFoundException('Listener not found or does not belong to the user');
    }

    // Update the listener
    return this.prisma.listener.update({
      where: {
        id: listenerId,
      },
      data: {
        type: updateListenerDto.type,
        automationId: updateListenerDto.automationId,
      },
    });
  }

  // Delete a listener
  async deleteListener(userId: string, listenerId: string) {
    // Check if listener exists and belongs to one of the user's automations
    const existingListener = await this.prisma.listener.findFirst({
      where: {
        id: listenerId,
        automation: {
          userId: userId,
        },
      },
    });

    if (!existingListener) {
      throw new NotFoundException('Listener not found or does not belong to the user');
    }

    // Delete the listener
    return this.prisma.listener.delete({
      where: {
        id: listenerId,
      },
    });
  }

  /**
   * Handle Instagram OAuth code exchange and integration creation
   * @param userId User ID to associate the integration with
   * @param code Instagram authorization code
   * @returns Integration details
   */
  async handleInstagramOAuth(userId: string, code: string): Promise<any> {
    try {
      // Use the exact same redirect URI that is used in the frontend
      // This must match what was used when the user was redirected to Instagram
      const redirectUri = "https://baridai.com/webhook/instagram/auth-callback";

      // Use existing integration service method to exchange token and create integration
      return await this.integrationService.exchangeInstagramToken(
        userId,
        code,
        redirectUri
      );
    } catch (error) {
      console.error('Error handling Instagram OAuth:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to process Instagram authentication',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Generate Instagram OAuth URL for frontend to redirect users
   * @param state Optional state parameter for security validation
   * @returns OAuth URL for Instagram auth flow
   */
  getInstagramAuthUrl(state?: string): string {
    const clientId = process.env.INSTAGRAM_APP_ID;
    if (!clientId) {
      throw new HttpException(
        'Instagram App ID not configured',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // Use the exact same redirect URI that is used in the frontend
    const redirectUri = "https://baridai.com/webhook/instagram/auth-callback";

    // Expanded scope for better Instagram access
    // user_profile: Basic profile info
    // user_media: Media content
    // instagram_basic: Comments, likes, etc.
    // instagram_manage_messages: For DM access
    const scope = 'user_profile,user_media,instagram_basic,instagram_manage_messages';

    let authUrl = `https://api.instagram.com/oauth/authorize` +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${scope}` +
      `&response_type=code`;

    // Add state parameter if provided for security validation
    if (state) {
      authUrl += `&state=${encodeURIComponent(state)}`;
    }

    console.log(`Generated Instagram auth URL with redirect to: ${redirectUri}`);
    return authUrl;
  }
}
