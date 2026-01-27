// Notification Store - Context for managing in-app notifications
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  subscribeToNotifications,
  markNotificationRead,
  Notification,
  onAuthChange,
} from "@/lib/firebase";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  showNotification: (
    title: string,
    message: string,
    type?: "success" | "error" | "info" | "warning"
  ) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUserId(user?.uid || null);
    });
    return unsubscribe;
  }, []);

  // Subscribe to notifications when user is logged in
  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      return;
    }

    const unsubscribe = subscribeToNotifications(userId, (newNotifications) => {
      setNotifications(newNotifications);

      // Show toast for new unread notifications
      const unreadNew = newNotifications.filter(
        (n) =>
          !n.read &&
          !notifications.find((existing) => existing.id === n.id)
      );

      unreadNew.forEach((notification) => {
        showToast(notification.title, notification.message, notification.type);
      });
    });

    return () => unsubscribe();
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback(async (notificationId: string) => {
    await markNotificationRead(notificationId);
  }, []);

  const markAllAsRead = useCallback(async () => {
    const unreadNotifications = notifications.filter((n) => !n.read);
    await Promise.all(
      unreadNotifications.map((n) => n.id && markNotificationRead(n.id))
    );
  }, [notifications]);

  const showToast = (
    title: string,
    message: string,
    type?: "ride" | "pool" | "system" | "alert"
  ) => {
    const toastType = type === "alert" ? "warning" : type === "ride" ? "success" : "info";
    
    toast[toastType === "warning" ? "warning" : toastType === "success" ? "success" : "info"](
      title,
      {
        description: message,
        duration: 5000,
      }
    );
  };

  const showNotification = useCallback(
    (
      title: string,
      message: string,
      type: "success" | "error" | "info" | "warning" = "info"
    ) => {
      toast[type](title, {
        description: message,
        duration: 5000,
      });
    },
    []
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        showNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
