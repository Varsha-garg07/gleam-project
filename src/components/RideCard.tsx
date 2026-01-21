import { MapPin, Clock, Users, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import { cn } from "@/lib/utils";

interface RideCardProps {
  ride: {
    _id: string;
    pickupName: string;
    dropoffName: string;
    scheduledTime: string;
    status: string;
    passengers?: Array<{ _id: string; name: string }>;
    carAssigned?: { carName: string; registrationNumber: string };
    createdBy?: { _id: string } | string;
  };
  userId?: string;
  showActions?: boolean;
  onCancel?: (id: string) => void;
  onJoin?: (id: string, pickup: string, dropoff: string) => void;
  className?: string;
}

const RideCard = ({
  ride,
  userId,
  showActions = true,
  onCancel,
  onJoin,
  className,
}: RideCardProps) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const passengerCount = ride.passengers?.length || 0;
  const isCreator =
    ride.createdBy &&
    (typeof ride.createdBy === "string"
      ? ride.createdBy === userId
      : ride.createdBy._id === userId);

  const canCancel = ["pending", "scheduled"].includes(ride.status);

  return (
    <div
      className={cn(
        "card-interactive group",
        "border border-border/50",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <StatusBadge status={ride.status} />
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          {formatDate(ride.scheduledTime)}
        </div>
      </div>

      {/* Route */}
      <div className="mb-4">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-primary border-2 border-primary-foreground shadow-sm" />
            <div className="w-0.5 h-8 bg-gradient-to-b from-primary to-accent my-1" />
            <div className="w-3 h-3 rounded-full bg-accent border-2 border-accent-foreground shadow-sm" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Pickup
              </p>
              <p className="font-semibold text-foreground">{ride.pickupName}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Drop-off
              </p>
              <p className="font-semibold text-foreground">{ride.dropoffName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          <span>{passengerCount} passenger{passengerCount !== 1 ? "s" : ""}</span>
        </div>
        {ride.carAssigned ? (
          <div className="flex items-center gap-1.5">
            <Car className="w-4 h-4" />
            <span>{ride.carAssigned.carName}</span>
          </div>
        ) : (
          <span className="text-warning text-xs font-medium">
            Awaiting assignment
          </span>
        )}
      </div>

      {/* Actions */}
      {showActions && canCancel && isCreator && onCancel && (
        <Button
          variant="destructive"
          size="sm"
          className="w-full"
          onClick={() => onCancel(ride._id)}
        >
          Cancel Ride
        </Button>
      )}
    </div>
  );
};

export default RideCard;
