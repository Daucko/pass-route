// app/dashboard/page.tsx
'use client';

import { useUser } from '@clerk/nextjs';
import { DashboardHeader } from '@/components/features/dashboard-header';
import { StatsGrid } from '@/components/features/stats-grid';
import { SubjectProgress } from '@/components/features/subject-progress';
import { DailyChallenge } from '@/components/features/daily-challenge';
import { RecentActivity } from '@/components/features/recent-activities';

export default function Dashboard() {
  const { user } = useUser();

  return (
    <>
      <DashboardHeader userName={user?.firstName || 'Student'} />

      <div className="space-y-6">
        <StatsGrid />
        <div className="grid grid-cols-2 gap-6">
          <SubjectProgress />
          <DailyChallenge />
        </div>
        <RecentActivity />
      </div>
    </>
  );
}
