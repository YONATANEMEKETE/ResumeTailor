import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const globalForPrisma = global as unknown as {
  prismaGlobal: PrismaClient;
};

const prisma =
  globalForPrisma.prismaGlobal ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prismaGlobal = prisma;

export default prisma;
