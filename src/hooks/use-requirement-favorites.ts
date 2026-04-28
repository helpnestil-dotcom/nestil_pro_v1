'use client';

import React, { useMemo, useCallback } from 'react';
import { useToast } from './use-toast';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { doc, setDoc, deleteDoc, collection } from 'firebase/firestore';
import { ToastAction } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';

export function useRequirementFavorites() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const favoritesColRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/requirement_favorites`);
  }, [firestore, user]);

  const { data: favoriteDocs, isLoading: isLoadingFavorites } = useCollection(favoritesColRef);

  const favoriteIds = useMemo(() => {
    if (!favoriteDocs) return new Set<string>();
    return new Set(favoriteDocs.map(doc => doc.id));
  }, [favoriteDocs]);

  const toggleFavorite = useCallback(async (requirementId: string, isCurrentlyFavorited: boolean) => {
    if (!user) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to save requirements.',
        action: React.createElement(
          ToastAction,
          { asChild: true, altText: 'Login' },
          React.createElement(
            Button,
            {
              variant: 'outline',
              size: 'sm',
              onClick: () => router.push(`/login?redirect=/requirements`),
            },
            'Login'
          )
        ),
      });
      return;
    }
    if (!firestore) return;

    const favoriteDocRef = doc(firestore, `users/${user.uid}/requirement_favorites`, requirementId);

    try {
      if (isCurrentlyFavorited) {
        await deleteDoc(favoriteDocRef);
        toast({ title: 'Removed from Saved Requirements' });
      } else {
        await setDoc(favoriteDocRef, { requirementId, addedAt: new Date() });
        toast({ title: 'Saved to Requirements' });
      }
    } catch (error: any) {
      console.error("Error toggling requirement favorite:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not update your saved requirements.',
      });
    }
  }, [user, firestore, toast, router]);

  return { favoriteIds, toggleFavorite, isLoadingFavorites: isUserLoading || isLoadingFavorites };
}
