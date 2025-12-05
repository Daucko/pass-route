// app/api/user/stats/route.ts
// Get user stats (XP, level, streak, etc.)

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getXPForNextLevel } from '@/lib/xp-utils';

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
            include: {
                sessions: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Calculate level progress
        const levelInfo = getXPForNextLevel(user.totalXP);

        // Calculate accuracy
        const accuracy = user.questionsAnswered > 0
            ? Math.round((user.correctAnswers / user.questionsAnswered) * 100)
            : 0;

        return NextResponse.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                totalXP: user.totalXP,
                level: user.level,
                currentStreak: user.currentStreak,
                lastActiveDate: user.lastActiveDate,
                questionsAnswered: user.questionsAnswered,
                correctAnswers: user.correctAnswers,
                accuracy,
            },
            levelInfo,
            recentSessions: user.sessions,
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user stats' },
            { status: 500 }
        );
    }
}
