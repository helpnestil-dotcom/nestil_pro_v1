
'use client';

import { useState, useEffect } from 'react';
import {
  Query,
  onSnapshot,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  CollectionReference,
} from 'firebase/firestore';
import { useUser, errorEmitter, FirestorePermissionError } from '@/firebase';

export type WithId<T> = T & { id: string };

export interface UseCollectionResult<T> {
  data: WithId<T>[] | null;
  isLoading: boolean;
  error: FirestoreError | null;
}

// This hook is no longer used by the admin page, but is kept for other parts of the app.
export function useCollection<T = any>(
  query: Query<DocumentData> | null
): UseCollectionResult<T> {
  const { isUserLoading } = useUser();
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (isUserLoading) {
        setIsLoading(true);
        return;
    }
    if (!query) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);

    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const results: WithId<T>[] = snapshot.docs.map((doc) => ({
          ...(doc.data() as T),
          id: doc.id,
        }));
        setData(results);
        setError(null);
        setIsLoading(false);
      },
      (err: FirestoreError) => {
        if (err.code === 'permission-denied') {
          // The query object might be a CollectionReference, which has a path.
          // We cast to 'any' to access it, providing a fallback for other query types.
          const path = (query as any).path || 'unknown_collection';
          errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
              path: path,
              operation: 'list',
            })
          );
        } else {
          console.error('useCollection error:', err);
        }
        setError(err);
        setData(null);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query, isUserLoading]);

  return { data, isLoading: isLoading || isUserLoading, error };
}
