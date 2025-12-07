// components/features/recent-activity.tsx
'use client';

import { cn } from '@/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalculator,
  faAtom,
  faFlask,
  faBook,
  faClock,
  faGraduationCap,
  faRotateRight,
  faChartLine,
  faPlus,
  faChartSimple,
} from '@fortawesome/free-solid-svg-icons';

import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  subject: string;
  mode: string;
  questionsCount: number;
  correctCount: number;
  xpEarned: number;
  createdAt: string;
}

interface RecentActivityProps {
  activities: Activity[];
  stats: {
    questionsAnswered: number; // using this for "Today" stat as a placeholder or real daily count if available
    correctAnswers: number;
    accuracy: number;
    totalXP: number;
  } | null;
}

export function RecentActivity({ activities, stats }: RecentActivityProps) {
  // Helper to determine icon and color based on subject/type
  const getActivityIcon = (subject: string) => {
    const lower = subject.toLowerCase();
    if (lower.includes('math')) return { icon: faCalculator, bg: 'bg-blue-500/20', color: 'text-neon-blue' };
    if (lower.includes('physics')) return { icon: faAtom, bg: 'bg-green-500/20', color: 'text-neon-green' };
    if (lower.includes('chem')) return { icon: faFlask, bg: 'bg-pink-500/20', color: 'text-neon-pink' };
    if (lower.includes('english')) return { icon: faBook, bg: 'bg-purple-500/20', color: 'text-neon-purple' };
    return { icon: faGraduationCap, bg: 'bg-gray-500/20', color: 'text-gray-400' };
  };

  return (
    <div className="glass-card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Recent Activity</h3>
        <button className="text-sm text-neon-blue hover:text-neon-blue/80 transition-colors duration-200">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No recent activity. Start practicing!
          </div>
        ) : (
          activities.map((activity) => {
            const style = getActivityIcon(activity.subject);
            return (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300 hover:bg-white/5 group"
              >
                {/* Icon */}
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center text-lg',
                    style.bg,
                    style.color
                  )}
                >
                  <FontAwesomeIcon icon={style.icon} />
                </div>

                {/* Activity Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white truncate">
                      {activity.mode === 'practice' ? 'Practice Session' : 'Mock Exam'}
                    </h4>
                    {/* Status logic if needed, currently assuming completed for history */}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {activity.questionsCount} Questions • {Math.round((activity.correctCount / activity.questionsCount) * 100)}% Score
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </span>
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faGraduationCap} className="w-3 h-3" />
                      {activity.subject}
                    </span>
                  </div>
                </div>

                {/* XP and Actions */}
                <div className="flex flex-col lg:flex-row items-center gap-3">
                  {activity.xpEarned > 0 && (
                    <div className="text-right">
                      <div className="text-sm font-semibold text-neon-green">
                        +{activity.xpEarned} XP
                      </div>
                      <div className="text-xs text-muted-foreground">Earned</div>
                    </div>
                  )}

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors duration-200">
                      <FontAwesomeIcon icon={faRotateRight} className="text-xs" />
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors duration-200">
                      <FontAwesomeIcon icon={faChartLine} className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Activity Summary */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-neon-blue mb-1">
              {stats ? stats.questionsAnswered : '...'}
            </div>
            <div className="text-xs text-muted-foreground">Total Questions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neon-green mb-1">
              {stats ? stats.correctAnswers : '...'}
            </div>
            <div className="text-xs text-muted-foreground">Correct</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neon-purple mb-1">
              {stats ? `${stats.accuracy}%` : '...'}
            </div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neon-pink mb-1">
              {stats ? stats.totalXP.toLocaleString() : '...'}
            </div>
            <div className="text-xs text-muted-foreground">Total XP</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex gap-3">
        <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faPlus} />
          New Session
        </button>
        <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faChartSimple} />
          View Analytics
        </button>
      </div>
    </div>
  );
}
