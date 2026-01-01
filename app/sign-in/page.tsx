"use client";

import { BackgroundBlobs } from '@/components/layout/background-blobs';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn(email, password);
    if (res.error) {
      setError(res.error);
    }
    setLoading(false);
  };

  return (
    <>
      <BackgroundBlobs />

      <div className="min-h-screen flex items-center justify-center md:p-4">
        <div className="glass-card rounded-3xl py-8 md:p-8 w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-white">Welcome Back</h2>
            <p className="text-muted-foreground">
              Crush JAMB with Surgical Precision
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 px-4">
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                placeholder="Enter your password"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-neon-blue to-neon-purple text-white py-3 rounded-full font-semibold shadow-lg shadow-purple-500/40 hover:scale-105 transition-all duration-300"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0a0a0a] px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-full py-6 flex items-center justify-center gap-3 transition-all duration-300"
              onClick={() => window.location.href = '/api/auth/google'}
            >
              <svg className="h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
              Google
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm mb-4">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-neon-blue hover:text-neon-blue/80">
                Sign up
              </Link>
            </p>
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
