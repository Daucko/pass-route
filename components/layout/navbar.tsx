// components/layout/navbar.tsx
'use client';

import Link from 'next/link';
import { UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';

export function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50 glass-panel rounded-full px-8 py-[3px] shadow-lg">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Image
            src="/pass-route-logo.png"
            alt="logo"
            width={170}
            height={150}
            className="object-contain border border-red-500"
          />
        </Link>

        <div className="flex items-center gap-8">
          <Link
            href="#features"
            className="text-muted-foreground text-sm hover:text-white transition-colors hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          >
            Features
          </Link>
          <Link
            href="#demo"
            className="text-muted-foreground text-sm hover:text-white transition-colors hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          >
            How it works
          </Link>
          <span className="text-muted-foreground text-sm cursor-pointer hover:text-white transition-colors">
            Pricing
          </span>

          {isSignedIn ? (
            <div className="flex items-center gap-4">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8',
                  },
                }}
              />
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="bg-white/10 px-5 py-2 rounded-full text-white border border-white/10 hover:bg-neon-blue hover:text-black hover:shadow-neon-blue/40 transition-all duration-300"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
