require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugInstagram() {
  try {
    console.log('Checking Instagram integrations...');
    
    // Get all integrations
    const integrations = await prisma.integration.findMany({
      where: {
        name: 'INSTAGRAM',
      },
    });
    
    console.log(`Found ${integrations.length} Instagram integrations`);
    
    // Display integration details (with truncated tokens)
    integrations.forEach((integration, index) => {
      const tokenPreview = integration.token ? 
        `${integration.token.substring(0, 10)}...${integration.token.substring(integration.token.length - 5)}` : 
        'No token';
      
      console.log(`\nIntegration #${index + 1}:`);
      console.log(`- User ID: ${integration.userId}`);
      console.log(`- Instagram ID: ${integration.instagramId}`);
      console.log(`- Page ID: ${integration.pageId}`);
      console.log(`- Page Name: ${integration.pageName}`);
      console.log(`- Token: ${tokenPreview}`);
      console.log(`- Expires: ${integration.expiresAt}`);
    });
    
    // Check for DMs
    const dmsCount = await prisma.dms.count();
    console.log(`\nTotal DMs in database: ${dmsCount}`);
    
    if (dmsCount > 0) {
      const recentDms = await prisma.dms.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      });
      
      console.log('\nMost recent DMs:');
      recentDms.forEach((dm, index) => {
        console.log(`\nDM #${index + 1}:`);
        console.log(`- Automation ID: ${dm.automationId}`);
        console.log(`- Sender ID: ${dm.senderId}`);
        console.log(`- Receiver: ${dm.reciever}`);
        console.log(`- Message: ${dm.message}`);
        console.log(`- Created: ${dm.createdAt}`);
      });
    }
    
    // Check for automations
    const automationsCount = await prisma.automation.count();
    console.log(`\nTotal automations in database: ${automationsCount}`);
    
    if (automationsCount > 0) {
      const automations = await prisma.automation.findMany({
        select: {
          id: true,
          name: true,
          active: true,
          userId: true,
        },
      });
      
      console.log('\nAutomations:');
      automations.forEach((automation, index) => {
        console.log(`\nAutomation #${index + 1}:`);
        console.log(`- ID: ${automation.id}`);
        console.log(`- Name: ${automation.name}`);
        console.log(`- Active: ${automation.active}`);
        console.log(`- User ID: ${automation.userId}`);
      });
    }
    
  } catch (error) {
    console.error('Error debugging Instagram:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugInstagram();
