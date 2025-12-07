'use client';

import { useUser } from '@clerk/nextjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell } from '@fortawesome/free-solid-svg-icons';

interface DashboardHeaderProps {
  userName?: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const { user } = useUser();

  return (
    <header className="hidden lg:flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-0 mb-6 lg:mb-10">
      <div className="w-full lg:w-auto">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">
          Good Afternoon, {user?.firstName || userName || 'Student'}! 👋
        </h1>
        <p className="text-muted-foreground">
          Ready to crush some questions today?
        </p>
      </div>
      <div className="flex items-center gap-3 w-full lg:w-auto">
        <div className="glass-panel flex items-center gap-3 px-4 lg:px-5 py-3 rounded-full flex-1 lg:flex-none lg:w-80">
          <FontAwesomeIcon icon={faSearch} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search topics..."
            className="bg-transparent border-none outline-none text-white w-full placeholder:text-muted-foreground text-sm lg:text-base"
          />
        </div>
        <button className="glass-panel w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center border border-white/10 flex-shrink-0">
          <FontAwesomeIcon icon={faBell} />
        </button>
      </div>
    </header>
  );
}