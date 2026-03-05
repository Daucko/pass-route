// components/features/countdown-timer.tsx
'use client';

import { useEffect, useState } from 'react';

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // countdown to April 16 (year remains current). adjust time zone as needed
    const targetDate = new Date('2026-04-16T00:00:00');

    const updateTimer = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        targetDate.setHours(targetDate.getHours() + 24);
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    const interval = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex flex-col items-center mb-8">
      <div className="text-xs uppercase tracking-widest text-neon-blue mb-1 drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
        JAMB Starts In:
      </div>
      <div className="font-mono text-4xl font-bold text-white drop-shadow-[0_0_20px_rgba(0,240,255,0.3)] flex gap-4">
        <div className="flex flex-col items-center">
          <span>{String(timeLeft.days).padStart(2, '0')}</span>
          <span className="text-xs uppercase mt-1">Days</span>
        </div>
        <div className="flex flex-col items-center">
          <span>{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="text-xs uppercase mt-1">Hours</span>
        </div>
        <div className="flex flex-col items-center">
          <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="text-xs uppercase mt-1">Minutes</span>
        </div>
        <div className="flex flex-col items-center">
          <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="text-xs uppercase mt-1">Seconds</span>
        </div>
      </div>
    </div>
  );
}
