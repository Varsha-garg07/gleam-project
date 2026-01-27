import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { ref, onValue } from "firebase/database";
import { realtimeDb } from "@/lib/firebase/realtime";
import { cabIcon } from "@/lib/cabIcon";

interface Props {
  rideId: string;
  pickupLocation?: { lat: number; lng: number };
  dropoffLocation?: { lat: number; lng: number };
  height?: string;
}

const DEFAULT_CENTER: [number, number] = [31.395, 75.535];

const LiveTrackingMapLeaflet = ({
  rideId,
  pickupLocation,
  dropoffLocation,
  height = "500px",
}: Props) => {
  const [carPos, setCarPos] = useState<[number, number]>(DEFAULT_CENTER);
  const prevPos = useRef<[number, number]>(DEFAULT_CENTER);

  useEffect(() => {
    const carRef = ref(realtimeDb, `carLocations/${rideId}`);

    return onValue(carRef, (snap) => {
      const d = snap.val();
      if (d?.lat && d?.lng) smoothMove([d.lat, d.lng]);
    });
  }, [rideId]);

  const smoothMove = (next: [number, number]) => {
    const steps = 15;
    const [lat1, lng1] = prevPos.current;
    const [lat2, lng2] = next;

    let i = 0;
    const id = setInterval(() => {
      i++;
      setCarPos([
        lat1 + ((lat2 - lat1) * i) / steps,
        lng1 + ((lng2 - lng1) * i) / steps,
      ]);

      if (i === steps) {
        clearInterval(id);
        prevPos.current = next;
      }
    }, 60);
  };

  return (
    <div style={{ height }}>
      <MapContainer
        center={carPos}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 🚖 CAB */}
        <Marker position={carPos} icon={cabIcon} />

        {/* 🧭 ROUTE (STRAIGHT LINE FOR NOW) */}
        {pickupLocation && dropoffLocation && (
          <Polyline
            positions={[
              [pickupLocation.lat, pickupLocation.lng],
              [dropoffLocation.lat, dropoffLocation.lng],
            ]}
            pathOptions={{ color: "#4f46e5", weight: 4 }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default LiveTrackingMapLeaflet;
