// lib/xp-utils.ts
// Utility functions for XP calculation and level progression

export const XP_REWARDS = {
    CORRECT_ANSWER: 10,
    WRONG_ANSWER: 2,
    FIRST_TRY_BONUS: 5,
    SESSION_COMPLETE: 50,
    PERFECT_SESSION: 100,
    DAILY_STREAK_BONUS: 25,
};

export const MODE_MULTIPLIERS = {
    'Practice Mode': 1.0,
    'Timed Mode': 1.3,
    'Mock Exam': 1.5,
};

/**
 * Calculate XP earned for a session
 */
export function calculateSessionXP(
    correctCount: number,
    incorrectCount: number,
    mode: string,
    isPerfect: boolean = false
): number {
    const totalQuestions = correctCount + incorrectCount;

    // Base XP from answers
    let xp = (correctCount * XP_REWARDS.CORRECT_ANSWER) +
        (incorrectCount * XP_REWARDS.WRONG_ANSWER);

    // Session completion bonus
    xp += XP_REWARDS.SESSION_COMPLETE;

    // Perfect session bonus
    if (isPerfect && totalQuestions > 0) {
        xp += XP_REWARDS.PERFECT_SESSION;
    }

    // Apply mode multiplier
    const multiplier = MODE_MULTIPLIERS[mode as keyof typeof MODE_MULTIPLIERS] || 1.0;
    xp = Math.floor(xp * multiplier);

    return xp;
}

/**
 * Calculate level from total XP
 * Formula: XP needed for level N = 100 * (1.5 ^ (N-1))
 */
export function getLevelFromXP(totalXP: number): number {
    let level = 1;
    let xpRequired = 0;

    while (xpRequired <= totalXP) {
        xpRequired += getXPForLevel(level + 1);
        if (xpRequired <= totalXP) {
            level++;
        }
    }

    return level;
}

/**
 * Get XP required to reach a specific level
 */
export function getXPForLevel(level: number): number {
    if (level <= 1) return 0;
    return Math.floor(100 * Math.pow(1.5, level - 1));
}

/**
 * Get XP needed for next level from current XP
 */
export function getXPForNextLevel(totalXP: number): {
    currentLevel: number;
    nextLevel: number;
    xpForCurrentLevel: number;
    xpForNextLevel: number;
    xpProgress: number;
    xpNeeded: number;
    progressPercentage: number;
} {
    const currentLevel = getLevelFromXP(totalXP);
    const nextLevel = currentLevel + 1;

    // Calculate total XP needed to reach current level
    let xpForCurrentLevel = 0;
    for (let i = 2; i <= currentLevel; i++) {
        xpForCurrentLevel += getXPForLevel(i);
    }

    // Calculate total XP needed to reach next level
    const xpForNextLevel = xpForCurrentLevel + getXPForLevel(nextLevel);

    // Progress within current level
    const xpProgress = totalXP - xpForCurrentLevel;
    const xpNeeded = xpForNextLevel - totalXP;
    const progressPercentage = (xpProgress / getXPForLevel(nextLevel)) * 100;

    return {
        currentLevel,
        nextLevel,
        xpForCurrentLevel,
        xpForNextLevel,
        xpProgress,
        xpNeeded,
        progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
    };
}

/**
 * Check and update streak
 */
export function checkStreak(lastActiveDate: Date | null): {
    shouldIncrement: boolean;
    shouldReset: boolean;
    streakBonus: number;
} {
    if (!lastActiveDate) {
        return { shouldIncrement: true, shouldReset: false, streakBonus: 0 };
    }

    const now = new Date();
    const lastActive = new Date(lastActiveDate);

    // Reset time to midnight for comparison
    now.setHours(0, 0, 0, 0);
    lastActive.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
        // Same day, no change
        return { shouldIncrement: false, shouldReset: false, streakBonus: 0 };
    } else if (daysDiff === 1) {
        // Next day, increment streak
        return { shouldIncrement: true, shouldReset: false, streakBonus: XP_REWARDS.DAILY_STREAK_BONUS };
    } else {
        // Missed days, reset streak
        return { shouldIncrement: false, shouldReset: true, streakBonus: 0 };
    }
}
