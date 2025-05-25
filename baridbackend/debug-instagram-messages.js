// debug-instagram-messages.js
const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

async function debugInstagramMessages() {
  try {
    // Find one user
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('No users found in the database');
      return;
    }
    
    console.log(`Testing with user: ${user.id}`);
    
    // Get integrations for this user
    const integrations = await prisma.integration.findMany({
      where: {
        userId: user.id,
        name: 'INSTAGRAM',
      },
    });
    
    console.log(`Found ${integrations.length} Instagram integrations`);
    console.log(JSON.stringify(integrations, null, 2));
    
    // Get automations for this user
    const automations = await prisma.automation.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
      },
    });
    
    console.log(`Found ${automations.length} automations`);
    console.log(JSON.stringify(automations, null, 2));
    
    // Get all Instagram IDs from integrations
    const instagramIds = integrations
      .map(integration => integration.instagramId)
      .filter(Boolean);
    
    // Get automation IDs
    const automationIds = automations.map(automation => automation.id);
    
    // Build where clause for DMs query
    const where = {
      automationId: {
        in: automationIds,
      },
    };
    
    // Filter by Instagram IDs if available
    if (instagramIds.length > 0) {
      where.reciever = {
        in: instagramIds,
      };
    }
    
    console.log('Query where clause:', JSON.stringify(where, null, 2));
    
    // Get messages
    const messages = await prisma.dms.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        automation: {
          select: {
            name: true,
          },
        },
      },
    });
    
    console.log(`Found ${messages.length} messages`);
    console.log(JSON.stringify(messages, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugInstagramMessages();
