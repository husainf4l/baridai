// fix-instagram-pageId.js
const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Updating Instagram integration...');
    
    const integration = await prisma.integration.findFirst({
      where: { name: 'INSTAGRAM' }
    });
    
    if (!integration) {
      console.log('No Instagram integration found!');
      return;
    }
    
    console.log('Found integration:', integration);
    
    // Update the integration to use instagramId as pageId
    const updated = await prisma.integration.update({
      where: { id: integration.id },
      data: {
        pageId: integration.instagramId,
        pageName: 'Instagram Page'
      }
    });
    
    console.log('Successfully updated integration:', updated);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
