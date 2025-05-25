// check-dms.js
const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

async function main() {
  try {
    const dms = await prisma.dms.findMany();
    console.log('Total DMs in database:', dms.length);
    console.log(JSON.stringify(dms, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
