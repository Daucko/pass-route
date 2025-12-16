import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { transformQuestion, DBQuestion } from '@/types/question';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const subjectsParam = searchParams.get('subjects');

        if (!subjectsParam) {
            return NextResponse.json(
                { error: 'Subjects parameter is required' },
                { status: 400 }
            );
        }

        const otherSubjects = subjectsParam.split(',');

        // Validate we have exactly 3 other subjects
        if (otherSubjects.length !== 3) {
            if (otherSubjects.length < 1) { // Basic check
                return NextResponse.json(
                    { error: 'Please select at least one other subject' },
                    { status: 400 }
                );
            }
        }

        // We need to fetch questions for each subject separately to control the count and grouping
        // English: 60 questions
        // Others: 40 questions each

        const fetchQuestionsForSubject = async (subject: string, limit: number) => {
            const where = {
                subject: subject.toLowerCase(),
            };

            const count = await prisma.question.count({ where });

            if (count === 0) return [];

            const take = Math.min(limit, count);

            // Random offset
            const skip = Math.max(0, Math.floor(Math.random() * (count - take)));

            const questions = await prisma.question.findMany({
                where,
                take: take,
                skip: skip,
            });

            return questions;
        };

        let allQuestions: DBQuestion[] = [];

        // 1. Fetch English (60)
        // Note: English is compulsory and comes first
        const englishQuestions = await fetchQuestionsForSubject('English', 60);
        allQuestions = [...englishQuestions];

        // 2. Fetch Others (40 each)
        for (const sub of otherSubjects) {
            // filter out English if selected again? UI should prevent it.
            if (sub.toLowerCase() === 'english') continue;
            const subQuestions = await fetchQuestionsForSubject(sub, 40);
            allQuestions = [...allQuestions, ...subQuestions];
        }

        const transformedQuestions = allQuestions.map(transformQuestion);

        return NextResponse.json({
            questions: transformedQuestions,
            count: transformedQuestions.length,
        });

    } catch (error) {
        console.error('Error fetching mock questions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch questions' },
            { status: 500 }
        );
    }
}
