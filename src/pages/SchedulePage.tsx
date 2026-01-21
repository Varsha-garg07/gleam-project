import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, Loader2, Play, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";

// Mock data
const generateMockSchedule = () => [
  {
    _id: "sched1",
    pickupName: "Main Gate",
    dropoffName: "MGH",
    scheduledTime: new Date(Date.now() + 3600000).toISOString(),
    status: "scheduled",
    passengers: [
      { _id: "p1", name: "Alice" },
      { _id: "p2", name: "Bob" },
    ],
  },
  {
    _id: "sched2",
    pickupName: "Bh3",
    dropoffName: "Yadav Canteen",
    scheduledTime: new Date(Date.now() + 7200000).toISOString(),
    status: "en_route",
    passengers: [{ _id: "p3", name: "Charlie" }],
  },
];

const SchedulePage = () => {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("campusRideUser") || "null");

  useEffect(() => {
    if (!user || user.role !== "driver") {
      navigate("/login-driver");
      return;
    }

    setTimeout(() => {
      setSchedule(generateMockSchedule());
      setIsLoading(false);
    }, 800);
  }, [navigate, user]);

  const handleStatusChange = async (rideId: string, status: string) => {
    if (!window.confirm(`Mark this ride as ${status}?`)) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      if (status === "completed" || status === "cancelled") {
        setSchedule((prev) => prev.filter((r) => r._id !== rideId));
      } else {
        setSchedule((prev) =>
          prev.map((r) => (r._id === rideId ? { ...r, status } : r))
        );
      }
      
      toast.success(`Ride marked as ${status}.`);
    } catch (err) {
      toast.error("Failed to update ride status.");
    }
  };

  if (!user) return null;

  return (
    <div className="page-container min-h-screen">
      <Header />

      <main className="content-container">
        <div className="mb-8 animate-fade-up">
          <h1 className="section-title">Your Schedule</h1>
          <p className="section-subtitle">
            Manage your approved rides and update their status.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : schedule.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border animate-fade-up">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No scheduled rides</h3>
            <p className="text-muted-foreground text-sm">
              Approved rides will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {schedule.map((ride, index) => (
              <div
                key={ride._id}
                className="card-elevated animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Left - Info */}
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <StatusBadge status={ride.status} />
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {new Date(ride.scheduledTime).toLocaleString()}
                      </div>
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="font-semibold">{ride.pickupName}</span>
                      </div>
                      <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30 max-w-32" />
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-accent" />
                        <span className="font-semibold">{ride.dropoffName}</span>
                      </div>
                    </div>

                    {/* Passengers */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{ride.passengers.length} passenger{ride.passengers.length !== 1 && "s"}:</span>
                      <span className="font-medium text-foreground">
                        {ride.passengers.map((p: any) => p.name).join(", ")}
                      </span>
                    </div>
                  </div>

                  {/* Right - Actions */}
                  <div className="flex flex-wrap gap-2 lg:flex-nowrap">
                    {ride.status === "scheduled" && (
                      <Button
                        onClick={() => handleStatusChange(ride._id, "en_route")}
                        className="bg-accent hover:bg-accent/90"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Ride
                      </Button>
                    )}
                    
                    {ride.status === "en_route" && (
                      <Button
                        onClick={() => handleStatusChange(ride._id, "completed")}
                        className="bg-success hover:bg-success/90"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete
                      </Button>
                    )}
                    
                    <Button
                      variant="destructive"
                      onClick={() => handleStatusChange(ride._id, "cancelled")}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SchedulePage;
