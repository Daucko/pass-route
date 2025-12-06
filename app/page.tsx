// app/page.tsx
'use client';

import Image from 'next/image';
import { BackgroundBlobs } from '@/components/layout/background-blobs';
import { Navbar } from '@/components/layout/navbar';
import { CountdownTimer } from '@/components/features/countdown-timer';
import { FeaturesGrid } from '@/components/features/features-grid';
import { QuizDemo } from '@/components/features/quiz-demo';
import { Ticker } from '@/components/features/ticker';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <>
      <BackgroundBlobs />
      <Navbar />

      <main className="container max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center py-32">
          <div className="glass-card rounded-[40px] p-16 text-center relative overflow-hidden border-white/15 max-w-4xl">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

            <CountdownTimer />

            <h1 className="text-6xl font-bold leading-tight mb-6 font-display">
              Master your Exams with
              <br />
              <span className="text-gradient">AI-Powered Precision</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Personalized-study plans. Real-time feedback. Guaranteed success.
            </p>

            <Link
              href={isSignedIn ? '/dashboard' : '/sign-up'}
              className="cta-button bg-gradient-to-r from-neon-blue to-neon-purple text-white px-12 py-4 rounded-full font-semibold text-lg shadow-lg shadow-purple-500/40 hover:scale-105 hover:shadow-purple-500/60 transition-all duration-300 flex items-center gap-3 mx-auto"
            >
              {isSignedIn ? 'Go to Dashboard' : 'Start Free Practice'}
              <i className="fa-solid fa-arrow-right" />
            </Link>

            <div className="mt-16 flex flex-col items-center gap-4">
              <div className="flex justify-center -space-x-4">
                <Image
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=1"
                  alt="User"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full border-2 border-background"
                />
                <Image
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=2"
                  alt="User"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full border-2 border-background"
                />
                <Image
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=3"
                  alt="User"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full border-2 border-background"
                />
              </div>
            </div>
            <span className="text-sm text-muted-foreground">
              Join 50,000+ Students
            </span>
          </div>
        </section>

        <Ticker />
        <FeaturesGrid />
        <QuizDemo />
      </main >

      <Footer />
    </>
  );
}

function Footer() {
  return (
    <footer className="glass-panel mt-16 py-10 border-t border-white/10">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="logo-text text-xl font-bold">
                Deploy <i className="fa-solid fa-rocket" />
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Master your exams with AI-powered precision. Personalized study plans and real-time feedback.
            </p>
            <div className="flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <i className="fa-brands fa-twitter" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <i className="fa-brands fa-facebook" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <i className="fa-brands fa-instagram" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <i className="fa-brands fa-linkedin" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/practice" className="hover:text-white transition-colors">
                  Practice
                </Link>
              </li>
              <li>
                <Link href="/dashboard/leaderboard" className="hover:text-white transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/settings" className="hover:text-white transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Study Guides
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Deploy. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
