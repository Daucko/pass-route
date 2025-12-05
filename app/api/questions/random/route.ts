// app/api/questions/random/route.ts
// API route to fetch a random question

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { transformQuestion } from '@/types/question';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const subject = searchParams.get('subject');

        if (!subject) {
            return NextResponse.json(
                { error: 'Subject parameter is required' },
                { status: 400 }
            );
        }

        // Get total count for the subject
        const totalCount = await prisma.question.count({
            where: { subject: subject.toLowerCase() },
        });

        if (totalCount === 0) {
            return NextResponse.json(
                { error: 'No questions found for this subject' },
                { status: 404 }
            );
        }

        // Get a random offset
        const randomOffset = Math.floor(Math.random() * totalCount);

        // Fetch one random question
        const question = await prisma.question.findFirst({
            where: { subject: subject.toLowerCase() },
            skip: randomOffset,
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
        console.error('Error fetching random question:', error);
        return NextResponse.json(
            { error: 'Failed to fetch random question' },
            { status: 500 }
        );
    }
}
