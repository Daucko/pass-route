// components/layout/navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

export function Navbar() {
  const { isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 w-[95%] md:w-[90%] max-w-7xl z-50 glass-panel rounded-full px-4 md:px-8 py-[3px] shadow-lg">
        <div className="flex items-center justify-between">
          {/* App Logo */}
          <Link href="/">
            <Image
              src="/pass-route-logo.png"
              alt="logo"
              width={170}
              height={150}
              className="object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
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

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-white hover:text-neon-blue transition-colors"
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon
              icon={mobileMenuOpen ? faTimes : faBars}
              className="text-2xl"
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed top-24 right-4 left-4 glass-card rounded-3xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-4">
              <Link
                href="#features"
                className="text-white text-lg py-3 px-4 rounded-xl hover:bg-white/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#demo"
                className="text-white text-lg py-3 px-4 rounded-xl hover:bg-white/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it works
              </Link>
              <span className="text-white text-lg py-3 px-4 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                Pricing
              </span>

              <div className="border-t border-white/10 my-2"></div>

              {isSignedIn ? (
                <div className="flex items-center gap-4 py-3 px-4">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: 'w-10 h-10',
                      },
                    }}
                  />
                  <span className="text-white">Account</span>
                </div>
              ) : (
                <Link
                  href="/sign-in"
                  className="bg-gradient-to-r from-neon-blue to-neon-purple text-white px-6 py-3 rounded-full font-semibold text-center hover:shadow-lg hover:shadow-purple-500/40 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
