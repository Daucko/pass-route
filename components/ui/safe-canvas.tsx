// components/ui/safe-canvas.tsx
"use client";

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Canvas with no SSR to avoid server-side issues
const Canvas = dynamic(() => import('@react-three/fiber').then((mod) => mod.Canvas), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-transparent" />,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SafeCanvas = ({ children, ...props }: any) => {
    return (
        <Canvas {...props}>
            <Suspense fallback={null}>
                {children}
            </Suspense>
        </Canvas>
    );
};
