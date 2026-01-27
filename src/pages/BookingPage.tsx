import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, Clock, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import PoolCard from "@/components/PoolCard";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/firebase/auth";

const CAMPUS_LOCATIONS = [
  "Main Gate",
  "Yadav Canteen",
  "Rimjhim Shop",
  "Verka",
  "MGH",
  "Gh1/Gh2",
  "Bh1",
  "Bh2",
  "Bh3",
  "Bh4",
  "Bh5",
  "Bh6",
  "Bh7",
  "MBH",
  "Guest House",
];

const MAX_CAR_CAPACITY = 6;

// Mock data for demo
const generateMockPools = () => [
  {
    _id: "pool1",
    pickupName: "Main Gate",
    dropoffName: "MGH",
    scheduledTime: new Date(Date.now() + 3600000).toISOString(),
    status: "pending",
    passengers: [
      { _id: "p1", name: "Alice" },
      { _id: "p2", name: "Bob" },
    ],
    createdBy: { _id: "p1" },
  },
  {
    _id: "pool2",
    pickupName: "Bh3",
    dropoffName: "Yadav Canteen",
    scheduledTime: new Date(Date.now() + 7200000).toISOString(),
    status: "pending",
    passengers: [{ _id: "p3", name: "Charlie" }],
    createdBy: { _id: "p3" },
  },
  {
    _id: "pool3",
    pickupName: "Verka",
    dropoffName: "Guest House",
    scheduledTime: new Date(Date.now() + 5400000).toISOString(),
    status: "pending",
    passengers: [
      { _id: "p4", name: "Diana" },
      { _id: "p5", name: "Eve" },
      { _id: "p6", name: "Frank" },
      { _id: "p7", name: "Grace" },
      { _id: "p8", name: "Henry" },
      { _id: "p9", name: "Ivy" },
    ],
    createdBy: { _id: "p4" },
  },
];

const BookingPage = () => {
  const navigate = useNavigate();
  const [pools, setPools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    pickupName: CAMPUS_LOCATIONS[0],
    dropoffName: CAMPUS_LOCATIONS[1],
    scheduledTime: "",
  });

  // Get user from localStorage
  // const user = JSON.parse(localStorage.getItem("campusRideUser") || "null");
  const user = getCurrentUser();

  useEffect(() => {
    const timer = setTimeout(() => {
      setPools(generateMockPools());
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [user?.uid]);

  const onChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    setFormData((d) => ({ ...d, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleCreateRide = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.pickupName === formData.dropoffName) {
      setError("Pickup and drop-off locations must be different.");
      return;
    }

    if (!formData.scheduledTime) {
      setError("Please select a date and time.");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newPool = {
        _id: "pool" + Date.now(),
        pickupName: formData.pickupName,
        dropoffName: formData.dropoffName,
        scheduledTime: new Date(formData.scheduledTime).toISOString(),
        status: "pending",
        passengers: [
          {
            _id: user.uid,
            name: user.displayName || "User",
          },
        ],
        createdBy: { _id: user.uid },
      };

      setPools((prev) => [newPool, ...prev]);
      setFormData({
        pickupName: CAMPUS_LOCATIONS[0],
        dropoffName: CAMPUS_LOCATIONS[1],
        scheduledTime: "",
      });

      toast.success("Ride created! Others can now join your pool.");
    } catch (err) {
      setError("Failed to create ride. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoin = async (
    rideId: string,
    pickup: string,
    dropoff: string,
  ) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setPools((prev) =>
        prev.map((pool) =>
          pool._id === rideId
            ? {
                ...pool,
                passengers: [
                  ...pool.passengers,
                  {
                    _id: user.uid,
                    name: user.displayName || "User",
                  },
                ],
              }
            : pool,
        ),
      );

      toast.success("Joined ride successfully!");
    } catch (err) {
      toast.error("Failed to join ride.");
    }
  };

  const handleCancel = async (rideId: string) => {
    if (!window.confirm("Are you sure you want to cancel this ride?")) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPools((prev) => prev.filter((pool) => pool._id !== rideId));
      toast.success("Ride cancelled.");
    } catch (err) {
      toast.error("Failed to cancel ride.");
    }
  };

  if (!user) return null;

  return (
    <div className="page-container min-h-screen">
      <Header />

      <main className="content-container">
        <div className="mb-8 animate-fade-up">
          <h1 className="section-title">Book a Ride</h1>
          <p className="section-subtitle">
            Create a new ride request or join an existing pool.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create Ride Form */}
          <div className="lg:col-span-1">
            <div className="card-elevated sticky top-24 animate-slide-in-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg">New Ride</h2>
                  <p className="text-sm text-muted-foreground">
                    Request a new ride
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateRide} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Pickup Location
                  </label>
                  <select
                    name="pickupName"
                    value={formData.pickupName}
                    onChange={onChange}
                    className="select-styled"
                  >
                    {CAMPUS_LOCATIONS.map((loc) => (
                      <option
                        key={loc}
                        value={loc}
                        disabled={loc === formData.dropoffName}
                      >
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Drop-off Location
                  </label>
                  <select
                    name="dropoffName"
                    value={formData.dropoffName}
                    onChange={onChange}
                    className="select-styled"
                  >
                    {CAMPUS_LOCATIONS.map((loc) => (
                      <option
                        key={loc}
                        value={loc}
                        disabled={loc === formData.pickupName}
                      >
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={onChange}
                    required
                    className="input-styled"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary-gradient py-5"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </div>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Create Ride Request
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Active Pools */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-success flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg">Active Pools</h2>
                <p className="text-sm text-muted-foreground">
                  Join others going your way
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : pools.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-2xl border border-border">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No active pools</h3>
                <p className="text-muted-foreground text-sm">
                  Be the first to create a ride!
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {pools.map((pool, index) => (
                  <div
                    key={pool._id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <PoolCard
                      ride={pool}
                      userId={user.uid}
                      capacity={MAX_CAR_CAPACITY}
                      locations={CAMPUS_LOCATIONS}
                      onJoin={handleJoin}
                      onCancel={handleCancel}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingPage;
