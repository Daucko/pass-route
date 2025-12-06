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
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, { selected: string; correct: boolean }>>({});
  const [showSummary, setShowSummary] = useState(false);
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  useEffect(() => {
    if (selectedSubject && isActive) {
      setIsLoading(true);

      // Fetch questions from local API
      fetch(`/api/questions?subject=${selectedSubject.toLowerCase()}&limit=20&random=true`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch questions');
          }
          return response.json();
        })
        .then(data => {
          setQuestions(data.questions || []);
          setCurrentQuestionIndex(0);
          setSelectedOption(null);
          setExplanation(null); // Reset explanation
          setTime(0);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching questions:', error);
          setQuestions([]);
          setIsLoading(false);
        });
    }
  }, [selectedSubject, isActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // Reset explanation when changing questions
  useEffect(() => {
    setExplanation(null);
    setIsExplaining(false);

    // If we have a cached explanation for this question, use it immediately
    if (currentQuestion?.explanation) {
      // We only show it if the user has answered, handled in UI check or setting state here if answered
      // But typically we wait for answer.
    }
  }, [currentQuestionIndex, currentQuestion]);

  // Restore explanation if revisiting a question we already answered
  useEffect(() => {
    if (answers[currentQuestionIndex]) {
      // If we've answered, we should try to show explanation if available
      if (currentQuestion?.explanation) {
        setExplanation(currentQuestion.explanation);
      } else {
        // If not in question object (revisited), we might need to fetch again, 
        // OR better: we fetch it properly below. 
        // For now, let's assume if it wasn't in the initial fetch, we fetch on answer.
      }
    }
  }, [currentQuestionIndex, answers, currentQuestion]);


  const handleOptionSelect = async (optionId: string) => {
    if (answers[currentQuestionIndex]) return; // Already answered

    setSelectedOption(optionId);
    const isCorrect = currentQuestion.options.find(opt => opt.id === optionId)?.correct || false;

    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: { selected: optionId, correct: isCorrect },
    }));

    // Fetch Explanation
    if (currentQuestion.explanation) {
      setExplanation(currentQuestion.explanation);
    } else {
      setIsExplaining(true);
      try {
        const response = await fetch('/api/ai/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionId: currentQuestion.id,
            questionText: currentQuestion.text,
            options: currentQuestion.options,
            correctAnswer: currentQuestion.options.find(o => o.correct)?.id || 'unknown'
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setExplanation(data.explanation);
          // Also update the local question object so we don't fetch again if they revisit
          currentQuestion.explanation = data.explanation;
        }
      } catch (error) {
        console.error('Error fetching explanation:', error);
      } finally {
        setIsExplaining(false);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      const prevAnswer = answers[currentQuestionIndex - 1];
      setSelectedOption(prevAnswer?.selected || null);
    }
  };

  const handleEndSession = async () => {
    const correctCount = Object.values(answers).filter(a => a.correct).length;
    const incorrectCount = Object.values(answers).filter(a => !a.correct).length;

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          mode: 'Practice Mode',
          questionsCount: Object.keys(answers).length,
          correctCount,
          incorrectCount,
          timeSpent: time,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSessionResult({
          subject: selectedSubject!,
          questionsCount: Object.keys(answers).length,
          correctCount,
          incorrectCount,
          timeSpent: time,
          xpEarned: data.xpEarned,
          leveledUp: data.leveledUp,
          newLevel: data.newLevel,
          streakIncremented: data.streakIncremented,
          streakBonus: data.streakBonus,
        });
        setShowSummary(true);
      } else {
        console.error('Failed to save session');
        onEndSession();
      }
    } catch (error) {
      console.error('Error saving session:', error);
      onEndSession();
    }
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
    setSessionResult(null);
    setAnswers({});
    onEndSession();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const getSubjectIcon = () => {
    return selectedSubject
      ? subjectIcons[selectedSubject as keyof typeof subjectIcons]
      : faBook;
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-4xl w-full rounded-3xl border border-white/15 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header - Fixed height */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
              <FontAwesomeIcon
                icon={getSubjectIcon()}
                className="text-2xl text-neon-blue"
              />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="bg-neon-blue/20 text-neon-blue px-3 py-1 rounded-full text-sm font-medium">
                  {selectedSubject || 'Subject'}
                </span>
                <span className="text-muted-foreground text-sm">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
              </div>
              <h3 className="text-xl font-semibold mt-2">Practice Session</h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
              <FontAwesomeIcon icon={faClock} className="text-neon-blue" />
              <span className="font-semibold">{formatTime(time)}</span>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Question Content - Scrollable area */}
        <div className="p-6 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 border-4 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin mb-4"></div>
              <p className="text-muted-foreground">Loading Questions...</p>
            </div>
          ) : currentQuestion ? (
            <>
              <p
                className="text-xl mb-8 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: currentQuestion.text }}
              />

              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    className={cn(
                      'w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4',
                      selectedOption === option.id
                        ? option.correct
                          ? 'bg-green-500/20 border-neon-green shadow-[0_0_15px_rgba(0,255,148,0.3)]'
                          : 'bg-red-500/20 border-neon-pink shadow-[0_0_15px_rgba(255,0,85,0.3)]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    )}
                  >
                    <span
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center font-semibold',
                        selectedOption === option.id
                          ? option.correct
                            ? 'bg-neon-green text-black'
                            : 'bg-neon-pink text-white'
                          : 'bg-white/10 text-white'
                      )}
                    >
                      {option.id.toUpperCase()}
                    </span>
                    <span
                      className="flex-1"
                      dangerouslySetInnerHTML={{ __html: option.text }}
                    />
                    {selectedOption === option.id && option.correct && (
                      <span className="text-neon-green font-bold flex items-center gap-2">
                        <FontAwesomeIcon icon={faCheck} /> Correct!
                      </span>
                    )}
                    {selectedOption === option.id && !option.correct && (
                      <span className="text-neon-pink font-bold flex items-center gap-2">
                        <FontAwesomeIcon icon={faXmark} /> Incorrect
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Explanation Section */}
              {(explanation || isExplaining) && (
                <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <FontAwesomeIcon icon={faBook} className="text-blue-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-blue-100">Why is this correct?</h4>
                    {isExplaining && (
                      <span className="text-xs text-blue-300 animate-pulse ml-auto">Generating explanation...</span>
                    )}
                  </div>

                  {isExplaining ? (
                    <div className="space-y-2">
                      <div className="h-4 bg-blue-400/10 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-blue-400/10 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-blue-400/10 rounded w-5/6 animate-pulse"></div>
                    </div>
                  ) : (
                    <div
                      className="text-blue-100/90 leading-relaxed text-sm"
                      dangerouslySetInnerHTML={{ __html: explanation || '' }}
                    />
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">

              <p className="text-muted-foreground">
                No questions available for this subject.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions - Fixed height */}
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
      </div>

      {/* Session Summary Modal */}
      {showSummary && sessionResult && (
        <SessionSummary
          isOpen={showSummary}
          onClose={handleCloseSummary}
          sessionData={sessionResult}
        />
      )}
    </div>
  );
}
