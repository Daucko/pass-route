"use client";

import { BackgroundBlobs } from '@/components/layout/background-blobs';
import React, { useState, useRef, useEffect, Suspense, type KeyboardEvent, type ClipboardEvent, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/providers/auth-provider';

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailParam = searchParams.get('email');

    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const { signIn } = useAuth(); // We might not need this if API sets cookie, but context sync needed

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newCode = [...code];
        pastedData.split('').forEach((char, index) => {
            if (index < 6) newCode[index] = char;
        });
        setCode(newCode);
        inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const fullCode = code.join("");
        if (fullCode.length !== 6) {
            setError("Please enter the full 6-digit code");
            setLoading(false);
            return;
        }

        if (!emailParam) {
            setError("Email missing from URL. Please sign up again.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailParam, code: fullCode }),
            });

            const data = await res.json();

            if (res.ok) {
                // Force refresh auth context (refresh page or custom method)
                // Since cookie is set, a page reload or router push should trigger context update if implemented right
                // But our context currently only fetches on mount. 
                // We'll redirect to dashboard which triggers a route change, but context mount happens on layout.
                // Best to just force hard reload or window.location.href
                window.location.href = "/dashboard";
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <BackgroundBlobs />

            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="glass-card rounded-3xl p-8 w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 text-center">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold mb-2 text-white">Verify Email</h2>
                        <p className="text-muted-foreground">
                            We sent a code to <span className="text-neon-blue">{emailParam}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <div className="text-red-500 text-sm">{error}</div>}

                        <div className="flex justify-center gap-2" onPaste={handlePaste}>
                            {code.map((digit, index) => (
                                <Input
                                    key={index}
                                    ref={(el) => { if (el) inputRefs.current[index] = el }}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-14 text-center text-2xl bg-white/5 border-white/10 focus:border-neon-blue focus:shadow-neon-blue/20"
                                />
                            ))}
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-neon-blue to-neon-purple text-white py-3 rounded-full font-semibold shadow-lg shadow-purple-500/40 hover:scale-105 transition-all duration-300"
                        >
                            {loading ? "Verifying..." : "Verify Code"}
                        </Button>

                        <p className="text-sm text-muted-foreground mt-4">
                            Didn't receive code? <button type="button" className="text-neon-blue hover:underline" onClick={() => alert("Resend feature to be implemented")}>Resend</button>
                        </p>
                    </form>
                </div >
            </div >
        </>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}
