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
  faPlay,
  faChartLine,
  faPlus,
  faChartSimple,
} from '@fortawesome/free-solid-svg-icons';

const activities = [
  {
    id: 1,
    type: 'practice',
    subject: 'Mathematics',
    icon: faCalculator,
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-neon-blue',
    title: 'Algebra Practice',
    description: '15 Questions • 92% Score',
    time: '2 hours ago',
    xp: 45,
    status: 'completed',
  },
  {
    id: 2,
    type: 'exam',
    subject: 'Physics',
    icon: faAtom,
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-neon-purple',
    title: 'Mock Exam',
    description: '50 Questions • 78% Score',
    time: 'Yesterday',
    xp: 120,
    status: 'completed',
  },
  {
    id: 3,
    type: 'revision',
    subject: 'Chemistry',
    icon: faFlask,
    iconBg: 'bg-green-500/20',
    iconColor: 'text-neon-green',
    title: 'Organic Chemistry',
    description: 'Chapter 5 Revision',
    time: '2 days ago',
    xp: 30,
    status: 'completed',
  },
  {
    id: 4,
    type: 'quiz',
    subject: 'English',
    icon: faBook,
    iconBg: 'bg-pink-500/20',
    iconColor: 'text-neon-pink',
    title: 'Grammar Quiz',
    description: 'Incomplete • 8/10 questions',
    time: 'Just now',
    xp: 0,
    status: 'in-progress',
  },
];

export function RecentActivity() {
  return (
    <div className="glass-card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Recent Activity</h3>
        <button className="text-sm text-neon-blue hover:text-neon-blue/80 transition-colors duration-200">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300 hover:bg-white/5 group"
          >
            {/* Icon */}
            <div
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center text-lg',
                activity.iconBg,
                activity.iconColor
              )}
            >
              <FontAwesomeIcon icon={activity.icon} />
            </div>

            {/* Activity Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-white truncate">
                  {activity.title}
                </h4>
                {activity.status === 'in-progress' && (
                  <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium">
                    In Progress
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                {activity.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                  {activity.time}
                </span>
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faGraduationCap} className="w-3 h-3" />
                  {activity.subject}
                </span>
              </div>
            </div>

            {/* XP and Actions */}
            <div className="flex items-center gap-3">
              {activity.xp > 0 && (
                <div className="text-right">
                  <div className="text-sm font-semibold text-neon-green">
                    +{activity.xp} XP
                  </div>
                  <div className="text-xs text-muted-foreground">Earned</div>
                </div>
              )}

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {activity.status === 'completed' ? (
                  <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors duration-200">
                    <FontAwesomeIcon icon={faRotateRight} className="text-xs" />
                  </button>
                ) : (
                  <button className="w-8 h-8 rounded-lg bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/30 flex items-center justify-center transition-colors duration-200">
                    <FontAwesomeIcon
                      icon={faPlay}
                      className="text-xs text-neon-blue"
                    />
                  </button>
                )}
                <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors duration-200">
                  <FontAwesomeIcon icon={faChartLine} className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Summary */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-neon-blue mb-1">12</div>
            <div className="text-xs text-muted-foreground">Today</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neon-green mb-1">84</div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neon-purple mb-1">92%</div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neon-pink mb-1">1,250</div>
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
