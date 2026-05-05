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
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' ? Notification.permission : 'default'
  );

  const saveTokenToFirestore = useCallback(async (fcmToken: string) => {
    if (!user?.uid || !firestore) return;

    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        fcmTokens: arrayUnion(fcmToken),
        notificationsEnabled: true,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      console.log('FCM Token saved to Firestore');
    } catch (error) {
      console.error('Error saving FCM token to Firestore:', error);
    }
  }, [user?.uid, firestore]);

  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined') return;

    try {
      const status = await Notification.requestPermission();
      setPermission(status);

      if (status === 'granted') {
        const messagingSupported = await isSupported();
        if (!messagingSupported) {
          console.warn('Messaging not supported in this browser');
          return;
        }

        const messaging = getMessaging(firebaseApp);
        const currentToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
        });

        if (currentToken) {
          setToken(currentToken);
          await saveTokenToFirestore(currentToken);
          toast.success('Notifications enabled!');
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      } else {
        toast.error('Notification permission denied');
      }
    } catch (error) {
      console.error('An error occurred while retrieving token:', error);
      toast.error('Failed to enable notifications');
    }
  }, [firebaseApp, saveTokenToFirestore]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const setupForegroundListener = async () => {
      const messagingSupported = await isSupported();
      if (!messagingSupported) return;

      const messaging = getMessaging(firebaseApp);
      
      // Auto-save token if permission already granted
      if (Notification.permission === 'granted' && user?.uid) {
        getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY })
          .then(currentToken => {
            if (currentToken) {
              setToken(currentToken);
              saveTokenToFirestore(currentToken);
            }
          })
          .catch(err => console.error('Auto-save token failed:', err));
      }

      const unsubscribe = onMessage(messaging, (payload) => {

        console.log('Message received in foreground: ', payload);
        toast(payload.notification?.title || 'Nestil Pro', {
          description: payload.notification?.body,
          action: payload.data?.url ? {
            label: 'View',
            onClick: () => window.open(payload.data?.url, '_blank')
          } : undefined
        });
      });

      return unsubscribe;
    };

    let unsubscribe: (() => void) | undefined;
    setupForegroundListener().then(unsub => unsubscribe = unsub);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [firebaseApp]);

  return {
    token,
    permission,
    requestPermission,
    isSupported: typeof window !== 'undefined' ? !!('serviceWorker' in navigator && 'PushManager' in window) : false
  };
}
