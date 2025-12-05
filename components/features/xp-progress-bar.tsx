// components/features/xp-progress-bar.tsx
'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface XPProgressBarProps {
    currentXP: number;
    xpForCurrentLevel: number;
    xpForNextLevel: number;
    currentLevel: number;
    nextLevel: number;
    className?: string;
    showLabel?: boolean;
}

export function XPProgressBar({
    currentXP,
    xpForCurrentLevel,
    xpForNextLevel,
    currentLevel,
    nextLevel,
    className,
    showLabel = true,
}: XPProgressBarProps) {
    const [progress, setProgress] = useState(0);

    const xpInCurrentLevel = currentXP - xpForCurrentLevel;
    const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
    const progressPercentage = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForLevel) * 100));

    useEffect(() => {
        // Animate progress bar
        const timer = setTimeout(() => {
            setProgress(progressPercentage);
        }, 100);
        return () => clearTimeout(timer);
    }, [progressPercentage]);

    return (
        <div className={cn('w-full', className)}>
            {showLabel && (
                <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-muted-foreground">
                        Level {currentLevel}
                    </span>
                    <span className="text-muted-foreground">
                        {xpInCurrentLevel} / {xpNeededForLevel} XP
                    </span>
                </div>
            )}

            <div className="relative h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
            </div>

            {showLabel && (
                <div className="mt-1 text-xs text-muted-foreground text-right">
                    {Math.round(progressPercentage)}% to Level {nextLevel}
                </div>
            )}
        </div>
    );
}
