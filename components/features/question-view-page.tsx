'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import DOMPurify from 'isomorphic-dompurify';
import { Calculator } from '@/components/ui/calculator';

interface Question {
  id: number;
  subject: string;
  text: string;
  options: { id: string; text: string; correct: boolean }[];
  explanation?: string;
  keyConcepts?: string[];
  commonMistakes?: string[];
  explanationImage?: string;
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

const subjectIcons = {
  Mathematics: faCalculator,
  English: faBook,
  Physics: faAtom,
  Chemistry: faFlask,
  Biology: faFlask,
  Commerce: faBook,
  Accounting: faCalculator,
  Economics: faCalculator,
  Government: faBook,
};

interface QuestionViewPageProps {
  subject?: string;
  mode?: 'practice' | 'mock';
  subjects?: string[]; // For mock mode
}

export function QuestionViewPage({ subject, mode = 'practice', subjects = [] }: QuestionViewPageProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<
    Record<number, { selected: string; correct: boolean }>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [time, setTime] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(
    null
  );
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explainError, setExplainError] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (questions.length > 0) {
      interval = setInterval(() => {
        if (mode === 'mock') {
          setTime((prev) => {
            if (prev >= 7200) { // 2 hours limit (7200 seconds)
              clearInterval(interval);
              handleEndSession(); // Auto-submit
              return prev;
            }
            return prev + 1;
          });
        } else {
          setTime((prev) => prev + 1);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [questions.length, mode]);

  // Fetch Questions
  useEffect(() => {
    async function fetchQuestions() {
      setIsLoading(true);
      try {
        let url = `/api/questions?subject=${encodeURIComponent(subject || '')}&limit=10`;

        if (mode === 'mock') {
          // subjects includes other 3 subjects. English is auto-included by API if we just pass these 3?
          // API expects `subjects` param with comma separated list of the 3 subjects.
          url = `/api/questions/mock?subjects=${encodeURIComponent(subjects.join(','))}`;
        }

        const res = await fetch(url);
        if (!res.ok)
          throw new Error(`Failed to fetch questions (${res.status})`);
        const data = await res.json();
        if (data.questions) {
          setQuestions(data.questions);
          setCurrentQuestionIndex(0);
          setAnswers({});
          setSelectedOption(null);
          setExplanation(null);
          setExplainError(null);
          setIsExplaining(false);
          setTime(0);
        } else {
          throw new Error('No questions in response');
        }
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuestions();
  }, [subject, mode, subjects]);

  // Reset explanation when changing questions
  useEffect(() => {
    setExplanation(null);
    setExplainError(null);
    setIsExplaining(false);
  }, [currentQuestionIndex]);

  const handleOptionSelect = async (optionId: string) => {
    if (answers[currentQuestionIndex]) return;

    setSelectedOption(optionId);
    const isCorrect =
      questions[currentQuestionIndex].options.find((opt) => opt.id === optionId)
        ?.correct || false;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: { selected: optionId, correct: isCorrect },
    }));

    // Fetch Explanation
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.explanation) {
      setExplanation(currentQuestion.explanation);
    } else {
      setIsExplaining(true);
      setExplainError(null);
      try {
        const response = await fetch('/api/ai/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionId: currentQuestion.id,
            questionText: currentQuestion.text,
            options: currentQuestion.options,
            correctAnswer:
              currentQuestion.options.find((o) => o.correct)?.id || 'unknown',
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMessage =
            data?.error ||
            data?.message ||
            `Explain API failed (${response.status})`;
          throw new Error(errorMessage);
        }

        const text = data?.explanation || data?.text || '';

        if (!text) {
          setExplainError('No explanation available right now.');
        }

        setExplanation(text || null);

        setQuestions((prev) => {
          const next = [...prev];
          const q = { ...next[currentQuestionIndex] };
          q.explanation = text || q.explanation;
          next[currentQuestionIndex] = q;
          return next;
        });
      } catch (error: unknown) {
        console.error('Error fetching explanation:', error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to fetch explanation';
        setExplainError(errorMessage);
      } finally {
        setIsExplaining(false);
      }
    }
  };

  const handleNextQuestion = () => {
    if (selectedOption) {
      const currentQ = questions[currentQuestionIndex];
      if (!answers[currentQuestionIndex]) {
        const isCorrect =
          currentQ.options.find((opt) => opt.id === selectedOption)?.correct ||
          false;
        setAnswers((prev) => ({
          ...prev,
          [currentQuestionIndex]: {
            selected: selectedOption,
            correct: isCorrect,
          },
        }));
      }
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      const prevAnswer = answers[currentQuestionIndex - 1];
      setSelectedOption(prevAnswer?.selected || null);

      const prevQ = questions[currentQuestionIndex - 1];
      if (prevAnswer && prevQ.explanation) {
        setExplanation(prevQ.explanation);
      } else {
        setExplanation(null);
      }
    }
  };

  const handleEndSession = async () => {
    if (!questions.length) return;

    let correct = 0;
    let incorrect = 0;

    const finalAnswers = { ...answers };
    if (selectedOption && !answers[currentQuestionIndex]) {
      const isCorrect =
        questions[currentQuestionIndex].options.find(
          (opt) => opt.id === selectedOption
        )?.correct || false;
      finalAnswers[currentQuestionIndex] = {
        selected: selectedOption,
        correct: isCorrect,
      };
    }

    Object.values(finalAnswers).forEach((answer) => {
      if (answer.correct) correct++;
      else incorrect++;
    });

    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject || (mode === 'mock' ? 'Mock Exam' : 'Unknown'),
          mode: mode,
          questionsCount: Object.keys(finalAnswers).length,
          correctCount: correct,
          incorrectCount: incorrect,
          timeSpent: time,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSessionResult({
          subject: subject || 'Unknown',
          questionsCount: Object.keys(finalAnswers).length,
          correctCount: correct,
          incorrectCount: incorrect,
          timeSpent: time,
          xpEarned: data.xpEarned,
          leveledUp: data.leveledUp,
          newLevel: data.newLevel,
          streakIncremented: data.streakIncremented,
          streakBonus: data.streakBonus,
        });
        setShowSummary(true);
      } else {
        console.error('Failed to save session', data);
      }
    } catch (error) {
      console.error('Failed to save session', error);
    }
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
    router.push('/dashboard/practice');
  };

