// Location Picker Component using Google Maps
import React, { useState, useCallback } from "react";
import { MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LiveTrackingMap from "./LiveTrackingMapLeaflet";
import { campusLocations } from "@/lib/maps/config";

interface LocationPickerProps {
  type: "pickup" | "dropoff";
  value?: { lat: number; lng: number; name: string };
  onChange: (location: { lat: number; lng: number; name: string }) => void;
  placeholder?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  type,
  value,
  onChange,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);

  const handleLocationSelect = useCallback(
    (location: { lat: number; lng: number; name: string }) => {
      setTempLocation(location);
    },
    []
  );

  const handleConfirm = () => {
    if (tempLocation) {
      onChange(tempLocation);
      setIsOpen(false);
      setTempLocation(null);
    }
  };

  const handleQuickSelect = (key: string) => {
    const location = campusLocations[key as keyof typeof campusLocations];
    if (location) {
      onChange(location);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="w-full flex items-center gap-3 p-4 rounded-xl border border-border bg-background hover:bg-secondary/50 transition-colors text-left">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              type === "pickup"
                ? "bg-success/10 text-success"
                : "bg-accent/10 text-accent"
            }`}
          >
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {type === "pickup" ? "Pickup Location" : "Drop-off Location"}
            </p>
            <p className="font-semibold text-foreground">
              {value?.name || placeholder || "Select location"}
            </p>
          </div>
          {value && <Check className="w-5 h-5 text-success" />}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Select {type === "pickup" ? "Pickup" : "Drop-off"} Location
          </DialogTitle>
        </DialogHeader>

        {/* Quick select campus locations */}
        <div className="mb-4">
          <p className="text-sm font-medium text-muted-foreground mb-3">
            Quick Select Campus Locations
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(campusLocations).map(([key, location]) => (
              <button
                key={key}
                onClick={() => handleQuickSelect(key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  tempLocation?.name === location.name
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                }`}
              >
                {location.name}
              </button>
            ))}
          </div>
        </div>

        {/* Map for custom selection */}
        <div className="mb-4">
          <p className="text-sm font-medium text-muted-foreground mb-3">
            Or click on the map to select a custom location
          </p>
          <LiveTrackingMap
            height="350px"
            selectionMode={type}
            onLocationSelect={handleLocationSelect}
            pickupLocation={type === "dropoff" && value ? value : undefined}
          />
        </div>

        {/* Selected location display */}
        {tempLocation && (
          <div className="p-4 rounded-xl bg-secondary/50 mb-4">
            <p className="text-sm text-muted-foreground">Selected Location</p>
            <p className="font-semibold">{tempLocation.name}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!tempLocation}
            className="flex-1 btn-primary-gradient"
          >
            Confirm Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationPicker;
