import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  Users,
  Clock,
  MapPin,
  Loader2,
  CheckCircle,
  XCircle,
  KeyRound,
  Unlock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { toast } from "sonner";
import { auth } from "@/lib/firebase/auth";

// Mock data
const generateMockRequests = () => [
  {
    _id: "req1",
    pickupName: "Main Gate",
    dropoffName: "MGH",
    scheduledTime: new Date(Date.now() + 3600000).toISOString(),
    passengers: [
      { _id: "p1", name: "Alice" },
      { _id: "p2", name: "Bob" },
    ],
    status: "pending",
  },
  {
    _id: "req2",
    pickupName: "Bh3",
    dropoffName: "Yadav Canteen",
    scheduledTime: new Date(Date.now() + 7200000).toISOString(),
    passengers: [{ _id: "p3", name: "Charlie" }],
    status: "pending",
  },
];

const DriverDashboard = () => {
  const navigate = useNavigate();

  const [car, setCar] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔐 AUTH CHECK — FIREBASE ONLY
  useEffect(() => {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      navigate("/login-driver", { replace: true });
      return;
    }

    // Simulate fetching data
    setTimeout(() => {
      setRequests(generateMockRequests());
      setIsLoading(false);
    }, 800);
  }, [navigate]);

  const handleTakeCar = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCar({
        carName: "Campus Car 1",
        registrationNumber: "CA-01",
        capacity: 6,
      });
      toast.success("Car assigned successfully!");
    } catch {
      toast.error("Failed to take car.");
    }
  };

  const handleReleaseCar = async () => {
    if (!window.confirm("Release this car?")) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCar(null);
      setRequests([]);
      toast.success("Car released.");
    } catch {
      toast.error("Failed to release car.");
    }
  };

  const handleApprove = async (rideId: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setRequests((prev) => prev.filter((r) => r._id !== rideId));
      toast.success("Ride approved!");
    } catch {
      toast.error("Failed to approve ride.");
    }
  };

  const handleReject = async (rideId: string) => {
    if (!window.confirm("Reject this ride request?")) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setRequests((prev) => prev.filter((r) => r._id !== rideId));
      toast.success("Ride rejected.");
    } catch {
      toast.error("Failed to reject ride.");
    }
  };

  return (
    <div className="page-container min-h-screen">
      <Header />

      <main className="content-container">
        <div className="mb-8 animate-fade-up">
          <h1 className="section-title">Driver Dashboard</h1>
          <p className="section-subtitle">
            Manage your car assignment and approve ride requests.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Car Assignment */}
            <div className="lg:col-span-1">
              <div className="card-elevated sticky top-24 animate-slide-in-left">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-success flex items-center justify-center">
                    <Car className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg">Your Car</h2>
                    <p className="text-sm text-muted-foreground">
                      {car ? "Currently assigned" : "No car assigned"}
                    </p>
                  </div>
                </div>

                {!car ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center mb-4">
                      <KeyRound className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Take a car to start receiving ride requests.
                    </p>
                    <Button onClick={handleTakeCar} className="btn-accent-gradient">
                      <KeyRound className="w-5 h-5 mr-2" />
                      Take Car
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-success/10 border border-accent/20 mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                          <Car className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold">{car.carName}</p>
                          <p className="text-sm text-muted-foreground">
                            {car.registrationNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>Capacity: {car.capacity} passengers</span>
                      </div>
                    </div>

                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleReleaseCar}
                    >
                      <Unlock className="w-5 h-5 mr-2" />
                      Release Car
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Ride Requests */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg">Ride Requests</h2>
                  <p className="text-sm text-muted-foreground">
                    {requests.length} pending request
                    {requests.length !== 1 && "s"}
                  </p>
                </div>
              </div>

              {!car ? (
                <div className="text-center py-20 bg-card rounded-2xl border border-border">
                  <Car className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No car assigned</h3>
                  <p className="text-muted-foreground text-sm">
                    Take a car first to see ride requests.
                  </p>
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-2xl border border-border">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No pending requests</h3>
                  <p className="text-muted-foreground text-sm">
                    New ride requests will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request, index) => (
                    <div
                      key={request._id}
                      className="card-elevated animate-fade-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {new Date(request.scheduledTime).toLocaleString()}
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-warning/10 text-warning border border-warning/20">
                          PENDING
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-primary" />
                          <span className="font-semibold">
                            {request.pickupName}
                          </span>
                        </div>
                        <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30" />
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-accent" />
                          <span className="font-semibold">
                            {request.dropoffName}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4 p-3 rounded-lg bg-secondary/50">
                        <p className="text-sm font-medium mb-2">
                          Passengers ({request.passengers.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {request.passengers.map((p: any) => (
                            <span
                              key={p._id}
                              className="px-3 py-1 rounded-full text-sm bg-card border border-border"
                            >
                              {p.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleApprove(request._id)}
                          className="flex-1 bg-success hover:bg-success/90"
                        >
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleReject(request._id)}
                          className="flex-1"
                        >
                          <XCircle className="w-5 h-5 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DriverDashboard;
