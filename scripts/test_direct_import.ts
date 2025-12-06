
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        // Just check if we can select the fields without type error (at compile time)
        // and without runtime error.
        const q = await prisma.question.findFirst({
            select: {
                id: true,
                explanation: true,
                explanationImage: true
            }
        });
        console.log("Direct import success:", q);
    } catch (e) {
        console.error("Direct import failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
