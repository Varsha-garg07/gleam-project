import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Clock,
  Car,
} from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import LiveTrackingMapLeaflet from "@/components/LiveTrackingMapLeaflet";

const LiveTrackingPage = () => {
  const navigate = useNavigate();

  const rideId = "car_1";

  const pickup = { lat: 31.396, lng: 75.5352 };
  const dropoff = { lat: 31.3962, lng: 75.537 };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="p-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-6 mt-4">
          <div className="lg:col-span-2">
            <LiveTrackingMapLeaflet
              rideId={rideId}
              pickupLocation={pickup}
              dropoffLocation={dropoff}
            />
          </div>

          <div className="space-y-4">
            <div className="card-elevated">
              <p className="font-semibold">Driver on the way</p>
              <p className="text-sm text-muted-foreground">
                Main Gate → Central Library
              </p>
            </div>

            <div className="card-elevated">
              <p className="font-semibold">Raj Kumar</p>
              <p className="text-sm text-muted-foreground">
                Swift Dzire • PB08 AB 1234
              </p>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button variant="outline">
                  <Phone className="w-4 h-4 mr-2" /> Call
                </Button>
                <Button variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" /> Message
                </Button>
              </div>
            </div>

            <div className="card-elevated flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm">Ride started</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LiveTrackingPage;
