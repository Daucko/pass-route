
import { POST } from '../app/api/ai/explain/route';
import { NextRequest } from 'next/server';
import { prisma } from '../lib/prisma';

async function main() {
    try {
        const question = await prisma.question.findFirst({
            select: { id: true, questionText: true, correctOption: true }
        });

        if (!question) {
            console.error("No question found in DB");
            process.exit(1);
        }

        console.log("Found question ID:", question.id);

        // Mock Request
        const req = new NextRequest('http://localhost:3000/api/ai/explain', {
            method: 'POST',
            body: JSON.stringify({
                questionId: question.id,
                questionText: question.questionText,
                correctAnswer: question.correctOption
            })
        });

        // Call Handler
        const res = await POST(req);
        const data = await res.json();

        console.log("\nResponse Status:", res.status);
        console.log("Response Body:", JSON.stringify(data, null, 2));

        if (res.status === 200 && (data.explanation || data.error)) {
            console.log("\nVerification SUCCESS");
        } else {
            console.log("\nVerification FAILED");
            process.exit(1);
        }

    } catch (e) {
        console.error("Script failed:", e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
