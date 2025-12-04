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

export function StatsGrid() {
  const stats = [
    {
      value: '1,250',
      label: 'XP Earned',
      icon: faBolt,
      color: 'neon-glow-purple',
    },
    {
      value: '428',
      label: 'Questions Solved',
      icon: faCheckDouble,
      color: 'neon-glow-blue',
    },
    {
      value: '85%',
      label: 'Accuracy',
      icon: faBullseye,
      color: 'neon-glow-green',
    },
    {
      value: '12 Days',
      label: 'Streak',
      icon: faFire,
      color: 'neon-glow-pink',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="glass-card flex items-center gap-5 p-6">
          <div
            className={cn(
              'w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl',
              stat.color
            )}
          >
            <FontAwesomeIcon icon={stat.icon} />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-muted-foreground text-sm">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
