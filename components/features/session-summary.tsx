// components/features/session-summary.tsx
'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle,
    faXmarkCircle,
    faTrophy,
    faClock,
    faFire,
    faArrowUp,
} from '@fortawesome/free-solid-svg-icons';

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

export function SessionSummary({ isOpen, onClose, sessionData }: SessionSummaryProps) {
    const [showXP, setShowXP] = useState(false);
    const [displayedXP, setDisplayedXP] = useState(0);

    const accuracy = sessionData.questionsCount > 0
        ? Math.round((sessionData.correctCount / sessionData.questionsCount) * 100)
        : 0;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (isOpen) {
            // Animate XP counter
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
            <div className="glass-card max-w-2xl w-full rounded-3xl border border-white/15 shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                        <FontAwesomeIcon icon={faTrophy} className="text-4xl text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Session Complete!</h2>
                    <p className="text-muted-foreground">{sessionData.subject}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="glass-panel p-4 rounded-xl text-center">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-neon-green mb-2" />
                        <div className="text-2xl font-bold text-neon-green">{sessionData.correctCount}</div>
                        <div className="text-sm text-muted-foreground">Correct</div>
                    </div>

                    <div className="glass-panel p-4 rounded-xl text-center">
                        <FontAwesomeIcon icon={faXmarkCircle} className="text-2xl text-neon-pink mb-2" />
                        <div className="text-2xl font-bold text-neon-pink">{sessionData.incorrectCount}</div>
                        <div className="text-sm text-muted-foreground">Incorrect</div>
                    </div>

                    <div className="glass-panel p-4 rounded-xl text-center">
                        <FontAwesomeIcon icon={faClock} className="text-2xl text-neon-blue mb-2" />
                        <div className="text-2xl font-bold">{formatTime(sessionData.timeSpent)}</div>
                        <div className="text-sm text-muted-foreground">Time Spent</div>
                    </div>

                    <div className="glass-panel p-4 rounded-xl text-center">
                        <div className="text-2xl mb-2">🎯</div>
                        <div className="text-2xl font-bold">{accuracy}%</div>
                        <div className="text-sm text-muted-foreground">Accuracy</div>
                    </div>
                </div>

                {/* XP Earned */}
                <div className="bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30 rounded-2xl p-6 mb-6">
                    <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-2">XP Earned</div>
                        <div className="text-5xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                            +{displayedXP}
                        </div>
                        {sessionData.streakIncremented && sessionData.streakBonus && (
                            <div className="mt-3 flex items-center justify-center gap-2 text-neon-green">
                                <FontAwesomeIcon icon={faFire} />
                                <span className="text-sm font-semibold">
                                    Streak Bonus: +{sessionData.streakBonus} XP
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Level Up */}
                {sessionData.leveledUp && (
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-6 mb-6 animate-in slide-in-from-bottom duration-500">
                        <div className="text-center">
                            <FontAwesomeIcon icon={faArrowUp} className="text-3xl text-yellow-400 mb-2" />
                            <div className="text-2xl font-bold text-yellow-400">Level Up!</div>
                            <div className="text-lg mt-1">
                                You reached <span className="font-bold">Level {sessionData.newLevel}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="w-full py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-300"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
