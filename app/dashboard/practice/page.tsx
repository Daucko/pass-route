// app/practice/page.tsx
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const subjects = [
  {
    name: 'Mathematics',
    icon: 'fa-solid fa-calculator',
    topics: '12 Topics • 500+ Questions',
    color: 'neon-glow-blue',
  },
  {
    name: 'English',
    icon: 'fa-solid fa-book',
    topics: '8 Topics • 400+ Questions',
    color: 'neon-glow-purple',
  },
  {
    name: 'Physics',
    icon: 'fa-solid fa-atom',
    topics: '14 Topics • 550+ Questions',
    color: 'neon-glow-green',
  },
  {
    name: 'Chemistry',
    icon: 'fa-solid fa-flask',
    topics: '13 Topics • 520+ Questions',
    color: 'neon-glow-pink',
  },
];

export default function Practice() {
  const [activeMode, setActiveMode] = useState('Practice Mode');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const modes = ['Practice Mode', 'Timed Mode', 'Mock Exam'];

  // Add this to use the variable
  console.log(selectedSubject); // Temporary usage to satisfy linter

  return (
    <>
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">Practice Arena 🎯</h1>
          <p className="text-muted-foreground">
            Sharpen your skills and prepare for the exam.
          </p>
        </div>
        <div className="flex items-center gap-5">
          <div className="glass-panel flex items-center gap-3 px-5 py-3 rounded-full w-80">
            <i className="fa-solid fa-search text-muted-foreground" />
            <input
              type="text"
              placeholder="Search topics..."
              className="bg-transparent border-none outline-none text-white w-full placeholder:text-muted-foreground"
            />
          </div>
          <button className="glass-panel w-12 h-12 rounded-full flex items-center justify-center border border-white/10">
            <i className="fa-solid fa-bell" />
          </button>
        </div>
      </header>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Select Subject</h2>
          <p className="text-muted-foreground">
            Choose a subject to start practicing
          </p>
        </div>

        {/* Mode Selection */}
        <div className="flex gap-4">
          {modes.map((mode) => (
            <button
              key={mode}
              onClick={() => setActiveMode(mode)}
              className={cn(
                'px-6 py-3 rounded-full border transition-all duration-300',
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
        <div className="grid grid-cols-2 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject.name}
              className="glass-card text-center p-8 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => setSelectedSubject(subject.name)}
            >
              <div className={cn('text-4xl mb-6', subject.color)}>
                <i className={subject.icon} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{subject.name}</h3>
              <p className="text-muted-foreground mb-6">{subject.topics}</p>
              <button className="cta-button bg-gradient-to-r from-neon-blue to-neon-purple text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-purple-500/40 hover:scale-105 transition-all duration-300">
                Start
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
