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
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [time, setTime] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);

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
          const res = await fetch(`/api/questions?subject=${selectedSubject}&limit=10`);
          const data = await res.json();
          if (data.questions) {
            setQuestions(data.questions);
            setCurrentQuestionIndex(0);
            setAnswers({});
            setSelectedOption(null);
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

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNextQuestion = () => {
    if (selectedOption) {
      const currentQ = questions[currentQuestionIndex];
      setAnswers({ ...answers, [currentQ.id]: selectedOption });

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        // Last question, end session automatically? Or just stay?
        // Let's just ready for end session
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      // specific logic for retrieving previous answer if we want to allow changing? 
      // For now, simple navigation.
      const prevQ = questions[currentQuestionIndex - 1];
      setSelectedOption(answers[prevQ.id] || null);
    }
  };

  const handleEndSession = async () => {
    if (!questions.length) return;

    // Calculate results
    let correct = 0;
    let incorrect = 0;

    // Include current selection if not yet saved
    const finalAnswers = { ...answers };
    if (selectedOption) {
      finalAnswers[questions[currentQuestionIndex].id] = selectedOption;
    }

    questions.forEach(q => {
      const answer = finalAnswers[q.id];
      if (answer) {
        const isCorrect = q.options.find(opt => opt.id === answer)?.correct;
        if (isCorrect) correct++;
        else incorrect++;
      }
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
          timeSpent: time
        })
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
          streakBonus: data.streakBonus
        });
        setShowSummary(true);
      }
    } catch (e) {
      console.error("Failed to save session", e);
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
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

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

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center p-12 text-white/50 bg-[#0A0A0F] rounded-2xl border border-white/5">
          <p>No questions found for this subject.</p>
          <button onClick={onClose} className="mt-4 text-neon-blue hover:underline">
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
              {selectedSubject && subjectIcons[selectedSubject as keyof typeof subjectIcons] && (
                <FontAwesomeIcon icon={subjectIcons[selectedSubject as keyof typeof subjectIcons]} />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{selectedSubject}</h2>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <span className="bg-white/5 px-2 py-0.5 rounded text-xs">Practice Mode</span>
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
                {currentQuestion.text}
              </h3>
            </div>

            <div className="grid gap-4">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className={cn(
                    'w-full p-6 rounded-xl border text-left transition-all duration-200 group relative overflow-hidden',
                    selectedOption === option.id
                      ? 'bg-neon-blue/10 border-neon-blue text-white'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                  )}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors',
                        selectedOption === option.id
                          ? 'border-neon-blue bg-neon-blue text-white'
                          : 'border-white/20 text-white/40 group-hover:border-white/40'
                      )}
                    >
                      {option.id.toUpperCase()}
                    </div>
                    <span className="text-lg">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
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
                (currentQuestionIndex === 0 || isLoading)
                  ? 'bg-white/5 text-muted-foreground cursor-not-allowed'
                  : 'bg-white/5 hover:bg-white/10 text-white'
              )}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Previous
            </button>

            <button
              onClick={handleNextQuestion}
              disabled={isLoading}
              className={cn(
                'px-6 py-3 rounded-full font-semibold transition-colors duration-200 flex items-center gap-2',
                isLoading
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
