// Firestore Database Service
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "./config";

export const db = getFirestore(firebaseApp);

// User types
export interface UserProfile {
  email: string;
  displayName: string;
  role: "student" | "driver" | "admin";
  phone?: string;
  createdAt: string;
  photoURL?: string;
}

// Ride types
export interface Ride {
  id?: string;
  pickupLocation: { lat: number; lng: number };
  dropoffLocation: { lat: number; lng: number };
  pickupName: string;
  dropoffName: string;
  scheduledTime: string;
  status: "pending" | "scheduled" | "en-route" | "completed" | "cancelled";
  createdBy: string;
  passengers: string[];
  carAssigned?: string;
  driverAssigned?: string;
  currentLocation?: { lat: number; lng: number };
  createdAt?: any;
  updatedAt?: any;
}

// Pool types
export interface Pool {
  id?: string;
  name: string;
  route: string;
  departureTime: string;
  capacity: number;
  passengers: string[];
  createdBy: string;
  status: "open" | "full" | "departed";
  createdAt?: any;
}

// Notification types
export interface Notification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: "ride" | "pool" | "system" | "alert";
  read: boolean;
  createdAt?: any;
  data?: any;
}

// Car types
export interface Car {
  id?: string;
  carName: string;
  registrationNumber: string;
  capacity: number;
  driverAssigned?: string;
  status: "available" | "in-use" | "maintenance";
  createdAt?: any;
}

// ============ USER OPERATIONS ============

export const createUserProfile = async (userId: string, profile: UserProfile) => {
  try {
    await setDoc(doc(db, "users", userId), {
      ...profile,
      createdAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const docSnap = await getDoc(doc(db, "users", userId));
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    await updateDoc(doc(db, "users", userId), updates);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// ============ RIDE OPERATIONS ============

export const createRide = async (ride: Omit<Ride, "id">) => {
  try {
    const docRef = await addDoc(collection(db, "rides"), {
      ...ride,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

export const getRide = async (rideId: string): Promise<Ride | null> => {
  try {
    const docSnap = await getDoc(doc(db, "rides", rideId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Ride;
    }
    return null;
  } catch (error) {
    console.error("Error getting ride:", error);
    return null;
  }
};

export const getUserRides = async (userId: string): Promise<Ride[]> => {
  try {
    const q = query(
      collection(db, "rides"),
      where("createdBy", "==", userId),
      orderBy("scheduledTime", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Ride));
  } catch (error) {
    console.error("Error getting user rides:", error);
    return [];
  }
};

export const updateRide = async (rideId: string, updates: Partial<Ride>) => {
  try {
    await updateDoc(doc(db, "rides", rideId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const cancelRide = async (rideId: string) => {
  return updateRide(rideId, { status: "cancelled" });
};

// Subscribe to ride updates in real-time
export const subscribeToRide = (rideId: string, callback: (ride: Ride | null) => void) => {
  return onSnapshot(doc(db, "rides", rideId), (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as Ride);
    } else {
      callback(null);
    }
  });
};

// ============ POOL OPERATIONS ============

export const createPool = async (pool: Omit<Pool, "id">) => {
  try {
    const docRef = await addDoc(collection(db, "pools"), {
      ...pool,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

export const getAvailablePools = async (): Promise<Pool[]> => {
  try {
    const q = query(
      collection(db, "pools"),
      where("status", "==", "open"),
      orderBy("departureTime", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Pool));
  } catch (error) {
    console.error("Error getting pools:", error);
    return [];
  }
};

export const joinPool = async (poolId: string, userId: string) => {
  try {
    const poolDoc = await getDoc(doc(db, "pools", poolId));
    if (!poolDoc.exists()) {
      return { error: "Pool not found" };
    }
    
    const pool = poolDoc.data() as Pool;
    if (pool.passengers.includes(userId)) {
      return { error: "Already joined this pool" };
    }
    
    if (pool.passengers.length >= pool.capacity) {
      return { error: "Pool is full" };
    }
    
    await updateDoc(doc(db, "pools", poolId), {
      passengers: [...pool.passengers, userId],
      status: pool.passengers.length + 1 >= pool.capacity ? "full" : "open",
    });
    
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// ============ NOTIFICATION OPERATIONS ============

export const createNotification = async (notification: Omit<Notification, "id">) => {
  try {
    const docRef = await addDoc(collection(db, "notifications"), {
      ...notification,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Notification));
  } catch (error) {
    console.error("Error getting notifications:", error);
    return [];
  }
};

export const markNotificationRead = async (notificationId: string) => {
  try {
    await updateDoc(doc(db, "notifications", notificationId), { read: true });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const subscribeToNotifications = (userId: string, callback: (notifications: Notification[]) => void) => {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const notifications = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Notification));
    callback(notifications);
  });
};

// ============ CAR OPERATIONS ============

export const getAllCars = async (): Promise<Car[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "cars"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Car));
  } catch (error) {
    console.error("Error getting cars:", error);
    return [];
  }
};

export const createCar = async (car: Omit<Car, "id">) => {
  try {
    const docRef = await addDoc(collection(db, "cars"), {
      ...car,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

export const updateCar = async (carId: string, updates: Partial<Car>) => {
  try {
    await updateDoc(doc(db, "cars", carId), updates);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const deleteCar = async (carId: string) => {
  try {
    await deleteDoc(doc(db, "cars", carId));
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};
