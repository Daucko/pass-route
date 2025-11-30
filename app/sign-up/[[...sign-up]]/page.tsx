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
            <h2 className="text-3xl font-bold mb-2">Join UTME.AI</h2>
            <p className="text-muted-foreground">
              Start your journey to success
            </p>
          </div>

          <SignUp
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-transparent shadow-none',
                headerTitle: 'text-white text-2xl font-bold',
                headerSubtitle: 'text-muted-foreground',
                socialButtonsBlockButton:
                  'bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors',
                socialButtonsBlockButtonText: 'text-white',
                formButtonPrimary:
                  'bg-gradient-to-r from-neon-blue to-neon-purple text-white py-3 rounded-full font-semibold shadow-lg shadow-purple-500/40 hover:scale-105 transition-all duration-300',
                formFieldInput:
                  'bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,240,255,0.2)]',
                footerActionLink: 'text-neon-blue hover:text-neon-blue/80',
              },
            }}
            routing="hash"
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
