// components/features/features-grid.tsx
'use client';

import { cn } from '@/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBrain,
  faClock,
  faBookOpen,
  faTrophy,
  faCheckCircle,
  faMobileScreen,
  faUserGraduate,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';

export function FeaturesGrid() {
  const features = [
    {
      title: 'Adaptive AI',
      icon: faBrain,
      iconClass: 'neon-glow-purple',
      description:
        'Recognizes weak points. We adapt into your performance. Focus on your small weak improvements.',
      progress: 32,
      gridClass: 'col-span-2',
    },
    {
      title: 'Real Exam Mode',
      icon: faClock,
      iconClass: 'neon-glow-blue',
      description:
        'Simulate the real exam environment with strict timing and past questions.',
      gridClass: 'col-span-1',
    },
    {
      title: 'Revision Center',
      icon: faBookOpen,
      iconClass: 'neon-glow-blue',
      description:
        'Curated notes and materials to understand every topic detailed.',
      gridClass: 'col-span-1',
    },
    {
      title: 'Gamified XP',
      icon: faTrophy,
      iconClass: 'text-yellow-400',
      description:
        'Unlock badges, ranks and climb the leaderboard while learning.',
      badge: 'XP Traveler',
      gridClass: 'col-span-2',
    },
    {
      title: 'Instant Feedback',
      icon: faCheckCircle,
      iconClass: 'text-blue-400',
      description:
        'Detailed performance analysis and instant explanations for every question.',
      badge: 'Always On',
      gridClass: 'col-span-1',
    },
    {
      title: 'Mobile Friendly',
      icon: faMobileScreen,
      iconClass: 'neon-glow-green',
      description: 'Study on any device, anytime. Seamless progress sync.',
      gridClass: 'col-span-1',
    },
    {
      title: 'Expert Tutors',
      icon: faUserGraduate,
      iconClass: 'neon-glow-purple',
      description: 'Access top achievers & tutors via video explanations.',
      gridClass: 'col-span-1',
    },
  ];

  return (
    <section id="features" className="mb-20">
      <div className="grid grid-cols-4 gap-5">
        {features.map((feature, index) => (
          <div key={index} className={cn('glass-card', feature.gridClass)}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <FontAwesomeIcon
                icon={feature.icon}
                className={cn('text-2xl', feature.iconClass)}
              />
            </div>

            <p className="text-muted-foreground mb-4">{feature.description}</p>

            {feature.progress && (
              <div className="mt-5">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Learning Path</span>
                  <span>{feature.progress}% Optimized</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-neon-blue to-neon-purple h-1.5 rounded-full shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                    style={{ width: `${feature.progress}%` }}
                  />
                </div>
              </div>
            )}

            {feature.badge && (
              <div className="flex items-center justify-between mt-4">
                <div className="bg-green-500/20 text-neon-green px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
                  <FontAwesomeIcon icon={faShieldHalved} />
                  <span>{feature.badge}</span>
                </div>
                {feature.icon === faTrophy && (
                  <FontAwesomeIcon
                    icon={faTrophy}
                    className="text-4xl bg-gradient-to-b from-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]"
                  />
                )}
              </div>
            )}

            {feature.title === 'Instant Feedback' && (
              <div className="flex items-end gap-1 h-10 mt-4">
                {[40, 60, 30, 80, 50].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-neon-blue to-transparent rounded-t-sm opacity-70"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
