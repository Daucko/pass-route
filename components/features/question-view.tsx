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
import DOMPurify from 'isomorphic-dompurify';

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

const subjectIcons = {
  Mathematics: faCalculator,
  English: faBook,
  Physics: faAtom,
  Chemistry: faFlask,
};

export function QuestionView({
  selectedSubject,
  isActive,
  onClose,
}: QuestionViewProps) {
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
  const [keyConcepts, setKeyConcepts] = useState<string[]>([]);
  const [commonMistakes, setCommonMistakes] = useState<string[]>([]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !showSummary && questions.length > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, showSummary, questions.length]);

  // Fetch Questions
  useEffect(() => {
    async function fetchQuestions() {
      if (isActive && selectedSubject) {
        setIsLoading(true);
        try {
          const res = await fetch(
            `/api/questions?subject=${selectedSubject}&limit=10`
          );
          const data = await res.json();
          if (data.questions) {
            setQuestions(data.questions);
            setCurrentQuestionIndex(0);
            setAnswers({});
            setSelectedOption(null);
            setExplanation(null);
            setKeyConcepts([]);
            setCommonMistakes([]);
            setTime(0);
          }
        } catch (error) {
          console.error('Failed to fetch questions:', error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchQuestions();
  }, [isActive, selectedSubject]);

  // Reset explanation when changing questions
  useEffect(() => {
    setExplanation(null);
    setIsExplaining(false);
    setKeyConcepts([]);
    setCommonMistakes([]);
  }, [currentQuestionIndex]);

  const handleOptionSelect = async (optionId: string) => {
    if (answers[currentQuestionIndex]) return; // Already answered

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
      setKeyConcepts(currentQuestion.keyConcepts || []);
      setCommonMistakes(currentQuestion.commonMistakes || []);
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
            correctAnswer:
              currentQuestion.options.find((o) => o.correct)?.id || 'unknown',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setExplanation(data.explanation);
          setKeyConcepts(data.keyConcepts || []);
          setCommonMistakes(data.commonMistakes || []);
          // Update the local question object so we don't fetch again if they revisit
          const updatedQuestions = [...questions];
          updatedQuestions[currentQuestionIndex].explanation = data.explanation;
          updatedQuestions[currentQuestionIndex].keyConcepts = data.keyConcepts || [];
          updatedQuestions[currentQuestionIndex].commonMistakes = data.commonMistakes || [];
          setQuestions(updatedQuestions);
        }
      } catch (error) {
        console.error('Error fetching explanation:', error);
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
        setAnswers({
          ...answers,
          [currentQ.id]: { selected: selectedOption, correct: isCorrect },
        });
      }

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        // Last question, ready for end session
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      const prevQ = questions[currentQuestionIndex - 1];
      const prevAnswer = answers[currentQuestionIndex - 1];
      setSelectedOption(prevAnswer?.selected || null);

      // Show explanation for previously answered question
      if (prevAnswer && prevQ.explanation) {
        setExplanation(prevQ.explanation);
        setKeyConcepts(prevQ.keyConcepts || []);
        setCommonMistakes(prevQ.commonMistakes || []);
      } else {
        setExplanation(null);
        setKeyConcepts([]);
        setCommonMistakes([]);
      }
    }
  };

  const handleEndSession = async () => {
    if (!questions.length) return;

    // Calculate results
    let correct = 0;
    let incorrect = 0;

    // Include current selection if not yet saved
    const finalAnswers = { ...answers };
    if (selectedOption && !answers[currentQuestionIndex]) {
      const isCorrect =
        questions[currentQuestionIndex].options.find(
          (opt) => opt.id === selectedOption
        )?.correct || false;
      finalAnswers[questions[currentQuestionIndex].id] = {
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
          subject: selectedSubject || 'Unknown',
          mode: 'practice',
          questionsCount: Object.keys(finalAnswers).length,
          correctCount: correct,
          incorrectCount: incorrect,
          timeSpent: time,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSessionResult({
          subject: selectedSubject || 'Unknown',
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
      }
    } catch (e) {
      console.error('Failed to save session', e);
    }
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
    setQuestions([]);
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  // Progress percentage
  const progress =
    totalQuestions > 0
      ? ((currentQuestionIndex + 1) / totalQuestions) * 100
      : 0;

  if (!isActive) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="flex items-center justify-center p-12 text-white/50 bg-[#0A0A0F] rounded-2xl border border-white/5">
          <div className="animate-spin h-8 w-8 border-4 border-neon-blue border-t-transparent rounded-full mr-4"></div>
          Loading questions...
        </div>
      </div>
    );
  }

  const sanitize = (html: string) =>
    DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 'br', 'sub', 'sup'],
      ALLOWED_ATTR: [],
    });

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center p-12 text-white/50 bg-[#0A0A0F] rounded-2xl border border-white/5">
          <p>No questions found for this subject.</p>
          <button
            onClick={onClose}
            className="mt-4 text-neon-blue hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[85vh] flex flex-col bg-[#0A0A0F] rounded-2xl border border-white/5 overflow-hidden shadow-2xl shadow-neon-blue/10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-neon-blue/10 flex items-center justify-center text-neon-blue">
              {selectedSubject &&
                subjectIcons[selectedSubject as keyof typeof subjectIcons] && (
                  <FontAwesomeIcon
                    icon={
                      subjectIcons[selectedSubject as keyof typeof subjectIcons]
                    }
                  />
                )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {selectedSubject}
              </h2>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <span className="bg-white/5 px-2 py-0.5 rounded text-xs">
                  Practice Mode
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-white/70 font-mono">
              <FontAwesomeIcon icon={faClock} className="text-neon-purple" />
              {formatTime(time)}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-neon-blue to-neon-purple transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Content */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <span className="text-neon-blue font-mono text-sm">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <h3 className="text-xl md:text-2xl font-medium text-white leading-relaxed">
                <span dangerouslySetInnerHTML={{ __html: sanitize(currentQuestion.text) }} />
              </h3>
            </div>
            <div className="grid gap-4">
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
                      'w-full p-6 rounded-xl border text-left transition-all duration-200 group relative overflow-hidden',
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
                    <div className="flex items-center justify-between gap-4 relative z-10">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            'w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors',
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
                          className="text-lg"
                          dangerouslySetInnerHTML={{ __html: sanitize(option.text) }}
                        />
                      </div>
                      {isSelected && isCorrect && (
                        <span className="text-neon-green font-bold flex items-center gap-2">
                          <FontAwesomeIcon icon={faCheck} /> Correct!
                        </span>
                      )}
                      {isSelected && !isCorrect && (
                        <span className="text-red-400 font-bold flex items-center gap-2">
                          <FontAwesomeIcon icon={faXmark} /> Incorrect
                        </span>
                      )}
                      {isAnswered && !isSelected && isCorrect && (
                        <span className="text-neon-green font-bold flex items-center gap-2">
                          <FontAwesomeIcon icon={faCheck} /> Correct Answer
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            {/* AI Explanation Section */}
            {(explanation || isExplaining) && (
              <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <FontAwesomeIcon icon={faBook} className="text-blue-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-blue-100">
                    Why is this correct?
                  </h4>
                  {isExplaining && (
                    <span className="text-xs text-blue-300 animate-pulse ml-auto">
                      Generating explanation...
                    </span>
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
                    dangerouslySetInnerHTML={{ __html: explanation ? sanitize(explanation) : '' }}
                  />
                )}
              </div>
            )}
            {/* Add this section after the explanation */}
            {explanation && keyConcepts && keyConcepts.length > 0 && (
              <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                <h5 className="text-sm font-semibold text-purple-300 mb-2">
                  📚 Key Concepts
                </h5>
                <div className="flex flex-wrap gap-2">
                  {keyConcepts.map((concept, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {explanation && commonMistakes && commonMistakes.length > 0 && (
              <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <h5 className="text-sm font-semibold text-amber-300 mb-2">
                  ⚠️ Common Mistakes
                </h5>
                <ul className="text-amber-200/80 text-sm space-y-1">
                  {commonMistakes.map((mistake, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">•</span>
                      {mistake}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
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
              disabled={isLoading || !selectedOption}
              className={cn(
                'px-6 py-3 rounded-full font-semibold transition-colors duration-200 flex items-center gap-2',
                isLoading || !selectedOption
                  ? 'bg-neon-blue/50 text-white/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:shadow-lg hover:shadow-purple-500/40'
              )}
            >
              {currentQuestionIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
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
    </div>
  );
}
