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
  faDna,
  faChartLine,
  faBalanceScale,
  faMoneyBillTrendUp,
  faLandmark,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

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
  {
    name: 'Biology',
    icon: faDna,
    topics: '15 Topics • 600+ Questions',
    color: 'neon-glow-teal',
  },
  {
    name: 'Commerce',
    icon: faChartLine,
    topics: '10 Topics • 450+ Questions',
    color: 'neon-glow-orange',
  },
  {
    name: 'Accounting',
    icon: faBalanceScale,
    topics: '11 Topics • 480+ Questions',
    color: 'neon-glow-yellow',
  },
  {
    name: 'Economics',
    icon: faMoneyBillTrendUp,
    topics: '9 Topics • 430+ Questions',
    color: 'neon-glow-emerald',
  },
  {
    name: 'Government',
    icon: faLandmark,
    topics: '7 Topics • 380+ Questions',
    color: 'neon-glow-rose',
  },
];

export default function Practice() {
  const [activeMode, setActiveMode] = useState('Practice Mode');
  const { user } = useUser();
  const router = useRouter();

  const modes = ['Practice Mode', 'Timed Mode', 'Mock Exam'];
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const handleSubjectToggle = (subjectName: string) => {
    if (subjectName === 'English') return; // English is compulsory

    setSelectedSubjects(prev => {
      if (prev.includes(subjectName)) {
        return prev.filter(s => s !== subjectName);
      }
      if (prev.length >= 3) return prev; // Max 3
      return [...prev, subjectName];
    });
  };

  const handleStartMockExam = () => {
    if (selectedSubjects.length !== 3) return;
    router.push(`/dashboard/practice/mock?subjects=${selectedSubjects.join(',')}`);
  };

  const handleSubjectClick = (subjectName: string) => {
    router.push(`/dashboard/practice/${encodeURIComponent(subjectName)}`);
  };

  return (
    <>
      <header className="hidden lg:flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-0 mb-6 lg:mb-10">
        <div className="w-full lg:w-auto">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">
            Practice Arena 🎯
          </h1>
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

      <div className="lg:hidden mb-6 lg:mb-10">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">
          Good Afternoon, {user?.firstName || 'Student'}! 👋
        </h1>
        <p className="text-muted-foreground">
          Ready to crush some questions today?
        </p>
      </div>

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

        {/* Mock Exam Setup Panel */}
        {activeMode === 'Mock Exam' && (
          <div className="glass-panel p-6 lg:p-8 rounded-2xl border border-white/10 animate-fade-in">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Configure Mock Exam</h2>
              <p className="text-muted-foreground">
                English is compulsory. Select 3 additional subjects to start your 2-hour mock exam.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {/* Compulsory English */}
              <div className="glass-card p-4 rounded-xl border border-neon-blue/30 bg-neon-blue/10 flex items-center gap-4 opacity-80 cursor-not-allowed">
                <div className="h-10 w-10 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue">
                  <FontAwesomeIcon icon={faBook} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">English</h3>
                  <p className="text-xs text-neon-blue">Compulsory</p>
                </div>
                <div className="w-6 h-6 rounded-full bg-neon-blue flex items-center justify-center text-black text-xs">
                  <FontAwesomeIcon icon={faCheck} />
                </div>
              </div>

              {/* Other Subjects */}
              {subjects.filter(s => s.name !== 'English').map(subject => {
                const isSelected = selectedSubjects.includes(subject.name);
                return (
                  <button
                    key={subject.name}
                    onClick={() => handleSubjectToggle(subject.name)}
                    className={cn(
                      "glass-card p-4 rounded-xl border text-left flex items-center gap-4 transition-all duration-200",
                      isSelected
                        ? "border-neon-purple bg-neon-purple/10"
                        : "border-white/5 bg-white/5 hover:bg-white/10"
                    )}
                  >
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                      isSelected ? "bg-neon-purple/20 text-neon-purple" : "bg-white/10 text-muted-foreground"
                    )}>
                      <FontAwesomeIcon icon={subject.icon} />
                    </div>
                    <div className="flex-1">
                      <h3 className={cn("font-semibold", isSelected ? "text-white" : "text-white/70")}>{subject.name}</h3>
                      <p className="text-xs text-muted-foreground">{subject.topics.split('•')[0]}</p>
                    </div>
                    <div className={cn(
                      "w-6 h-6 rounded-full border flex items-center justify-center transition-colors",
                      isSelected
                        ? "bg-neon-purple border-neon-purple text-white"
                        : "border-white/20 bg-transparent"
                    )}>
                      {isSelected && <FontAwesomeIcon icon={faCheck} size="xs" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-6">
              <div className="text-sm text-muted-foreground">
                Selected: <span className="text-white font-bold">{selectedSubjects.length}/3</span> subjects
              </div>
              <button
                onClick={handleStartMockExam}
                disabled={selectedSubjects.length !== 3}
                className={cn(
                  "px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2",
                  selectedSubjects.length === 3
                    ? "bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-lg shadow-purple-500/20 hover:scale-105"
                    : "bg-white/5 text-white/30 cursor-not-allowed"
                )}
              >
                Start Exam
              </button>
            </div>
          </div>
        )}

        {/* Subjects Grid - Now 3 columns for larger screens */}
        {activeMode === 'Practice Mode' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {subjects.map((subject) => (
              <div
                key={subject.name}
                className="glass-card text-center p-6 lg:p-8 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => handleSubjectClick(subject.name)}
              >
                <div
                  className={cn(
                    'text-3xl lg:text-4xl mb-4 lg:mb-6',
                    subject.color
                  )}
                >
                  <FontAwesomeIcon icon={subject.icon} />
                </div>
                <h3 className="text-lg lg:text-xl font-semibold mb-2 lg:mb-3">
                  {subject.name}
                </h3>
                <p className="text-muted-foreground text-sm lg:text-base mb-4 lg:mb-6">
                  {subject.topics}
                </p>
                <button className="cta-button bg-gradient-to-r from-neon-blue to-neon-purple text-white px-6 lg:px-8 py-2 lg:py-3 rounded-full font-semibold shadow-lg shadow-purple-500/40 hover:scale-105 transition-all duration-300 text-sm lg:text-base">
                  Start
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
