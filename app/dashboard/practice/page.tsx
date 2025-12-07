'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faBell,
  faCalculator,
  faBook,
  faAtom,
  faFlask,
} from '@fortawesome/free-solid-svg-icons';
import { QuestionView } from '@/components/features/question-view';

const subjects = [
  {
    name: 'Mathematics',
    icon: faCalculator,
    topics: '12 Topics • 500+ Questions',
    color: 'neon-glow-blue',
  },
  {
    name: 'English',
    icon: faBook,
    topics: '8 Topics • 400+ Questions',
    color: 'neon-glow-purple',
  },
  {
    name: 'Physics',
    icon: faAtom,
    topics: '14 Topics • 550+ Questions',
    color: 'neon-glow-green',
  },
  {
    name: 'Chemistry',
    icon: faFlask,
    topics: '13 Topics • 520+ Questions',
    color: 'neon-glow-pink',
  },
];

export default function Practice() {
  const [activeMode, setActiveMode] = useState('Practice Mode');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [isQuestionViewActive, setIsQuestionViewActive] = useState(false);

  const modes = ['Practice Mode', 'Timed Mode', 'Mock Exam'];

  const handleSubjectClick = (subjectName: string) => {
    setSelectedSubject(subjectName);
    setIsQuestionViewActive(true);
  };

  const handleEndSession = () => {
    setIsQuestionViewActive(false);
    setSelectedSubject(null);
    // You can add additional logic here like saving session results
  };

  const handleCloseQuestionView = () => {
    setIsQuestionViewActive(false);
  };

  return (
    <>
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-0 mb-6 lg:mb-10">
        <div className="w-full lg:w-auto">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">Practice Arena 🎯</h1>
          <p className="text-muted-foreground">
            Sharpen your skills and prepare for the exam.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="glass-panel flex items-center gap-3 px-4 lg:px-5 py-3 rounded-full flex-1 lg:flex-none lg:w-80">
            <FontAwesomeIcon
              icon={faSearch}
              className="text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search topics..."
              className="bg-transparent border-none outline-none text-white w-full placeholder:text-muted-foreground text-sm lg:text-base"
            />
          </div>
          <button className="glass-panel w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center border border-white/10 flex-shrink-0">
            <FontAwesomeIcon icon={faBell} />
          </button>
        </div>
      </header>

      <div className="space-y-6 lg:space-y-8">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold mb-2">Select Subject</h2>
          <p className="text-muted-foreground text-sm lg:text-base">
            Choose a subject to start practicing
          </p>
        </div>

        {/* Mode Selection */}
        <div className="flex flex-wrap gap-3 lg:gap-4">
          {modes.map((mode) => (
            <button
              key={mode}
              onClick={() => setActiveMode(mode)}
              className={cn(
                'px-4 lg:px-6 py-2 lg:py-3 rounded-full border transition-all duration-300 text-sm lg:text-base',
                activeMode === mode
                  ? 'bg-neon-blue/10 text-neon-blue border-neon-blue'
                  : 'bg-white/5 border-white/10 text-muted-foreground hover:text-white'
              )}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          {subjects.map((subject) => (
            <div
              key={subject.name}
              className="glass-card text-center p-6 lg:p-8 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => handleSubjectClick(subject.name)}
            >
              <div className={cn('text-3xl lg:text-4xl mb-4 lg:mb-6', subject.color)}>
                <FontAwesomeIcon icon={subject.icon} />
              </div>
              <h3 className="text-lg lg:text-xl font-semibold mb-2 lg:mb-3">{subject.name}</h3>
              <p className="text-muted-foreground text-sm lg:text-base mb-4 lg:mb-6">{subject.topics}</p>
              <button className="cta-button bg-gradient-to-r from-neon-blue to-neon-purple text-white px-6 lg:px-8 py-2 lg:py-3 rounded-full font-semibold shadow-lg shadow-purple-500/40 hover:scale-105 transition-all duration-300 text-sm lg:text-base">
                Start
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Question View Modal */}
      <QuestionView
        selectedSubject={selectedSubject}
        isActive={isQuestionViewActive}
        onEndSession={handleEndSession}
        onClose={handleCloseQuestionView}
      />
    </>
  );
}