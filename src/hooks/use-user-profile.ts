
'use client';

import { useMemo } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useDoc } from './use-doc';
import type { User as UserProfile } from '@/lib/types';

/**
 * Hook to fetch the custom Firestore user profile based on the authenticated user's UID.
 */
export function useUserProfile() {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemo(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile, isLoading: isDocLoading, error } = useDoc<UserProfile>(userDocRef);

  return {
    profile,
    isLoading: isAuthLoading || isDocLoading,
    error,
    user // Also return the original firebase user for convenience
  };
}
