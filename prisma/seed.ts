import { PrismaClient } from '@prisma/client';
import { createBuku, createUser } from './faker';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('------------ Seeding  ------------');
    await Promise.all([
      prisma.user.createMany({
        data: [...createUser(10)],
      }),
      prisma.buku.createMany({
        data: [...createBuku(10)],
      }),
    ]);
    console.log('------------ Finished -----------');
  } catch (err) {
    console.log(`+ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +`);
    console.log(`Seeding ${err}`); // - - - - - - - - - - - - - - - - - - - - - - - - - - -  +
    console.log(`+ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +`);
  } finally {
    prisma.$disconnect();
  }
}

main();
