// get-instagram-integration.js
const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

async function main() {
  try {
    const integration = await prisma.integration.findFirst({
      where: {
        name: 'INSTAGRAM',
      },
    });
    
    console.log(JSON.stringify(integration, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
