// simple-debug.js
const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

async function main() {
  try {
    // Get all DMs
    console.log('Fetching all DMs...');
    const dms = await prisma.dms.findMany();
    console.log(`Total DMs: ${dms.length}`);
    console.log(JSON.stringify(dms, null, 2));
    
    // Get all automations
    console.log('\nFetching all automations...');
    const automations = await prisma.automation.findMany();
    console.log(`Total automations: ${automations.length}`);
    console.log(JSON.stringify(automations, null, 2));
    
    // Get all integrations
    console.log('\nFetching all integrations...');
    const integrations = await prisma.integration.findMany();
    console.log(`Total integrations: ${integrations.length}`);
    console.log(JSON.stringify(integrations, null, 2));
    
    // Get all users
    console.log('\nFetching all users...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true
      }
    });
    console.log(`Total users: ${users.length}`);
    console.log(JSON.stringify(users, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
