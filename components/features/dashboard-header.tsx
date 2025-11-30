// components/features/dashboard-header.tsx
'use client';

import { useUser } from '@clerk/nextjs';

interface DashboardHeaderProps {
  userName?: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const { user } = useUser();

  return (
    <header className="flex justify-between items-center mb-10">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Good Afternoon, {user?.firstName || userName || 'Student'}! 👋
        </h1>
        <p className="text-muted-foreground">
          Ready to crush some questions today?
        </p>
      </div>
      <div className="flex items-center gap-5">
        <div className="glass-panel flex items-center gap-3 px-5 py-3 rounded-full w-80">
          <i className="fa-solid fa-search text-muted-foreground" />
          <input
            type="text"
            placeholder="Search topics..."
            className="bg-transparent border-none outline-none text-white w-full placeholder:text-muted-foreground"
          />
        </div>
        <button className="glass-panel w-12 h-12 rounded-full flex items-center justify-center border border-white/10">
          <i className="fa-solid fa-bell" />
        </button>
      </div>
    </header>
  );
}
