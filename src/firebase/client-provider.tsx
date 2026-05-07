'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

/**
 * Client-side provider that initializes Firebase services and provides them to the application.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null);

  const firebaseServices = useMemo(() => {
    try {
      return initializeFirebase();
    } catch (err: any) {
      console.error("Firebase initialization failed:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCF8F5] p-6 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-black text-slate-900">Connection Error</h1>
          <p className="text-slate-600 font-medium">
            We're having trouble connecting to our services. This might be due to a poor connection or browser restrictions.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20"
          >
            Try Refreshing
          </button>
        </div>
      </div>
    );
  }

  if (!firebaseServices) return null;

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}