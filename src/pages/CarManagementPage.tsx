import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Settings, 
  Car, 
  Plus, 
  Users, 
  Loader2,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { toast } from "sonner";

// Mock data
const generateMockCars = () => [
  {
    _id: "car1",
    carName: "Campus Car 1",
    registrationNumber: "CA-01",
    capacity: 6,
    status: "available",
    driver: { _id: "d1", name: "John Doe" },
  },
  {
    _id: "car2",
    carName: "Campus Car 2",
    registrationNumber: "CA-02",
    capacity: 6,
    status: "in_use",
    driver: { _id: "d2", name: "Jane Smith" },
  },
  {
    _id: "car3",
    carName: "Campus Car 3",
    registrationNumber: "CA-03",
    capacity: 4,
    status: "maintenance",
    driver: null,
  },
];

const mockDrivers = [
  { _id: "d1", name: "John Doe" },
  { _id: "d2", name: "Jane Smith" },
  { _id: "d3", name: "Bob Wilson" },
];

const CarManagementPage = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<any[]>([]);
  const [drivers] = useState(mockDrivers);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newCarData, setNewCarData] = useState({
    carName: "",
    registrationNumber: "",
    capacity: 6,
  });

  const user = JSON.parse(localStorage.getItem("campusRideUser") || "null");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Access denied. Admin only.");
      navigate("/book");
      return;
    }

    setTimeout(() => {
      setCars(generateMockCars());
      setIsLoading(false);
    }, 800);
  }, [navigate, user]);

  const handleCarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCarData((d) => ({
      ...d,
      [name]: name === "capacity" ? Number(value) : value,
    }));
  };

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newCar = {
        _id: "car" + Date.now(),
        ...newCarData,
        status: "available",
        driver: null,
      };

      setCars((prev) => [...prev, newCar]);
      setNewCarData({ carName: "", registrationNumber: "", capacity: 6 });
      toast.success("Car added to fleet!");
    } catch (err) {
      toast.error("Failed to add car.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignDriver = async (carId: string, driverId: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const driver =
        driverId === "" ? null : drivers.find((d) => d._id === driverId);

      setCars((prev) =>
        prev.map((car) => (car._id === carId ? { ...car, driver } : car))
      );

      toast.success(driver ? "Driver assigned!" : "Driver unassigned.");
    } catch (err) {
      toast.error("Failed to update driver assignment.");
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "available":
        return "bg-success/10 text-success border-success/20";
      case "in_use":
        return "bg-primary/10 text-primary border-primary/20";
      case "maintenance":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (!user) return null;

  return (
    <div className="page-container min-h-screen">
      <Header />

      <main className="content-container">
        <div className="mb-8 animate-fade-up">
          <h1 className="section-title">Car Fleet Management</h1>
          <p className="section-subtitle">
            Add new cars, manage assignments, and monitor fleet status.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Add New Car Form */}
            <div className="lg:col-span-1">
              <div className="card-elevated sticky top-24 animate-slide-in-left">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg">Add Car</h2>
                    <p className="text-sm text-muted-foreground">
                      Add new vehicle to fleet
                    </p>
                  </div>
                </div>

                <form onSubmit={handleAddCar} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Car Name
                    </label>
                    <input
                      type="text"
                      name="carName"
                      value={newCarData.carName}
                      onChange={handleCarChange}
                      required
                      placeholder="Campus Car 4"
                      className="input-styled"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={newCarData.registrationNumber}
                      onChange={handleCarChange}
                      required
                      placeholder="CA-04"
                      className="input-styled"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Capacity
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={newCarData.capacity}
                      onChange={handleCarChange}
                      required
                      min="1"
                      max="10"
                      className="input-styled"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary-gradient py-5"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-2" />
                        Add to Fleet
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Fleet Status */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-success flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg">
                    Fleet Status
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {cars.length} vehicle{cars.length !== 1 && "s"} in fleet
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {cars.map((car, index) => (
                  <div
                    key={car._id}
                    className="card-elevated animate-fade-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                          <Car className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold">{car.carName}</p>
                          <p className="text-sm text-muted-foreground">
                            {car.registrationNumber}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusStyle(
                          car.status
                        )}`}
                      >
                        {car.status.replace("_", " ")}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>Capacity: {car.capacity}</span>
                      </div>
                    </div>

                    {/* Driver Assignment */}
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Assigned Driver
                        </span>
                      </div>
                      <select
                        value={car.driver?._id || ""}
                        onChange={(e) =>
                          handleAssignDriver(car._id, e.target.value)
                        }
                        className="select-styled"
                      >
                        <option value="">-- Select Driver --</option>
                        {drivers.map((driver) => (
                          <option key={driver._id} value={driver._id}>
                            {driver.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CarManagementPage;
