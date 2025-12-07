// components/features/daily-challenge.tsx
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DailyChallengeProps {
  streak?: number;
}

export function DailyChallenge({ streak = 0 }: DailyChallengeProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  const challenge = {
    question:
      'A particle moves along a straight line with velocity given by v(t) = 3t² - 2t + 1 m/s. What is the acceleration of the particle at t = 2 seconds?',
    subject: 'Physics',
    xpReward: 100,
    timeLimit: '15:00',
    difficulty: 'Intermediate',
  };

  const handleStartChallenge = () => {
    // In a real app, this would start the challenge timer and show the question
    console.log('Starting daily challenge...');
  };

  const handleCompleteChallenge = () => {
    setIsCompleted(true);
    // In a real app, this would submit the answer and award XP
    setTimeout(() => setIsCompleted(false), 3000);
  };

  return (
    <div className="glass-card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Daily Challenge</h3>
        <div
          className={cn(
            'px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300',
            isCompleted
              ? 'bg-green-500/20 text-neon-green'
              : 'bg-yellow-500/20 text-yellow-400'
          )}
        >
          {isCompleted ? 'Completed! +100 XP' : `+${challenge.xpReward} XP`}
        </div>
      </div>

      <div className="space-y-4">
        {/* Challenge Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="bg-neon-blue/20 text-neon-blue px-2 py-1 rounded-md font-medium">
              {challenge.subject}
            </span>
            <span className="text-muted-foreground">
              {challenge.difficulty}
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <i className="fa-solid fa-clock text-sm" />
            <span>{challenge.timeLimit}</span>
          </div>
        </div>

        {/* Challenge Question Preview */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-sm leading-relaxed line-clamp-3">
            {challenge.question}
          </p>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-sm lg:text-2xl font-bold text-neon-blue mb-1">24</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-sm lg:text-2xl font-bold text-neon-green mb-1">85%</div>
            <div className="text-xs text-muted-foreground">Success Rate</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-sm lg:text-2xl font-bold text-neon-purple mb-1">{streak}</div>
            <div className="text-xs text-muted-foreground">Streak</div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={isCompleted ? undefined : handleStartChallenge}
          className={cn(
            'w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2',
            isCompleted
              ? 'bg-green-500/20 text-neon-green border border-neon-green/30 cursor-not-allowed'
              : 'bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40'
          )}
          disabled={isCompleted}
        >
          {isCompleted ? (
            <>
              <i className="fa-solid fa-check" />
              Challenge Completed!
            </>
          ) : (
            <>
              <i className="fa-solid fa-play" />
              Start Challenge
            </>
          )}
        </button>

        {/* Quick Actions */}
        {!isCompleted && (
          <div className="flex gap-2">
            <button
              onClick={handleCompleteChallenge}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2 rounded-lg text-sm transition-colors duration-200"
            >
              Mark Complete
            </button>
            <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2 rounded-lg text-sm transition-colors duration-200">
              Skip
            </button>
          </div>
        )}
      </div>

      {/* Streak Indicator */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Weekly Progress</span>
          <span className="text-neon-green font-semibold">{streak % 7}/7 days</span>
        </div>
        <div className="flex gap-1 mt-2">
          {Array(7).fill(0).map(
            (_, index) => {
              const completed = index < (streak % 7);
              return (
                <div
                  key={index}
                  className={cn(
                    'flex-1 h-2 rounded-full transition-all duration-300',
                    completed
                      ? 'bg-gradient-to-r from-neon-green to-emerald-400'
                      : 'bg-white/10'
                  )}
                />
              )
            }
          )}
        </div>
      </div>
    </div>
  );
}
