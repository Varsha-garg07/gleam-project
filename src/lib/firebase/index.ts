// Firebase Services - Central Export
// Import from this file for all Firebase functionality

// App configuration
export { firebaseApp } from "./config";

// Authentication
export {
  signUp,
  signIn,
  signInWithGoogle,
  logOut,
  resetPassword,
  onAuthChange,
  getCurrentUser,
} from "./auth";

// Firestore Database
export {
  // Types
  type UserProfile,
  type Ride,
  type Pool,
  type Notification,
  type Car,
  // User operations
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  // Ride operations
  createRide,
  getRide,
  getUserRides,
  updateRide,
  cancelRide,
  subscribeToRide,
  // Pool operations
  createPool,
  getAvailablePools,
  joinPool,
  // Notification operations
  createNotification,
  getUserNotifications,
  markNotificationRead,
  subscribeToNotifications,
  // Car operations
  getAllCars,
  createCar,
  updateCar,
  deleteCar,
} from "./firestore";

// Realtime Database (Live Tracking)
export {
  type LocationData,
  type LiveRide,
  updateDriverLocation,
  startLiveRide,
  endLiveRide,
  subscribeToLiveRide,
  subscribeToDriverLocation,
  updateETA,
  setDriverOnline,
  subscribeToDriverStatus,
  getDriverActiveRides,
} from "./realtime";

// Cloud Messaging (Push Notifications)
export {
  initializeMessaging,
  requestNotificationPermission,
  onForegroundMessage,
  saveFCMToken,
  sendNotificationToUser,
  createTypedNotification,
  type NotificationType,
} from "./messaging";
