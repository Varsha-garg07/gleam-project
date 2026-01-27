// Firebase Configuration
// Replace these values with your Firebase project credentials from Firebase Console
// Go to: Firebase Console > Project Settings > Your Apps > Web App

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
};

// Initialize Firebase (prevent multiple initializations)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);

// Initialize messaging (only in browser with service worker support)
export const initMessaging = async () => {
  try {
    const supported = await isSupported();
    if (supported) {
      return getMessaging(app);
    }
    console.log("Firebase Messaging is not supported in this environment");
    return null;
  } catch (error) {
    console.error("Error initializing Firebase Messaging:", error);
    return null;
  }
};

export default app;
