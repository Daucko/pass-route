import { cn } from '@/lib/utils'; // components/features/stats-grid.tsx

export function StatsGrid() {
  const stats = [
    {
      value: '1,250',
      label: 'XP Earned',
      icon: 'fa-solid fa-bolt',
      color: 'neon-glow-purple',
    },
    {
      value: '428',
      label: 'Questions Solved',
      icon: 'fa-solid fa-check-double',
      color: 'neon-glow-blue',
    },
    {
      value: '85%',
      label: 'Accuracy',
      icon: 'fa-solid fa-bullseye',
      color: 'neon-glow-green',
    },
    {
      value: '12 Days',
      label: 'Streak',
      icon: 'fa-solid fa-fire',
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
            <i className={stat.icon} />
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
