// components/features/session-summary.tsx
'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faFire, faArrowUp } from '@fortawesome/free-solid-svg-icons';

interface SessionSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  sessionData: {
    subject: string;
    questionsCount: number;
    correctCount: number;
    incorrectCount: number;
    timeSpent: number;
    xpEarned: number;
    leveledUp: boolean;
    newLevel?: number;
    streakIncremented: boolean;
    streakBonus?: number;
  };
}

export function SessionSummary({
  isOpen,
  onClose,
  sessionData,
}: SessionSummaryProps) {
  const [showXP, setShowXP] = useState(false);
  const [displayedXP, setDisplayedXP] = useState(0);

  const accuracy =
    sessionData.questionsCount > 0
      ? Math.round(
          (sessionData.correctCount / sessionData.questionsCount) * 100
        )
      : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowXP(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowXP(false);
      setDisplayedXP(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (showXP && displayedXP < sessionData.xpEarned) {
      const increment = Math.ceil(sessionData.xpEarned / 30);
      const timer = setTimeout(() => {
        setDisplayedXP(Math.min(displayedXP + increment, sessionData.xpEarned));
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [showXP, displayedXP, sessionData.xpEarned]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-[#0A0A0F] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faTrophy}
                  className="text-xl text-white"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold">Session Complete!</h2>
                <p className="text-sm text-muted-foreground">
                  {sessionData.subject}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                +{displayedXP}
              </div>
              <div className="text-xs text-muted-foreground">XP</div>
            </div>
          </div>
        </div>

        {/* Stats - Compact */}
        <div className="p-6">
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-neon-green">
                {sessionData.correctCount}
              </div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-neon-pink">
                {sessionData.incorrectCount}
              </div>
              <div className="text-xs text-muted-foreground">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{accuracy}%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">
                {formatTime(sessionData.timeSpent)}
              </div>
              <div className="text-xs text-muted-foreground">Time</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold">{accuracy}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-neon-blue to-neon-purple transition-all duration-1000"
                style={{ width: `${accuracy}%` }}
              />
            </div>
          </div>

          {/* Streak Bonus */}
          {sessionData.streakIncremented && sessionData.streakBonus && (
            <div className="flex items-center justify-center gap-2 mb-4 p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl">
              <FontAwesomeIcon icon={faFire} className="text-amber-400" />
              <span className="text-sm font-semibold text-amber-300">
                Streak Bonus: +{sessionData.streakBonus} XP
              </span>
            </div>
          )}

          {/* Level Up */}
          {sessionData.leveledUp && (
            <div className="flex items-center justify-center gap-3 mb-6 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
              <FontAwesomeIcon
                icon={faArrowUp}
                className="text-yellow-400 text-xl"
              />
              <div>
                <div className="font-bold text-yellow-300">Level Up!</div>
                <div className="text-sm text-yellow-400/80">
                  Reached Level {sessionData.newLevel}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-300"
          >
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  );
}
