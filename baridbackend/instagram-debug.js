require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

async function debugInstagram() {
  try {
    console.log('===== Instagram Integration Debug Tool =====');
    
    // Check for Instagram integrations
    const integrations = await prisma.integration.findMany({
      where: {
        name: 'INSTAGRAM',
      },
    });
    
    console.log(`\nFound ${integrations.length} Instagram integrations`);
    
    if (integrations.length === 0) {
      console.log('\nNo Instagram integrations found. Please set up an integration first.');
      return;
    }
    
    // Display integration details (with truncated tokens)
    for (const integration of integrations) {
      const tokenPreview = integration.token ? 
        `${integration.token.substring(0, 10)}...${integration.token.substring(integration.token.length - 5)}` : 
        'No token';
      
      console.log(`\nIntegration ID: ${integration.id}`);
      console.log(`- User ID: ${integration.userId}`);
      console.log(`- Instagram ID: ${integration.instagramId || 'Not set'}`);
      console.log(`- Page ID: ${integration.pageId || 'Not set'}`);
      console.log(`- Page Name: ${integration.pageName || 'Not set'}`);
      console.log(`- Token: ${tokenPreview}`);
      console.log(`- Expires: ${integration.expiresAt}`);
      
      // Check if the instagramId is properly set
      if (!integration.instagramId) {
        console.log('\n⚠️ WARNING: Instagram ID is not set for this integration');
        console.log('This will cause webhook events to be ignored as they cannot be matched to an integration.');
      }
    }
    
    // Check for automations
    const automations = await prisma.automation.findMany();
    
    console.log(`\nFound ${automations.length} automations`);
    
    if (automations.length === 0) {
      console.log('\n⚠️ WARNING: No automations found. Messages cannot be stored without automations.');
      console.log('Create at least one automation for the user to store Instagram messages.');
    } else {
      // Display active automations
      const activeAutomations = automations.filter(a => a.active);
      console.log(`\nActive automations: ${activeAutomations.length}/${automations.length}`);
      
      if (activeAutomations.length === 0) {
        console.log('\n⚠️ WARNING: No active automations found. Messages can only be stored for active automations.');
      }
      
      // Show automation by user
      const automationsByUser = {};
      for (const automation of automations) {
        if (!automationsByUser[automation.userId]) {
          automationsByUser[automation.userId] = [];
        }
        automationsByUser[automation.userId].push(automation);
      }
      
      for (const userId in automationsByUser) {
        const userAutomations = automationsByUser[userId];
        const activeCount = userAutomations.filter(a => a.active).length;
        
        console.log(`\nUser ${userId} has ${userAutomations.length} automations (${activeCount} active)`);
        
        // Check if this user has an Instagram integration
        const userIntegration = integrations.find(i => i.userId === userId);
        if (!userIntegration) {
          console.log(`⚠️ WARNING: User ${userId} has automations but no Instagram integration`);
        }
      }
    }
    
    // Check for DMs
    const dmsCount = await prisma.dms.count();
    console.log(`\nTotal DMs in database: ${dmsCount}`);
    
    if (dmsCount === 0) {
      console.log('\nNo messages found in the database.');
      
      // Simulate a webhook to test the webhook processing
      console.log('\nSimulating an Instagram webhook to test message processing...');
      
      // For each integration, simulate a webhook
      for (const integration of integrations) {
        if (!integration.instagramId) {
          console.log(`⚠️ Cannot simulate webhook for integration ${integration.id} - missing Instagram ID`);
          continue;
        }
        
        const simulatedWebhook = {
          object: 'instagram',
          entry: [
            {
              id: integration.instagramId,
              time: Date.now(),
              messaging: [
                {
                  sender: { id: 'test_sender_id' },
                  recipient: { id: integration.instagramId },
                  timestamp: Date.now(),
                  message: {
                    mid: `test_message_${Date.now()}`,
                    text: 'This is a test message from the debug script'
                  }
                }
              ]
            }
          ]
        };
        
        try {
          // Send the webhook to our endpoint
          const response = await axios.post('http://localhost:4008/webhook/instagram', simulatedWebhook, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          console.log(`Webhook simulation response: ${response.status} ${response.statusText}`);
          console.log('Wait a moment for processing...');
          
          // Wait for 2 seconds to allow processing
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Check if the message was stored
          const newCount = await prisma.dms.count();
          if (newCount > dmsCount) {
            console.log('✅ Success! Test message was stored in the database.');
          } else {
            console.log('❌ Test message was not stored in the database.');
            console.log('Check the server logs for errors during webhook processing.');
          }
        } catch (error) {
          console.error('Error simulating webhook:', error.message);
        }
      }
    } else {
      const recentDms = await prisma.dms.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
        include: {
          automation: {
            select: {
              name: true,
              userId: true,
            }
          }
        }
      });
      
      console.log('\nMost recent DMs:');
      for (const dm of recentDms) {
        console.log('\n------------------------');
        console.log(`Message: "${dm.message}"`);
        console.log(`From: ${dm.senderId}`);
        console.log(`To: ${dm.reciever}`);
        console.log(`Date: ${dm.createdAt}`);
        console.log(`Automation: ${dm.automation?.name || 'None'} (User: ${dm.automation?.userId || 'Unknown'})`);
      }
      
      // Check if these messages are correctly accessible via API
      try {
        // For each unique user ID in recent DMs
        const userIds = [...new Set(recentDms.map(dm => dm.automation?.userId).filter(Boolean))];
        
        for (const userId of userIds) {
          console.log(`\nTesting API access for user ${userId}...`);
          
          // Make a direct database query how the API would do it
          const automations = await prisma.automation.findMany({
            where: {
              userId: userId,
            },
            select: {
              id: true,
            },
          });
          
          if (!automations.length) {
            console.log(`No automations found for user ${userId}`);
            continue;
          }
          
          const automationIds = automations.map(a => a.id);
          
          const messages = await prisma.dms.findMany({
            where: {
              automationId: {
                in: automationIds,
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 10,
          });
          
          console.log(`Found ${messages.length} messages that should be accessible via API`);
          
          if (messages.length > 0) {
            console.log(`Most recent message: "${messages[0].message}" from ${messages[0].senderId}`);
          }
        }
      } catch (error) {
        console.error('Error testing API access:', error);
      }
    }
    
    console.log('\n===== Debug Complete =====');
  } catch (error) {
    console.error('Error debugging Instagram:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugInstagram();
