// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
firebase.initializeApp({
  apiKey: "AIzaSyA8-9oTShBALCDtVh_ZmRSW1dtMNs-X9Uo",
  authDomain: "studio-4501973510-5ada2.firebaseapp.com",
  projectId: "studio-4501973510-5ada2",
  storageBucket: "studio-4501973510-5ada2.firebasestorage.app",
  messagingSenderId: "252611165002",
  appId: "1:252611165002:web:7ec7629a8c4e84e9b99fb3"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title || 'Nestil Pro';
  const notificationOptions = {
    body: payload.notification.body || 'New update available!',
    icon: '/logo.png', // Make sure this exists or use a default
    badge: '/logo.png',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
