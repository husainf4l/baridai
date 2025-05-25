// Simple script to create a user in the database
const bcrypt = require('bcrypt');
const { PrismaClient } = require('../../generated/prisma');

const prisma = new PrismaClient();

async function createUser() {
  try {
    const hashedPassword = await bcrypt.hash('tt55oo77', 10);

    const user = await prisma.user.create({
      data: {
        username: 'upthouse',
        password: hashedPassword,
        email: 'upthouse@example.com',
      },
    });

    console.log('User created successfully:', {
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();