  const formatTime = (seconds: number) => {
    if (mode === 'mock') {
      // Show remaining time
      const remaining = Math.max(0, 7200 - seconds);
      const hrs = Math.floor(remaining / 3600);
      const mins = Math.floor((remaining % 3600) / 60);
      const secs = remaining % 60;
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress =
    totalQuestions > 0
      ? ((currentQuestionIndex + 1) / totalQuestions) * 100
      : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4">
        <div className="flex items-center justify-center p-12 text-white/50 bg-[#0A0A0F] rounded-2xl border border-white/5">
          <div className="animate-spin h-8 w-8 border-4 border-neon-blue border-t-transparent rounded-full mr-4"></div>
          Loading questions...
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center p-12 text-white/50 bg-[#0A0A0F] rounded-2xl border border-white/5">
          <p>No questions found for this subject.</p>
          <button
            onClick={() => router.push('/practice')}
            className="mt-4 text-neon-blue hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const sanitize = (html: string) =>
    DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 'br', 'sub', 'sup'],
      ALLOWED_ATTR: [],
    });

  return (
    <div className="min-h-screen bg-[#0A0A0F] p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Mobile Header - Compact */}
      <div className="lg:hidden mb-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => router.push('/practice')}
            className="flex items-center gap-1 text-muted-foreground hover:text-white transition-colors text-sm"
          >
            <FontAwesomeIcon icon={faArrowLeft} size="sm" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 text-white/70 text-xs">
              <FontAwesomeIcon icon={faClock} size="xs" />
              <span>{formatTime(time)}</span>
            </div>

            {/* Calculator Toggle Button for Mobile */}
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center justify-center"
              title={showCalculator ? 'Hide Calculator' : 'Show Calculator'}
            >
              <FontAwesomeIcon icon={faCalculator} size="sm" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-lg bg-neon-blue/10 flex items-center justify-center text-neon-blue text-sm">
            {subject && subjectIcons[subject as keyof typeof subjectIcons] && (
              <FontAwesomeIcon
                icon={subjectIcons[subject as keyof typeof subjectIcons]}
                size="sm"
              />
            )}
          </div>
          <div>
            <h1 className="text-lg font-bold text-white truncate max-w-[200px]">
              {subject}
            </h1>
            <div className="text-xs text-white/50">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </div>
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-neon-blue to-neon-purple transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/practice')}
              className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Back to Practice</span>
            </button>
            <div className="h-10 w-10 rounded-xl bg-neon-blue/10 flex items-center justify-center text-neon-blue">
              {subject &&
                subjectIcons[subject as keyof typeof subjectIcons] && (
                  <FontAwesomeIcon
                    icon={subjectIcons[subject as keyof typeof subjectIcons]}
                  />
                )}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">
                {subject}
              </h1>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <span className="bg-white/5 px-2 py-0.5 rounded text-xs">
                  {mode === 'mock' ? 'Mock Exam' : 'Practice Mode'}
                </span>
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon
                    icon={faClock}
                    className="text-neon-purple"
                  />
                  {formatTime(time)}
                </span>
              </div>
            </div>
          </div>

          {/* Calculator Toggle Button for Desktop */}
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <FontAwesomeIcon icon={faCalculator} />
            <span>
              {showCalculator ? 'Hide Calculator' : 'Show Calculator'}
            </span>
          </button>
        </div>

        {/* Desktop Progress Bar */}
        <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-neon-blue to-neon-purple transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
          <div className="mt-2 text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
        </div>
      </div>

      {/* Mobile Calculator Overlay */}
      {isMobile && showCalculator && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 lg:hidden">
          <div className="w-full max-w-sm bg-[#0A0A0F] rounded-2xl border border-white/10 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Calculator</h2>
              <button
                onClick={() => setShowCalculator(false)}
                className="text-muted-foreground hover:text-white"
              >
                ×
              </button>
            </div>
            <Calculator />
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Main Question Content */}
        <div
          className={`${showCalculator && !isMobile ? 'lg:w-2/3' : 'flex-1'}`}
        >
          <div className="bg-[#0A0A0F] rounded-xl lg:rounded-2xl border border-white/5 p-4 sm:p-5 md:p-6 lg:p-8">
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="space-y-3 sm:space-y-4">
                <span className="text-neon-blue font-mono text-xs sm:text-sm">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-white leading-relaxed">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: sanitize(currentQuestion.text),
                    }}
                  />
                </h3>
              </div>
              <div className="grid gap-3 sm:gap-4">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedOption === option.id;
                  const isCorrect = option.correct;
                  const isAnswered = answers[currentQuestionIndex];

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      disabled={!!answers[currentQuestionIndex]}
                      className={cn(
                        'w-full p-4 sm:p-5 lg:p-6 rounded-lg lg:rounded-xl border text-left transition-all duration-200 group relative overflow-hidden',
                        isSelected
                          ? isCorrect
                            ? 'bg-neon-green/10 border-neon-green text-white'
                            : 'bg-red-500/20 border-red-500 text-white'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20',
                        isAnswered &&
                        !isSelected &&
                        isCorrect &&
                        'bg-neon-green/10 border-neon-green'
                      )}
                    >
                      <div className="flex items-center justify-between gap-3 sm:gap-4 relative z-10">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div
                            className={cn(
                              'w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full border-2 flex items-center justify-center text-xs sm:text-sm font-bold transition-colors',
                              isSelected
                                ? isCorrect
                                  ? 'border-neon-green bg-neon-green text-white'
                                  : 'border-red-500 bg-red-500 text-white'
                                : 'border-white/20 text-white/40 group-hover:border-white/40',
                              isAnswered &&
                              !isSelected &&
                              isCorrect &&
                              'border-neon-green bg-neon-green text-white'
                            )}
                          >
                            {option.id.toUpperCase()}
                          </div>
                          <span
                            className="text-sm sm:text-base lg:text-lg"
                            dangerouslySetInnerHTML={{
                              __html: sanitize(option.text),
                            }}
                          />
                        </div>
                        <div className="hidden sm:block">
                          {isSelected && isCorrect && (
                            <span className="text-neon-green font-bold flex items-center gap-2 text-sm">
                              <FontAwesomeIcon icon={faCheck} /> Correct!
                            </span>
                          )}
                          {isSelected && !isCorrect && (
                            <span className="text-red-400 font-bold flex items-center gap-2 text-sm">
                              <FontAwesomeIcon icon={faXmark} /> Incorrect
                            </span>
                          )}
                          {isAnswered && !isSelected && isCorrect && (
                            <span className="text-neon-green font-bold flex items-center gap-2 text-sm">
                              <FontAwesomeIcon icon={faCheck} /> Correct Answer
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Explanation Section */}
            {(explanation || isExplaining || explainError) && (
              <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl lg:rounded-2xl">
                <div className="flex items-center gap-3 mb-3 lg:mb-4">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faBook}
                      className="text-blue-400 text-sm lg:text-base"
                    />
                  </div>
                  <h4 className="text-base lg:text-lg font-semibold text-blue-100">
                    Why is this correct?
                  </h4>
                  {isExplaining && (
                    <span className="text-xs text-blue-300 animate-pulse ml-auto">
                      Generating...
                    </span>
                  )}
                </div>

                {isExplaining ? (
                  <div className="space-y-2">
                    <div className="h-3 lg:h-4 bg-blue-400/10 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 lg:h-4 bg-blue-400/10 rounded w-full animate-pulse"></div>
                    <div className="h-3 lg:h-4 bg-blue-400/10 rounded w-5/6 animate-pulse"></div>
                  </div>
                ) : explainError ? (
                  <div className="text-blue-200/80 text-xs lg:text-sm">
                    {explainError}
                  </div>
                ) : (
                  <div
                    className="text-blue-100/90 leading-relaxed text-xs lg:text-sm"
                    dangerouslySetInnerHTML={{
                      __html: explanation ? sanitize(explanation) : '',
                    }}
                  />
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-6 lg:mt-8 flex flex-col sm:flex-row gap-3 lg:gap-4 justify-between">
              <div className="flex gap-3 lg:gap-4">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0 || isLoading}
                  className={cn(
                    'px-4 lg:px-6 py-2.5 lg:py-3 rounded-full font-semibold transition-colors duration-200 flex items-center gap-2 text-sm lg:text-base',
                    currentQuestionIndex === 0 || isLoading
                      ? 'bg-white/5 text-muted-foreground cursor-not-allowed'
                      : 'bg-white/5 hover:bg-white/10 text-white'
                  )}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </button>

                <button
                  onClick={handleNextQuestion}
                  disabled={isLoading || !selectedOption}
                  className={cn(
                    'px-4 lg:px-6 py-2.5 lg:py-3 rounded-full font-semibold transition-colors duration-200 flex items-center gap-2 text-sm lg:text-base',
                    isLoading || !selectedOption
                      ? 'bg-neon-blue/50 text-white/50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:shadow-lg hover:shadow-purple-500/40'
                  )}
                >
                  <span className="hidden sm:inline">
                    {currentQuestionIndex === totalQuestions - 1
                      ? 'Finish'
                      : 'Next'}
                  </span>
                  <span className="sm:hidden">
                    {currentQuestionIndex === totalQuestions - 1
                      ? 'End'
                      : 'Next'}
                  </span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>

              <button
                onClick={handleEndSession}
                className="px-4 lg:px-6 py-2.5 lg:py-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-full font-semibold transition-colors duration-200 text-sm lg:text-base"
              >
                End Session
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Calculator Sidebar */}
        {showCalculator && !isMobile && (
          <div className="lg:w-1/3">
            <div className="sticky top-6">
              <Calculator />
            </div>
          </div>
        )}
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
