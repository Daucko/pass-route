
import { prisma } from '../lib/prisma';

async function main() {
    try {
        const question = await prisma.question.findFirst({
            select: { id: true, questionText: true, correctOption: true }
        });
        if (question) {
            console.log(JSON.stringify(question));
        } else {
            console.error("No questions found");
            process.exit(1);
        }
    } catch (error) {
        console.error(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
