// components/features/stats-grid.tsx
'use client';

import { cn } from '@/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faCheckDouble,
  faBullseye,
  faFire,
} from '@fortawesome/free-solid-svg-icons';

interface StatsGridProps {
  stats: {
    totalXP: number;
    questionsAnswered: number;
    accuracy: number;
    currentStreak: number;
  } | null;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const displayStats = [
    {
      value: stats ? stats.totalXP.toLocaleString() : '...',
      label: 'XP Earned',
      icon: faBolt,
      color: 'neon-glow-purple',
    },
    {
      value: stats ? stats.questionsAnswered.toLocaleString() : '...',
      label: 'Questions Solved',
      icon: faCheckDouble,
      color: 'neon-glow-blue',
    },
    {
      value: stats ? `${stats.accuracy}%` : '...',
      label: 'Accuracy',
      icon: faBullseye,
      color: 'neon-glow-green',
    },
    {
      value: stats ? `${stats.currentStreak} Days` : '...',
      label: 'Streak',
      icon: faFire,
      color: 'neon-glow-pink',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {displayStats.map((stat, index) => (
        <div key={index} className="glass-card flex items-center gap-5 p-4 lg:p-6">
          <div
            className={cn(
              'size-10 lg:size-12 rounded-xl bg-white/5 flex items-center justify-center text-lg lg:text-xl',
              stat.color
            )}
          >
            <FontAwesomeIcon icon={stat.icon} />
          </div>
          <div>
            <h3 className="text-lg lg:text-xl font-bold mb-1">{stat.value}</h3>
            <p className="text-muted-foreground text-xs lg:text-sm">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
