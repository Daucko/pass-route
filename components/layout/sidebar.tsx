// components/layout/sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/', icon: 'fa-solid fa-home' },
  { name: 'Dashboard', href: '/dashboard', icon: 'fa-solid fa-chart-pie' },
  { name: 'Practice', href: 'dashboard/practice', icon: 'fa-solid fa-book' },
  {
    name: 'Leaderboard',
    href: 'dashboard/leaderboard',
    icon: 'fa-solid fa-trophy',
  },
  { name: 'Settings', href: 'dashboard/settings', icon: 'fa-solid fa-gear' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside className="fixed left-0 top-0 h-screen w-80 glass-panel rounded-none border-r border-white/10 z-40 flex flex-col justify-between p-6 overflow-y-auto">
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
  );
}
