'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { LevelBadge } from '@/components/features/level-badge';
import { XPProgressBar } from '@/components/features/xp-progress-bar';

const navigation = [
  { name: 'Home', href: '/', icon: 'fa-solid fa-home' },
  { name: 'Dashboard', href: '/dashboard', icon: 'fa-solid fa-chart-pie' },
  { name: 'Practice', href: '/dashboard/practice', icon: 'fa-solid fa-book' },
  {
    name: 'Leaderboard',
    href: '/dashboard/leaderboard',
    icon: 'fa-solid fa-trophy',
  },
  { name: 'Settings', href: '/dashboard/settings', icon: 'fa-solid fa-gear' },
];

interface UserStats {
  user: {
    totalXP: number;
  };
  levelInfo: {
    currentLevel: number;
    nextLevel: number;
    xpForCurrentLevel: number;
    xpForNextLevel: number;
    xpNeeded: number;
  };
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (isSignedIn) {
        try {
          const response = await fetch('/api/user/stats');
          if (response.ok) {
            const data = await response.json();
            setUserStats(data);
          }
        } catch (error) {
          console.error('Failed to fetch user stats:', error);
        }
      }
    };

    fetchUserStats();
  }, [isSignedIn]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector('aside');
      const hamburger = document.querySelector('button[aria-label="Toggle sidebar"]');

      if (mobileMenuOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        hamburger &&
        !hamburger.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 text-white hover:text-neon-blue transition-colors bg-black/20 backdrop-blur-sm rounded-lg"
        aria-label="Toggle sidebar"
      >
        <FontAwesomeIcon
          icon={mobileMenuOpen ? faTimes : faBars}
          className="text-xl"
        />
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 lg:w-80 glass-panel rounded-none border-r border-white/10 z-40 flex flex-col justify-between p-4 lg:p-6 overflow-y-auto transition-transform duration-300',
          // Hidden on mobile by default, shown when menu is open
          'lg:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div>
          <div className="mb-8 lg:mb-12 pl-2.5">
            <span className="logo-text text-lg lg:text-xl font-bold">
              Deploy <i className="fa-solid fa-rocket" />
            </span>
          </div>

          <nav className="flex flex-col gap-2 flex-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 lg:px-5 py-3 text-muted-foreground rounded-xl transition-all duration-300 text-sm lg:text-base',
                    isActive
                      ? 'bg-white/5 text-white border-l-4 border-neon-blue'
                      : 'hover:bg-white/5 hover:text-white'
                  )}
                >
                  <i className={item.icon} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* XP Progress Section */}
        {userStats && (
          <div className="glass-panel rounded-2xl p-3 lg:p-4 border border-white/10 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="hidden lg:block">
                <LevelBadge level={userStats.levelInfo.currentLevel} size="md" />
              </div>
              <div className="lg:hidden">
                <LevelBadge level={userStats.levelInfo.currentLevel} size="sm" />
              </div>
              <div>
                <div className="text-xs lg:text-sm font-semibold">Level {userStats.levelInfo.currentLevel}</div>
                <div className="text-xs text-muted-foreground">
                  {userStats.user.totalXP} XP
                </div>
              </div>
            </div>
            <XPProgressBar
              currentXP={userStats.user.totalXP}
              xpForCurrentLevel={userStats.levelInfo.xpForCurrentLevel}
              xpForNextLevel={userStats.levelInfo.xpForNextLevel}
              currentLevel={userStats.levelInfo.currentLevel}
              nextLevel={userStats.levelInfo.nextLevel}
              showLabel={false}
              className="h-1.5 lg:h-2"
            />
            <div className="mt-2 text-xs text-muted-foreground text-center">
              {userStats.levelInfo.xpNeeded} XP to Level {userStats.levelInfo.nextLevel}
            </div>
          </div>
        )}

        <div className="glass-panel rounded-2xl p-3 lg:p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10 lg:w-12 lg:h-12',
                },
              }}
            />
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-semibold text-sm truncate">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-xs text-neon-purple truncate">
                {user?.username || user?.emailAddresses?.[0]?.emailAddress}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}