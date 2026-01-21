import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Calendar, Loader2, Car, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import RideCard from "@/components/RideCard";
import { toast } from "sonner";

// Mock data
const generateMockRides = (userId: string) => [
  {
    _id: "ride1",
    pickupName: "Main Gate",
    dropoffName: "MGH",
    scheduledTime: new Date(Date.now() + 3600000).toISOString(),
    status: "scheduled",
    passengers: [{ _id: userId, name: "You" }],
    carAssigned: { carName: "Campus Car 1", registrationNumber: "CA-01" },
    createdBy: { _id: userId },
  },
  {
    _id: "ride2",
    pickupName: "Bh3",
    dropoffName: "Yadav Canteen",
    scheduledTime: new Date(Date.now() - 86400000).toISOString(),
    status: "completed",
    passengers: [
      { _id: userId, name: "You" },
      { _id: "p2", name: "Bob" },
    ],
    carAssigned: { carName: "Campus Car 2", registrationNumber: "CA-02" },
    createdBy: { _id: "p2" },
  },
  {
    _id: "ride3",
    pickupName: "Verka",
    dropoffName: "Guest House",
    scheduledTime: new Date(Date.now() + 7200000).toISOString(),
    status: "pending",
    passengers: [{ _id: userId, name: "You" }],
    createdBy: { _id: userId },
  },
];

const MyRidesPage = () => {
  const navigate = useNavigate();
  const [rides, setRides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("campusRideUser") || "null");

  useEffect(() => {
    if (!user) {
      navigate("/login-student");
      return;
    }

    // Simulate fetching rides
    setTimeout(() => {
      setRides(generateMockRides(user._id));
      setIsLoading(false);
    }, 800);
  }, [navigate, user]);

  const handleCancel = async (rideId: string) => {
    if (!window.confirm("Are you sure you want to cancel this ride?")) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setRides((prev) => prev.filter((ride) => ride._id !== rideId));
      toast.success("Ride cancelled successfully.");
    } catch (err) {
      toast.error("Failed to cancel ride.");
    }
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      localStorage.removeItem("campusRideUser");
      toast.success("Account deleted.");
      navigate("/");
    }
  };

  if (!user) return null;

  const upcomingRides = rides.filter((r) =>
    ["pending", "scheduled", "en_route"].includes(r.status)
  );
  const pastRides = rides.filter((r) =>
    ["completed", "cancelled"].includes(r.status)
  );

  return (
    <div className="page-container min-h-screen">
      <Header />

      <main className="content-container">
        <div className="mb-8 animate-fade-up">
          <h1 className="section-title">My Rides</h1>
          <p className="section-subtitle">
            Track your upcoming rides and review past trips.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : rides.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border animate-fade-up">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No rides yet</h3>
            <p className="text-muted-foreground text-sm mb-6">
              You haven't booked any rides yet.
            </p>
            <Link to="/book">
              <Button className="btn-primary-gradient">Book Your First Ride</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Upcoming Rides */}
            {upcomingRides.length > 0 && (
              <section className="animate-fade-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="font-display font-bold text-xl">
                    Upcoming Rides
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingRides.map((ride, index) => (
                    <div
                      key={ride._id}
                      className="animate-fade-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <RideCard
                        ride={ride}
                        userId={user._id}
                        onCancel={handleCancel}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Past Rides */}
            {pastRides.length > 0 && (
              <section className="animate-fade-up" style={{ animationDelay: "200ms" }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <Car className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h2 className="font-display font-bold text-xl text-muted-foreground">
                    Past Rides
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pastRides.map((ride, index) => (
                    <div
                      key={ride._id}
                      className="opacity-70"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <RideCard
                        ride={ride}
                        userId={user._id}
                        showActions={false}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Account Management */}
            <section className="pt-8 border-t border-border">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <h3 className="font-semibold text-destructive">Danger Zone</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteAccount}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyRidesPage;
