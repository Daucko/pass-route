// lib/prisma.ts
// Prisma client singleton to avoid multiple instances in development

import { PrismaClient } from 'app/generated-prisma-client';
import { withAccelerate } from '@prisma/extension-accelerate';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter: {
            url: process.env.DATABASE_URL!,
        },
    }).$extends(withAccelerate());

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
