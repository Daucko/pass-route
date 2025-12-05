// app/api/sessions/route.ts
// Save practice session and award XP

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { calculateSessionXP, getLevelFromXP, checkStreak } from '@/lib/xp-utils';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { subject, mode, questionsCount, correctCount, incorrectCount, timeSpent } = body;

        // Validate input
        if (!subject || !mode || questionsCount === undefined || correctCount === undefined || incorrectCount === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get user
        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found. Please sync your account first.' },
                { status: 404 }
            );
        }

        // Calculate XP
        const isPerfect = correctCount === questionsCount && questionsCount > 0;
        let xpEarned = calculateSessionXP(correctCount, incorrectCount, mode, isPerfect);

        // Check streak
        const streakInfo = checkStreak(user.lastActiveDate);
        if (streakInfo.shouldIncrement) {
            xpEarned += streakInfo.streakBonus;
        }

        // Calculate new totals
        const newTotalXP = user.totalXP + xpEarned;
        const newLevel = getLevelFromXP(newTotalXP);
        const leveledUp = newLevel > user.level;

        // Update streak
        let newStreak = user.currentStreak;
        if (streakInfo.shouldIncrement) {
            newStreak += 1;
        } else if (streakInfo.shouldReset) {
            newStreak = 1;
        }

        // Save session and update user in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create session
            const session = await tx.session.create({
                data: {
                    userId: user.id,
                    subject,
                    mode,
                    questionsCount,
                    correctCount,
                    incorrectCount,
                    xpEarned,
                    timeSpent: timeSpent || 0,
                },
            });

            // Update user stats
            const updatedUser = await tx.user.update({
                where: { id: user.id },
                data: {
                    totalXP: newTotalXP,
                    level: newLevel,
                    currentStreak: newStreak,
                    lastActiveDate: new Date(),
                    questionsAnswered: { increment: questionsCount },
                    correctAnswers: { increment: correctCount },
                },
            });

            return { session, user: updatedUser };
        });

        return NextResponse.json({
            session: result.session,
            xpEarned,
            leveledUp,
            newLevel,
            streakIncremented: streakInfo.shouldIncrement,
            streakBonus: streakInfo.streakBonus,
            user: {
                totalXP: result.user.totalXP,
                level: result.user.level,
                currentStreak: result.user.currentStreak,
            },
        });
    } catch (error) {
        console.error('Error saving session:', error);
        return NextResponse.json(
            { error: 'Failed to save session' },
            { status: 500 }
        );
    }
}
