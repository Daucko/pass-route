'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { DashboardHeader } from '@/components/features/dashboard-header';
import { StatsGrid } from '@/components/features/stats-grid';
import { SubjectProgress } from '@/components/features/subject-progress';
import { DailyChallenge } from '@/components/features/daily-challenge';
import { RecentActivity } from '@/components/features/recent-activities';

interface Session {
  id: string;
  subject: string;
  mode: string;
  questionsCount: number;
  correctCount: number;
  xpEarned: number;
  createdAt: string;
}

interface UserStats {
  user: {
    totalXP: number;
    questionsAnswered: number;
    accuracy: number;
    currentStreak: number;
    level: number;
    correctAnswers: number;
  };
  levelInfo: {
    currentLevel: number;
    currentXP: number;
    nextLevelXP: number;
    progress: number;
  };
  recentSessions: Session[];
  subjectMastery: Array<{
    name: string;
    progress: number;
    color: string;
  }>;
}

export default function Dashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/user/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }

    fetchStats();
  }, []);

  return (
    <>
      <DashboardHeader userName={user?.firstName || 'Student'} />
      <div className="space-y-6">
        <StatsGrid stats={stats ? stats.user : null} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SubjectProgress subjects={stats ? stats.subjectMastery : []} />
          <DailyChallenge streak={stats ? stats.user.currentStreak : 0} />
        </div>
        <RecentActivity
          activities={stats ? stats.recentSessions : []}
          stats={stats ? stats.user : null}
        />
      </div>
    </>
  );
}