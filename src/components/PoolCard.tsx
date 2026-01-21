import { useState } from "react";
import { Clock, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PoolCardProps {
  ride: {
    _id: string;
    pickupName: string;
    dropoffName: string;
    scheduledTime: string;
    passengers: Array<{ _id: string; name: string } | string>;
    createdBy?: { _id: string } | string;
  };
  userId: string;
  capacity: number;
  locations: string[];
  onJoin: (rideId: string, pickup: string, dropoff: string) => void;
  onCancel: (rideId: string) => void;
}

const PoolCard = ({
  ride,
  userId,
  capacity,
  locations,
  onJoin,
  onCancel,
}: PoolCardProps) => {
  const [joinDetails, setJoinDetails] = useState({
    pickupName: ride.pickupName,
    dropoffName: ride.dropoffName,
  });

  const passengerCount = ride.passengers.length;
  const isFull = passengerCount >= capacity;
  const slotsLeft = capacity - passengerCount;

  const alreadyJoined = ride.passengers.some((p) =>
    typeof p === "string" ? p === userId : p._id === userId
  );

  const isCreator =
    ride.createdBy &&
    (typeof ride.createdBy === "string"
      ? ride.createdBy === userId
      : ride.createdBy._id === userId);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCardStyle = () => {
    if (alreadyJoined) return "border-primary/30 bg-primary/5";
    if (isFull) return "border-success/30 bg-success/5";
    return "border-border hover:border-primary/30";
  };

  const getBadgeStyle = () => {
    if (alreadyJoined) return "bg-primary text-primary-foreground";
    if (isFull) return "bg-success text-success-foreground";
    return "bg-accent/10 text-accent border border-accent/20";
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-5 border-2 transition-all duration-300 bg-card",
        getCardStyle()
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide",
            getBadgeStyle()
          )}
        >
          {alreadyJoined
            ? "Joined"
            : isFull
            ? "Full"
            : `${slotsLeft} slot${slotsLeft !== 1 ? "s" : ""} left`}
        </span>
        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <Clock className="w-4 h-4 text-muted-foreground" />
          {formatTime(ride.scheduledTime)}
        </div>
      </div>

      {/* Route */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground">{ride.pickupName}</span>
        </div>
        <div className="flex items-center gap-2 pl-2 border-l-2 border-dashed border-muted-foreground/30 ml-2">
          <div className="w-0 h-4" />
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-accent" />
          <span className="font-semibold text-foreground">{ride.dropoffName}</span>
        </div>
      </div>

      {/* Passengers */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 py-3 border-t border-border/50">
        <Users className="w-4 h-4" />
        <span>
          {passengerCount} / {capacity} passengers
        </span>
        <div className="flex -space-x-2 ml-auto">
          {Array.from({ length: Math.min(passengerCount, 4) }).map((_, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-card flex items-center justify-center text-white text-xs font-bold"
            >
              {i + 1}
            </div>
          ))}
          {passengerCount > 4 && (
            <div className="w-7 h-7 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-bold">
              +{passengerCount - 4}
            </div>
          )}
        </div>
      </div>

      {/* Join controls */}
      {!isFull && !alreadyJoined && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Your pickup
              </label>
              <select
                value={joinDetails.pickupName}
                onChange={(e) =>
                  setJoinDetails({ ...joinDetails, pickupName: e.target.value })
                }
                className="select-styled text-sm py-2"
              >
                {locations.map((loc) => (
                  <option
                    key={loc}
                    value={loc}
                    disabled={loc === joinDetails.dropoffName}
                  >
                    {loc}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Your drop-off
              </label>
              <select
                value={joinDetails.dropoffName}
                onChange={(e) =>
                  setJoinDetails({ ...joinDetails, dropoffName: e.target.value })
                }
                className="select-styled text-sm py-2"
              >
                {locations.map((loc) => (
                  <option
                    key={loc}
                    value={loc}
                    disabled={loc === joinDetails.pickupName}
                  >
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button
            onClick={() =>
              onJoin(ride._id, joinDetails.pickupName, joinDetails.dropoffName)
            }
            disabled={joinDetails.pickupName === joinDetails.dropoffName}
            className="w-full btn-accent-gradient"
          >
            Join This Ride
          </Button>
        </div>
      )}

      {/* Status messages */}
      {alreadyJoined && (
        <p className="text-sm font-medium text-primary text-center py-2">
          ✓ You're in this ride
        </p>
      )}

      {isFull && !alreadyJoined && (
        <p className="text-sm font-medium text-muted-foreground text-center py-2">
          This pool is full
        </p>
      )}

      {/* Cancel button for creator */}
      {isCreator && (
        <Button
          variant="destructive"
          size="sm"
          className="w-full mt-3"
          onClick={() => onCancel(ride._id)}
        >
          Cancel Ride
        </Button>
      )}
    </div>
  );
};

export default PoolCard;
