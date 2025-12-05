// components/providers/user-sync-provider.tsx
'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export function UserSyncProvider({ children }: { children: React.ReactNode }) {
    const { isSignedIn, isLoaded } = useUser();

    useEffect(() => {
        const syncUser = async () => {
            if (isLoaded && isSignedIn) {
                try {
                    await fetch('/api/user/sync', { method: 'POST' });
                } catch (error) {
                    console.error('Failed to sync user:', error);
                }
            }
        };

        syncUser();
    }, [isLoaded, isSignedIn]);

    return <>{children}</>;
}
