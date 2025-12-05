// components/features/level-badge.tsx
'use client';

import { cn } from '@/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';

interface LevelBadgeProps {
    level: number;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function LevelBadge({ level, size = 'md', className }: LevelBadgeProps) {
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-sm',
        lg: 'w-16 h-16 text-lg',
    };

    return (
        <div
            className={cn(
                'relative rounded-full bg-gradient-to-br from-neon-blue to-neon-purple p-[2px]',
                className
            )}
        >
            <div
                className={cn(
                    'flex flex-col items-center justify-center rounded-full bg-dark-bg',
                    sizeClasses[size]
                )}
            >
                <FontAwesomeIcon icon={faTrophy} className="text-neon-blue text-xs mb-0.5" />
                <span className="font-bold text-white">{level}</span>
            </div>
        </div>
    );
}
