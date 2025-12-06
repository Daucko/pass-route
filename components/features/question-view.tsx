// components/practice/question-view.tsx
'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faArrowLeft,
  faArrowRight,
  faCalculator,
  faBook,
  faAtom,
  faFlask,
  faCheck,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { SessionSummary } from './session-summary';

interface Question {
  id: number;
  subject: string;
  text: string;
  options: { id: string; text: string; correct: boolean }[];
}

interface QuestionViewProps {
  selectedSubject: string | null;
  isActive: boolean;
  onEndSession: () => void;
  onClose: () => void;
}

interface SessionResult {
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
}

// Sample questions removed - now fetching from API

const subjectIcons = {
  Mathematics: faCalculator,
  English: faBook,
  Physics: faAtom,
  Chemistry: faFlask,
};

export function QuestionView({
  selectedSubject,
  isActive,
  onEndSession,
  onClose,
}: QuestionViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [time, setTime] = useState(0);

  {/* Footer Actions - Fixed height */ }
  <div className="p-6 border-t border-white/10 flex justify-between items-center shrink-0">
    <button
      onClick={handleEndSession}
      className="px-6 py-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-full font-semibold transition-colors duration-200"
    >
      End Session
    </button>

    <div className="flex items-center gap-4">
      <button
        onClick={handlePreviousQuestion}
        disabled={currentQuestionIndex === 0 || isLoading}
        className={cn(
          'px-6 py-3 rounded-full font-semibold transition-colors duration-200 flex items-center gap-2',
          currentQuestionIndex === 0 || isLoading
            ? 'bg-white/5 text-muted-foreground cursor-not-allowed'
            : 'bg-white/5 hover:bg-white/10 text-white'
        )}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Previous
      </button>

      <button
        onClick={handleNextQuestion}
        disabled={
          currentQuestionIndex === totalQuestions - 1 || isLoading
        }
        className={cn(
          'px-6 py-3 rounded-full font-semibold transition-colors duration-200 flex items-center gap-2',
          currentQuestionIndex === totalQuestions - 1 || isLoading
            ? 'bg-neon-blue/50 text-white/50 cursor-not-allowed'
            : 'bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:shadow-lg hover:shadow-purple-500/40'
        )}
      >
        Next
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </div>
  </div>
      </div >

    {/* Session Summary Modal */ }
  {
    showSummary && sessionResult && (
      <SessionSummary
        isOpen={showSummary}
        onClose={handleCloseSummary}
        sessionData={sessionResult}
      />
    )
  }
    </div >
  );
}
