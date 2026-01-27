// Live Tracking Page for Active Rides
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, MessageCircle, Clock, MapPin, User, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import LiveTrackingMap from "@/components/LiveTrackingMap";
import { subscribeToLiveRide, LiveRide } from "@/lib/firebase/realtime";

const LiveTrackingPage: React.FC = () => {
  const { rideId } = useParams<{ rideId: string }>();
  const navigate = useNavigate();
  const [liveRide, setLiveRide] = useState<LiveRide | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demo (in real app, this comes from Firestore)
  const mockRideDetails = {
    pickupName: "Main Gate",
    dropoffName: "Central Library",
    pickupLocation: { lat: 31.3960, lng: 75.5352, name: "Main Gate" },
    dropoffLocation: { lat: 31.3962, lng: 75.5370, name: "Central Library" },
    driverName: "Raj Kumar",
    driverPhone: "+91 98765 43210",
    carName: "Swift Dzire",
    carNumber: "PB08 AB 1234",
    scheduledTime: new Date().toISOString(),
  };

  useEffect(() => {
    if (!rideId) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = subscribeToLiveRide(rideId, (data) => {
      setLiveRide(data);
      setIsLoading(false);
    });

    // For demo, set loading to false after timeout
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [rideId]);

  const getStatusMessage = () => {
    if (!liveRide) return "Waiting for driver...";
    switch (liveRide.status) {
      case "en-route":
        return liveRide.eta ? `Arriving in ${liveRide.eta} min` : "Driver is on the way";
      case "arrived":
        return "Driver has arrived!";
      case "completed":
        return "Ride completed";
      default:
        return "Tracking...";
    }
  };

  return (
    <div className="page-container min-h-screen">
      <Header />

      <main className="content-container">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="card-elevated p-0 overflow-hidden">
              <LiveTrackingMap
                rideId={rideId}
                pickupLocation={mockRideDetails.pickupLocation}
                dropoffLocation={mockRideDetails.dropoffLocation}
                showRoute={true}
                height="500px"
              />
            </div>
          </div>

          {/* Ride Details Sidebar */}
          <div className="space-y-4">
            {/* Status Card */}
            <div className="card-elevated">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-3 h-3 rounded-full ${liveRide ? "bg-success animate-pulse" : "bg-warning"}`} />
                <span className="font-semibold text-foreground">
                  {getStatusMessage()}
                </span>
              </div>

              <div className="space-y-4">
                {/* Route Info */}
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-success border-2 border-success-foreground" />
                    <div className="w-0.5 h-8 bg-gradient-to-b from-success to-accent my-1" />
                    <div className="w-3 h-3 rounded-full bg-accent border-2 border-accent-foreground" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Pickup
                      </p>
                      <p className="font-semibold text-foreground">
                        {mockRideDetails.pickupName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Drop-off
                      </p>
                      <p className="font-semibold text-foreground">
                        {mockRideDetails.dropoffName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Info Card */}
            <div className="card-elevated">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">
                Driver Details
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold">
                  {mockRideDetails.driverName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {mockRideDetails.driverName}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Car className="w-4 h-4" />
                    {mockRideDetails.carName} • {mockRideDetails.carNumber}
                  </div>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>

            {/* Trip Timeline */}
            <div className="card-elevated">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">
                Trip Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Ride Booked</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(mockRideDetails.scheduledTime).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Driver Assigned</p>
                    <p className="text-xs text-muted-foreground">
                      {mockRideDetails.driverName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${liveRide ? "bg-accent/10" : "bg-muted"}`}>
                    <MapPin className={`w-4 h-4 ${liveRide ? "text-accent" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${liveRide ? "" : "text-muted-foreground"}`}>
                      {liveRide ? "En Route" : "Waiting for pickup"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {liveRide ? "Live tracking active" : "Driver will start soon"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Info */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-sm text-primary font-medium mb-1">
                🛡️ Safety First
              </p>
              <p className="text-xs text-muted-foreground">
                Share your live location with friends and family for added safety during your ride.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LiveTrackingPage;
