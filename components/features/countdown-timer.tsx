// components/features/countdown-timer.tsx
'use client';

import { useEffect, useState } from 'react';

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() + 24);

    const updateTimer = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        targetDate.setHours(targetDate.getHours() + 24);
      }

      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
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
      <div className="font-mono text-4xl font-bold text-white drop-shadow-[0_0_20px_rgba(0,240,255,0.3)]">
        {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </div>
    </div>
  );
}
