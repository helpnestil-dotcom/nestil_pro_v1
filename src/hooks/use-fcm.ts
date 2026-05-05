'use client';

import { useState, useEffect, useCallback } from 'react';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';

import { useFirebaseApp, useUser, useFirestore } from '@/firebase';
import { toast } from 'sonner';

export function useFCM() {
  const firebaseApp = useFirebaseApp();
  const firestore = useFirestore();
  const { user } = useUser();
  const [token, setToken] = useState<string | null>(null);
  const [isSupportedState, setIsSupportedState] = useState<boolean | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' ? Notification.permission : 'default'
  );

  // Check support on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      isSupported().then(setIsSupportedState);
    }
  }, []);

  const saveTokenToFirestore = useCallback(async (fcmToken: string) => {
    if (!user?.uid || !firestore) return;

    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        fcmTokens: arrayUnion(fcmToken),
        notificationsEnabled: true,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      console.log('FCM Token successfully synced to Firestore');
    } catch (error) {
      console.error('Error saving FCM token to Firestore:', error);
    }
  }, [user?.uid, firestore]);

  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || isSupportedState === false) {
      toast.error('Notifications are not supported on this browser.');
      return;
    }

    try {
      console.log('Requesting notification permission...');
      const status = await Notification.requestPermission();
      setPermission(status);

      if (status === 'granted') {
        // Register service worker explicitly for better reliability
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/'
        });
        console.log('Service Worker registered:', registration);

        const messaging = getMessaging(firebaseApp);
        const currentToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration
        });

        if (currentToken) {
          setToken(currentToken);
          await saveTokenToFirestore(currentToken);
          toast.success('Push notifications activated! 🔔');
        } else {
          console.warn('No registration token available. User might need to re-authorize.');
          toast.error('Could not generate notification token.');
        }
      } else {
        toast.error('Notification permission denied. Please enable it in browser settings.');
      }
    } catch (error: any) {
      console.error('FCM Registration Error:', error);
      if (error.code === 'messaging/permission-blocked') {
        toast.error('Notification permission blocked. Please reset site permissions.');
      } else {
        toast.error('Failed to enable notifications: ' + (error.message || 'Unknown error'));
      }
    }
  }, [firebaseApp, saveTokenToFirestore, isSupportedState]);

  useEffect(() => {
    if (typeof window === 'undefined' || !isSupportedState) return;

    const setupForegroundListener = async () => {
      const messaging = getMessaging(firebaseApp);
      
      // Auto-save token if permission already granted
      if (Notification.permission === 'granted' && user?.uid) {
        try {
          const registration = await navigator.serviceWorker.ready;
          const currentToken = await getToken(messaging, { 
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: registration
          });
          
          if (currentToken) {
            setToken(currentToken);
            saveTokenToFirestore(currentToken);
          }
        } catch (err) {
          console.error('FCM Auto-save failed:', err);
        }
      }

      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Push message received (foreground):', payload);
        toast(payload.notification?.title || 'Nestil Update', {
          description: payload.notification?.body,
          action: payload.data?.url ? {
            label: 'View',
            onClick: () => window.open(payload.data?.url, '_blank')
          } : undefined,
          duration: 10000,
        });
      });

      return unsubscribe;
    };

    let unsubscribe: (() => void) | undefined;
    setupForegroundListener().then(unsub => unsubscribe = unsub);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [firebaseApp, user?.uid, isSupportedState, saveTokenToFirestore]);

  return {
    token,
    permission,
    requestPermission,
    isSupported: isSupportedState ?? (typeof window !== 'undefined' ? !!('serviceWorker' in navigator && 'PushManager' in window) : false)
  };
}
