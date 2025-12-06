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

        // Calculate subject mastery
        const subjectStats: Record<string, { total: number; correct: number }> = {};

        user.sessions.forEach(session => {
            if (!subjectStats[session.subject]) {
                subjectStats[session.subject] = { total: 0, correct: 0 };
            }
            subjectStats[session.subject].total += session.questionsCount;
            subjectStats[session.subject].correct += session.correctCount;
        });

        const subjectMastery = Object.entries(subjectStats).map(([name, stats]) => ({
            name,
            progress: Math.round((stats.correct / stats.total) * 100),
            // Assign colors based on subject name or rotate
            color: getSubjectColor(name),
        }));

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
            recentSessions: user.sessions.slice(0, 10), // Return only recent 10 sessions
            subjectMastery,
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user stats' },
            { status: 500 }
        );
    }
}

function getSubjectColor(subject: string): string {
    const lower = subject.toLowerCase();
    if (lower.includes('math')) return 'neon-blue';
    if (lower.includes('english')) return 'neon-purple';
    if (lower.includes('physics')) return 'neon-green';
    if (lower.includes('chem')) return 'neon-pink';
    if (lower.includes('bio')) return 'neon-yellow';

    return 'neon-blue';
}
