// Firebase Realtime Database Service
// Used for live location tracking with low latency updates

import {
  ref,
  set,
  get,
  update,
  remove,
  onValue,
  push,
  serverTimestamp,
  DataSnapshot,
} from "firebase/database";
import { getDatabase } from "firebase/database";
import { firebaseApp } from "./config";

export const realtimeDb = getDatabase(firebaseApp);

// Location types
export interface LocationData {
  lat: number;
  lng: number;
  timestamp: number;
  heading?: number;
  speed?: number;
}

export interface LiveRide {
  rideId: string;
  driverId: string;
  currentLocation: LocationData;
  status: "en-route" | "arrived" | "completed";
  eta?: number; // minutes
  lastUpdated: any;
}

// ============ LIVE LOCATION TRACKING ============

// Update driver's live location
export const updateDriverLocation = async (
  rideId: string,
  location: LocationData
) => {
  try {
    const locationRef = ref(realtimeDb, `liveRides/${rideId}/currentLocation`);
    await set(locationRef, {
      ...location,
      timestamp: serverTimestamp(),
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Start a live ride session
export const startLiveRide = async (
  rideId: string,
  driverId: string,
  initialLocation: LocationData
) => {
  try {
    const rideRef = ref(realtimeDb, `liveRides/${rideId}`);
    await set(rideRef, {
      rideId,
      driverId,
      currentLocation: initialLocation,
      status: "en-route",
      lastUpdated: serverTimestamp(),
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// End a live ride session
export const endLiveRide = async (rideId: string) => {
  try {
    const rideRef = ref(realtimeDb, `liveRides/${rideId}`);
    await update(rideRef, {
      status: "completed",
      lastUpdated: serverTimestamp(),
    });
    // Optionally remove after some time
    setTimeout(() => {
      remove(rideRef);
    }, 60000); // Remove after 1 minute
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Subscribe to live ride updates
export const subscribeToLiveRide = (
  rideId: string,
  callback: (data: LiveRide | null) => void
) => {
  const rideRef = ref(realtimeDb, `liveRides/${rideId}`);
  return onValue(rideRef, (snapshot: DataSnapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as LiveRide);
    } else {
      callback(null);
    }
  });
};

// Subscribe to driver's current location only
export const subscribeToDriverLocation = (
  rideId: string,
  callback: (location: LocationData | null) => void
) => {
  const locationRef = ref(realtimeDb, `liveRides/${rideId}/currentLocation`);
  return onValue(locationRef, (snapshot: DataSnapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as LocationData);
    } else {
      callback(null);
    }
  });
};

// Update ETA
export const updateETA = async (rideId: string, etaMinutes: number) => {
  try {
    const etaRef = ref(realtimeDb, `liveRides/${rideId}/eta`);
    await set(etaRef, etaMinutes);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// ============ DRIVER ONLINE STATUS ============

export const setDriverOnline = async (driverId: string, isOnline: boolean) => {
  try {
    const statusRef = ref(realtimeDb, `drivers/${driverId}/status`);
    await set(statusRef, {
      online: isOnline,
      lastSeen: serverTimestamp(),
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const subscribeToDriverStatus = (
  driverId: string,
  callback: (isOnline: boolean) => void
) => {
  const statusRef = ref(realtimeDb, `drivers/${driverId}/status/online`);
  return onValue(statusRef, (snapshot: DataSnapshot) => {
    callback(snapshot.val() ?? false);
  });
};

// ============ ACTIVE RIDES FOR DRIVER ============

export const getDriverActiveRides = async (driverId: string): Promise<LiveRide[]> => {
  try {
    const ridesRef = ref(realtimeDb, "liveRides");
    const snapshot = await get(ridesRef);
    if (snapshot.exists()) {
      const rides: LiveRide[] = [];
      snapshot.forEach((child) => {
        const ride = child.val() as LiveRide;
        if (ride.driverId === driverId && ride.status !== "completed") {
          rides.push(ride);
        }
      });
      return rides;
    }
    return [];
  } catch (error) {
    console.error("Error getting driver active rides:", error);
    return [];
  }
};
