// app/sign-up/[[...sign-up]]/page.tsx
'use client';

import { BackgroundBlobs } from '@/components/layout/background-blobs';
import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <>
      <BackgroundBlobs />

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card rounded-3xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Join PassRoute</h2>
            <p className="text-muted-foreground">
              Sign up to get started
            </p>
          </div>

          <SignUp
            appearance={{
              elements: {
                rootBox: 'w-full flex justify-center',
                card: 'bg-transparent shadow-none text-white',
                headerTitle: 'text-white text-2xl font-bold',
                headerSubtitle: 'text-white',
                socialButtonsBlockButton:
                  'bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors',
                socialButtonsBlockButtonText: 'text-white/80',
                formButtonPrimary:
                  'w-full bg-gradient-to-r from-neon-blue to-neon-purple text-white py-3 rounded-full font-semibold shadow-lg shadow-purple-500/40 hover:scale-105 transition-all duration-300',
                formFieldInput:
                  'bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,240,255,0.2)]',
                formFieldLabel: 'text-white',
                footerActionLink: 'text-neon-blue hover:text-neon-blue/80',
              },
            }}
          />

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-muted-foreground text-sm hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-arrow-left" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
