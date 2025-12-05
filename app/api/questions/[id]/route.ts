// app/api/questions/[id]/route.ts
// API route to fetch a single question by ID

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { transformQuestion } from '@/types/question';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const question = await prisma.question.findUnique({
            where: { id },
        });

        if (!question) {
            return NextResponse.json(
                { error: 'Question not found' },
                { status: 404 }
            );
        }

        const transformedQuestion = transformQuestion(question);

        return NextResponse.json({ question: transformedQuestion });

    } catch (error) {
        console.error('Error fetching question:', error);
        return NextResponse.json(
            { error: 'Failed to fetch question' },
            { status: 500 }
        );
    }
}
