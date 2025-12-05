// components/layout/sidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

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

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-6 left-4 z-50 w-12 h-12 flex items-center justify-center glass-panel rounded-full text-white hover:text-neon-blue transition-colors shadow-lg"
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
          'fixed left-0 top-0 h-screen w-80 glass-panel rounded-none border-r border-white/10 z-40 flex flex-col justify-between p-6 overflow-y-auto transition-transform duration-300',
          // Hidden on mobile by default, shown when menu is open
          'lg:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div>
          <div className="mb-12 pl-2.5">
            <span className="logo-text text-xl font-bold">
              Deploy <i className="fa-solid fa-rocket" />
            </span>
          </div>

          <nav className="flex flex-col gap-2.5 flex-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-4 px-5 py-4 text-muted-foreground rounded-xl transition-all duration-300',
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

        <div className="glass-panel rounded-2xl p-4 border border-white/10 mt-8">
          <div className="flex items-center gap-4">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-12 h-12',
                },
              }}
            />
            <div className="flex flex-col">
              <span className="font-semibold text-sm">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-xs text-neon-purple">
                {user?.username || user?.emailAddresses?.[0]?.emailAddress}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
