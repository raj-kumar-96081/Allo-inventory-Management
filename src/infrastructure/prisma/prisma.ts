// import { PrismaClient } from '@prisma/client';
// import { PrismaClient } from '@/generated/prisma';
import { PrismaClient } from '../../generated/prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const accelerateUrl = process.env.PRISMA_ACCELERATE_URL;
if (!accelerateUrl) throw new Error('Missing PRISMA_ACCELERATE_URL');

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ['query', 'error', 'warn'],
        accelerateUrl,
    });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}