// Firebase Cloud Messaging (FCM) Service
// For push notifications

import { getToken, onMessage, Messaging } from "firebase/messaging";
import { initMessaging } from "./config";
import { createNotification } from "./firestore";

// VAPID Key from Firebase Console > Project Settings > Cloud Messaging > Web Push certificates
// You need to generate this in your Firebase Console
const VAPID_KEY = "YOUR_VAPID_KEY";

let messaging: Messaging | null = null;

// Initialize messaging
export const initializeMessaging = async () => {
  if (messaging) return messaging;
  messaging = await initMessaging();
  return messaging;
};

// Request permission and get FCM token
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    const fcm = await initializeMessaging();
    if (!fcm) {
      console.log("FCM not supported");
      return null;
    }

    // Get registration token
    const token = await getToken(fcm, { vapidKey: VAPID_KEY });
    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

// Listen for foreground messages
export const onForegroundMessage = (callback: (payload: any) => void) => {
  return new Promise<(() => void) | null>(async (resolve) => {
    const fcm = await initializeMessaging();
    if (!fcm) {
      resolve(null);
      return;
    }

    const unsubscribe = onMessage(fcm, (payload) => {
      console.log("Foreground message received:", payload);
      callback(payload);
    });

    resolve(unsubscribe);
  });
};

// Save FCM token to user profile (call after login)
export const saveFCMToken = async (userId: string, token: string) => {
  // This would typically update the user's document in Firestore
  // to store their FCM token for sending targeted notifications
  const { doc, updateDoc } = await import("firebase/firestore");
  const { db } = await import("./config");
  
  try {
    await updateDoc(doc(db, "users", userId), {
      fcmToken: token,
      fcmTokenUpdatedAt: new Date().toISOString(),
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Send notification to specific user (this would typically be done server-side)
// For client-side, we'll create a notification document that can trigger a Cloud Function
export const sendNotificationToUser = async (
  userId: string,
  title: string,
  message: string,
  type: "ride" | "pool" | "system" | "alert" = "system",
  data?: any
) => {
  return createNotification({
    userId,
    title,
    message,
    type,
    read: false,
    data,
  });
};

// Notification types for the app
export type NotificationType = 
  | "ride_accepted"
  | "ride_started"
  | "ride_completed"
  | "driver_arriving"
  | "pool_joined"
  | "pool_departed"
  | "system_update";

// Helper to create typed notifications
export const createTypedNotification = async (
  userId: string,
  notificationType: NotificationType,
  customData?: any
) => {
  const notificationContent = getNotificationContent(notificationType, customData);
  return sendNotificationToUser(
    userId,
    notificationContent.title,
    notificationContent.message,
    notificationContent.type,
    { notificationType, ...customData }
  );
};

// Get notification content based on type
const getNotificationContent = (type: NotificationType, data?: any) => {
  const contents: Record<NotificationType, { title: string; message: string; type: "ride" | "pool" | "system" | "alert" }> = {
    ride_accepted: {
      title: "Ride Accepted!",
      message: data?.driverName 
        ? `${data.driverName} has accepted your ride request.`
        : "Your ride request has been accepted.",
      type: "ride",
    },
    ride_started: {
      title: "Ride Started",
      message: "Your driver is on the way. Track your ride in real-time.",
      type: "ride",
    },
    ride_completed: {
      title: "Ride Completed",
      message: "You've arrived at your destination. Thanks for riding!",
      type: "ride",
    },
    driver_arriving: {
      title: "Driver Arriving Soon!",
      message: data?.eta 
        ? `Your driver will arrive in ${data.eta} minutes.`
        : "Your driver is almost there!",
      type: "alert",
    },
    pool_joined: {
      title: "Pool Joined!",
      message: data?.poolName 
        ? `You've joined the ${data.poolName} pool.`
        : "You've successfully joined the pool.",
      type: "pool",
    },
    pool_departed: {
      title: "Pool Departed",
      message: "Your pool has departed. Enjoy your ride!",
      type: "pool",
    },
    system_update: {
      title: "System Update",
      message: data?.message || "There's an update to the CampusRide app.",
      type: "system",
    },
  };

  return contents[type];
};
