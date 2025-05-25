import { PrismaClient } from '../../generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('tt55oo77', 10);

  const user = await prisma.user.create({
    data: {
      username: 'upthouse',
      password: hashedPassword,
      email: 'upthouse@example.com',
    },
  });

  console.log('User created:', {
    id: user.id,
    username: user.username,
    email: user.email,
  });
}

main()
  .catch((e) => {
    console.error('Error creating user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
