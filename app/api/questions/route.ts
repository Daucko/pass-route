// app/api/questions/route.ts
// API route to fetch multiple questions from database

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { transformQuestion } from '@/types/question';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        const subject = searchParams.get('subject');
        const limitParam = searchParams.get('limit');
        const year = searchParams.get('year');
        const examType = searchParams.get('examType');
        const random = searchParams.get('random') !== 'false'; // default true

        if (!subject) {
            return NextResponse.json(
                { error: 'Subject parameter is required' },
                { status: 400 }
            );
        }

        const limit = limitParam ? Math.min(parseInt(limitParam), 50) : 10;

        // Build where clause
        const where: any = {
            subject: subject.toLowerCase(),
        };

        if (year) {
            where.year = parseInt(year);
        }

        if (examType) {
            where.examType = examType.toLowerCase();
        }

        // Fetch questions
        let questions;

        if (random) {
            // Get random questions
            const totalCount = await prisma.question.count({ where });

            if (totalCount === 0) {
                return NextResponse.json({ questions: [] });
            }

            // Get random offset
            const skip = Math.max(0, Math.floor(Math.random() * (totalCount - limit)));

            questions = await prisma.question.findMany({
                where,
                take: limit,
                skip,
            });
        } else {
            // Get questions in order
            questions = await prisma.question.findMany({
                where,
                take: limit,
                orderBy: { createdAt: 'desc' },
            });
        }

        // Transform to frontend format
        const transformedQuestions = questions.map(transformQuestion);

        return NextResponse.json({
            questions: transformedQuestions,
            count: transformedQuestions.length,
        });

    } catch (error) {
        console.error('Error fetching questions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch questions' },
            { status: 500 }
        );
    }
}
