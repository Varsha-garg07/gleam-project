import { ref, set } from "firebase/database";
import { realtimeDb } from "@/lib/firebase/realtime";

let lat = 31.395;
let lng = 75.535;

export const startDriverSimulation = (rideId: string) => {
  setInterval(() => {
    lat += (Math.random() - 0.5) * 0.0003;
    lng += (Math.random() - 0.5) * 0.0003;

    set(ref(realtimeDb, `carLocations/${rideId}`), {
      lat,
      lng,
      updatedAt: Date.now(),
    });
  }, 2000);
};
