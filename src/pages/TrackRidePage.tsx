import { useEffect } from "react";
import Header from "@/components/Header";
import LiveTrackingMapLeaflet from "@/components/LiveTrackingMapLeaflet";
import { startDriverSimulation } from "@/lib/locationSimulator";

const TrackRidePage = () => {
  useEffect(() => {
    startDriverSimulation("car_1");
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <LiveTrackingMapLeaflet rideId="car_1" height="calc(100vh - 64px)" />
    </div>
  );
};

export default TrackRidePage;
