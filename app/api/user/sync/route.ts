// app/api/user/sync/route.ts
// Sync Clerk user with database User model

import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(_request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const clerkUser = await currentUser();

        if (!clerkUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Check if user exists in database
        let user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            // Create new user
            user = await prisma.user.create({
                data: {
                    clerkId: userId,
                    email: clerkUser.emailAddresses[0]?.emailAddress || '',
                    username: clerkUser.username || clerkUser.firstName || null,
                },
            });
        } else {
            // Update existing user
            user = await prisma.user.update({
                where: { clerkId: userId },
                data: {
                    email: clerkUser.emailAddresses[0]?.emailAddress || user.email,
                    username: clerkUser.username || clerkUser.firstName || user.username,
                },
            });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Error syncing user:', error);
        return NextResponse.json(
            { error: 'Failed to sync user' },
            { status: 500 }
        );
    }
}
