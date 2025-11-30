// components/features/quiz-demo.tsx
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faCalculator,
  faBook,
  faDna,
  faAtom,
  faFlask,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';

export function QuizDemo() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showCorrect, setShowCorrect] = useState(false);

  const options = [
    { id: 'a', text: 'Mass', correct: false },
    { id: 'b', text: 'Speed', correct: false },
    { id: 'c', text: 'Velocity', correct: true },
    { id: 'd', text: 'Temperature', correct: false },
  ];

  const handleOptionClick = (optionId: string, isCorrect: boolean) => {
    setSelectedOption(optionId);
    if (isCorrect) {
      setShowCorrect(true);
      setTimeout(() => setShowCorrect(false), 2000);
    }
  };

  const subjects = [
    {
      icon: faCalculator,
      name: 'Mathematics',
      topics: '12 Topics • 500+ Qs',
      color: 'text-neon-pink',
    },
    {
      icon: faBook,
      name: 'English Language',
      topics: '8 Topics • 400+ Qs',
      color: 'text-neon-blue',
    },
    {
      icon: faDna,
      name: 'Biology',
      topics: '15 Topics • 600+ Qs',
      color: 'text-neon-green',
    },
    {
      icon: faAtom,
      name: 'Physics',
      topics: '14 Topics • 550+ Qs',
      color: 'text-neon-purple',
    },
    {
      icon: faFlask,
      name: 'Chemistry',
      topics: '13 Topics • 520+ Qs',
      color: 'text-yellow-400',
    },
    {
      icon: faChartLine,
      name: 'Economics',
      topics: '10 Topics • 300+ Qs',
      color: 'text-white',
    },
  ];

  return (
    <section id="demo" className="mb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Quiz Card */}
        <div
          className={cn(
            'glass-card border-neon-blue shadow-[0_0_30px_rgba(0,240,255,0.1)] transform transition-all duration-400',
            showCorrect ? 'skew-y-0' : '-skew-y-2'
          )}
        >
          <div className={showCorrect ? 'skew-y-0' : 'skew-y-2'}>
            <div className="text-xl font-semibold mb-5">
              Which of the following is NOT a scalar quantity?
            </div>

            <div className="space-y-3">
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id, option.correct)}
                  className={cn(
                    'w-full text-left p-4 rounded-xl border transition-all duration-200',
                    selectedOption === option.id
                      ? option.correct
                        ? 'bg-green-500/20 border-neon-green shadow-[0_0_15px_rgba(0,255,148,0.3)]'
                        : 'bg-red-500/20 border-neon-pink'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  )}
                >
                  <span className="font-semibold mr-3">
                    {option.id.toUpperCase()})
                  </span>
                  {option.text}
                  {selectedOption === option.id && option.correct && (
                    <span className="float-right text-neon-green font-bold">
                      <FontAwesomeIcon icon={faCheck} /> Correct!
                    </span>
                  )}
                </button>
              ))}
            </div>

            {showCorrect && (
              <div className="absolute top-1/2 right-0 bg-neon-green text-black px-3 py-2 rounded-full font-bold text-sm transform -translate-y-1/2 translate-x-4 animate-float-up">
                +50 XP
              </div>
            )}
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-3 gap-4">
          {subjects.map((subject, index) => (
            <div
              key={index}
              className="glass-card bg-white/5 border-white/5 p-5 text-center cursor-pointer transition-all duration-300 hover:bg-white/10 hover:-translate-y-1"
            >
              <FontAwesomeIcon
                icon={subject.icon}
                className={cn('text-2xl mb-3', subject.color)}
              />
              <div className="font-semibold text-sm mb-1">{subject.name}</div>
              <div className="text-xs text-muted-foreground">
                {subject.topics}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
