import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { questionId, questionText, correctAnswer } = body;

        if (!questionId) {
            return NextResponse.json(
                { error: 'Question ID is required' },
                { status: 400 }
            );
        }

        // 1. Check if explanation already exists (Cache Hit)
        const existingQuestion = await prisma.question.findUnique({
            where: { id: questionId },
            select: { explanation: true },
        });

        if (existingQuestion?.explanation) {
            return NextResponse.json({ explanation: existingQuestion.explanation });
        }

        // 2. Mock AI Generation (Simulate Latency)
        // In a real app, you would call OpenAI/Gemini here
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const mockExplanation = `
      The correct answer is **${correctAnswer.toUpperCase()}**.
      <br/><br/>
      **Why?**
      <br/>
      In this context, the principle applies directly to the scenario described. When analyzing the options, we can see that Option ${correctAnswer.toUpperCase()} aligns perfectly with the established rules of the subject.
      <br/><br/>
      **Key Concept:**
      <br/>
      Always remember to check for the fundamental properties before ruling out an option. This is a classic example often tested in exams.
    `;

        // 3. Save to Database (Cache for next user)
        await prisma.question.update({
            where: { id: questionId },
            data: { explanation: mockExplanation },
        });

        return NextResponse.json({ explanation: mockExplanation });
    } catch (error) {
        console.error('Error generating explanation:', error);
        return NextResponse.json(
            { error: 'Failed to generate explanation' },
            { status: 500 }
        );
    }
}
