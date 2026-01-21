import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import StatusBadge from "@/components/StatusBadge";

// Mock data
const generateMockHistory = () => [
  {
    _id: "hist1",
    pickupName: "Main Gate",
    dropoffName: "MGH",
    scheduledTime: new Date(Date.now() - 86400000).toISOString(),
    status: "completed",
    passengers: [
      { _id: "p1", name: "Alice" },
      { _id: "p2", name: "Bob" },
    ],
  },
  {
    _id: "hist2",
    pickupName: "Bh3",
    dropoffName: "Yadav Canteen",
    scheduledTime: new Date(Date.now() - 172800000).toISOString(),
    status: "completed",
    passengers: [{ _id: "p3", name: "Charlie" }],
  },
  {
    _id: "hist3",
    pickupName: "Verka",
    dropoffName: "Guest House",
    scheduledTime: new Date(Date.now() - 259200000).toISOString(),
    status: "cancelled",
    passengers: [{ _id: "p4", name: "Diana" }],
  },
];

const DriverHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("campusRideUser") || "null");

  useEffect(() => {
    if (!user || user.role !== "driver") {
      navigate("/login-driver");
      return;
    }

    setTimeout(() => {
      setHistory(generateMockHistory());
      setIsLoading(false);
    }, 800);
  }, [navigate, user]);

  if (!user) return null;

  return (
    <div className="page-container min-h-screen">
      <Header />

      <main className="content-container">
        <div className="mb-8 animate-fade-up">
          <h1 className="section-title">Ride History</h1>
          <p className="section-subtitle">
            Review all your completed and cancelled rides.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border animate-fade-up">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No ride history</h3>
            <p className="text-muted-foreground text-sm">
              Your completed rides will appear here.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((ride, index) => (
              <div
                key={ride._id}
                className="card-elevated animate-fade-up opacity-80 hover:opacity-100 transition-opacity"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <StatusBadge status={ride.status} />
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {new Date(ride.scheduledTime).toLocaleDateString()}
                  </div>
                </div>

                {/* Route */}
                <div className="mb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <div className="w-0.5 h-6 bg-gradient-to-b from-primary to-accent my-1" />
                      <div className="w-3 h-3 rounded-full bg-accent" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="font-semibold">{ride.pickupName}</p>
                      <p className="font-semibold">{ride.dropoffName}</p>
                    </div>
                  </div>
                </div>

                {/* Passengers */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t border-border">
                  <Users className="w-4 h-4" />
                  <span>{ride.passengers.length} passenger{ride.passengers.length !== 1 && "s"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DriverHistory;
