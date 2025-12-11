'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faTimes,
  faSearch,
  faBell,
  faChartPie,
  faBook,
  faTrophy,
  faGear,
  faHome,
} from '@fortawesome/free-solid-svg-icons';
import { LevelBadge } from '@/components/features/level-badge';
import { XPProgressBar } from '@/components/features/xp-progress-bar';
import Image from 'next/image';

const menuNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: faChartPie },
  { name: 'Practice', href: '/dashboard/practice', icon: faBook },
  { name: 'Leaderboard', href: '/dashboard/leaderboard', icon: faTrophy },
];

const generalNavigation = [
  { name: 'Settings', href: '/dashboard/settings', icon: faGear },
  { name: 'Home', href: '/', icon: faHome },
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
      const hamburger = document.querySelector(
        'button[aria-label="Toggle sidebar"]'
      );

      if (
        mobileMenuOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        hamburger &&
        !hamburger.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Mobile Header with all three elements in one line */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white hover:text-neon-blue transition-colors rounded-lg"
            aria-label="Toggle sidebar"
          >
            <FontAwesomeIcon
              icon={mobileMenuOpen ? faTimes : faBars}
              className="text-xl"
            />
          </button>

          {/* Search Bar - Takes available space */}
          <div className="glass-panel flex items-center gap-3 px-4 py-2 rounded-full flex-1">
            <FontAwesomeIcon
              icon={faSearch}
              className="text-muted-foreground text-sm"
            />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-white w-full placeholder:text-muted-foreground text-sm"
            />
          </div>

          {/* Notification Bell */}
          <button className="glass-panel w-10 h-10 rounded-full flex items-center justify-center border border-white/10 flex-shrink-0">
            <FontAwesomeIcon icon={faBell} className="text-sm" />
          </button>
        </div>
      </div>

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
          mobileMenuOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col flex-1">
          <div className="mb-6 lg:mb-8 pl-2.5">
            <Image
              src="/pass-route-logo.png"
              alt="logo"
              width={170}
              height={150}
              className="object-contain max-w-[80px] md:max-w-[120px] lg:max-w-[170px]"
            />
          </div>

          <nav className="flex flex-col gap-6 flex-1">
            {/* MENU Section */}
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                Menu
              </div>
              <div className="flex flex-col gap-2">
                {menuNavigation.map((item) => {
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
                      <FontAwesomeIcon
                        icon={item.icon}
                        className="w-4 h-4 lg:w-5 lg:h-5"
                      />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* GENERAL Section */}
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                General
              </div>
              <div className="flex flex-col gap-2">
                {generalNavigation.map((item) => {
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
                      <FontAwesomeIcon
                        icon={item.icon}
                        className="w-4 h-4 lg:w-5 lg:h-5"
                      />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>

        <div>
          {/* XP Progress Section */}
          {userStats && (
            <div className="glass-panel rounded-2xl p-3 lg:p-4 border border-white/10 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="hidden lg:block">
                  <LevelBadge
                    level={userStats.levelInfo.currentLevel}
                    size="md"
                  />
                </div>
                <div className="lg:hidden">
                  <LevelBadge
                    level={userStats.levelInfo.currentLevel}
                    size="sm"
                  />
                </div>
                <div>
                  <div className="text-xs lg:text-sm font-semibold">
                    Level {userStats.levelInfo.currentLevel}
                  </div>
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
                {userStats.levelInfo.xpNeeded} XP to Level{' '}
                {userStats.levelInfo.nextLevel}
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
        </div>
      </aside>
    </>
  );
}
