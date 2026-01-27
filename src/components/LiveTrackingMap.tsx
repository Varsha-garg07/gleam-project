// Live Tracking Map Component
import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";
import { Car, MapPin, Navigation, Clock } from "lucide-react";
import {
  GOOGLE_MAPS_API_KEY,
  defaultCenter,
  defaultMapOptions,
  campusLocations,
  carMarkerIcon,
  pickupMarkerIcon,
  dropoffMarkerIcon,
} from "@/lib/maps/config";
import { subscribeToDriverLocation, LocationData } from "@/lib/firebase/realtime";

interface LiveTrackingMapProps {
  rideId?: string;
  pickupLocation?: { lat: number; lng: number; name?: string };
  dropoffLocation?: { lat: number; lng: number; name?: string };
  showRoute?: boolean;
  height?: string;
  onLocationSelect?: (location: { lat: number; lng: number; name: string }) => void;
  selectionMode?: "pickup" | "dropoff" | null;
  className?: string;
}

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "1rem",
};

const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  rideId,
  pickupLocation,
  dropoffLocation,
  showRoute = false,
  height = "400px",
  onLocationSelect,
  selectionMode,
  className = "",
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [driverLocation, setDriverLocation] = useState<LocationData | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);
  const [eta, setEta] = useState<string | null>(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState<string | null>(null);

  // Subscribe to driver location updates
  useEffect(() => {
    if (!rideId) return;

    const unsubscribe = subscribeToDriverLocation(rideId, (location) => {
      if (location) {
        setDriverLocation(location);
      }
    });

    return () => unsubscribe();
  }, [rideId]);

  // Calculate route when pickup and dropoff are set
  useEffect(() => {
    if (!showRoute || !pickupLocation || !dropoffLocation || !isLoaded) return;

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: pickupLocation,
        destination: dropoffLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
          const leg = result.routes[0]?.legs[0];
          if (leg?.duration?.text) {
            setEta(leg.duration.text);
          }
        }
      }
    );
  }, [pickupLocation, dropoffLocation, showRoute, isLoaded]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Handle map click for location selection
  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (!selectionMode || !event.latLng) return;

      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      // Find nearest campus location or use coordinates
      const nearestLocation = Object.values(campusLocations).find(
        (loc) =>
          Math.abs(loc.lat - lat) < 0.0005 && Math.abs(loc.lng - lng) < 0.0005
      );

      const location = nearestLocation || {
        lat,
        lng,
        name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      };

      setSelectedLocation(location);
      if (onLocationSelect) {
        onLocationSelect(location);
      }
    },
    [selectionMode, onLocationSelect]
  );

  if (loadError) {
    return (
      <div
        className={`flex items-center justify-center bg-muted rounded-xl ${className}`}
        style={{ height }}
      >
        <div className="text-center p-6">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Error loading maps</p>
          <p className="text-sm text-muted-foreground mt-1">
            Please check your API key configuration
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={`flex items-center justify-center bg-muted rounded-xl animate-pulse ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
            <Navigation className="w-6 h-6 text-primary animate-spin" />
          </div>
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={
          driverLocation
            ? { lat: driverLocation.lat, lng: driverLocation.lng }
            : pickupLocation || defaultCenter
        }
        zoom={defaultMapOptions.zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={defaultMapOptions}
      >
        {/* Campus location markers */}
        {Object.entries(campusLocations).map(([key, location]) => (
          <Marker
            key={key}
            position={{ lat: location.lat, lng: location.lng }}
            title={location.name}
            onClick={() => {
              if (selectionMode && onLocationSelect) {
                onLocationSelect(location);
              } else {
                setInfoWindowOpen(key);
              }
            }}
            icon={{
              url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Ccircle cx='12' cy='12' r='8' fill='%234f46e5' fill-opacity='0.2'/%3E%3Ccircle cx='12' cy='12' r='4' fill='%234f46e5'/%3E%3C/svg%3E",
              scaledSize: new google.maps.Size(24, 24),
              anchor: new google.maps.Point(12, 12),
            }}
          >
            {infoWindowOpen === key && (
              <InfoWindow onCloseClick={() => setInfoWindowOpen(null)}>
                <div className="p-1">
                  <p className="font-semibold text-sm">{location.name}</p>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}

        {/* Pickup marker */}
        {pickupLocation && (
          <Marker
            position={pickupLocation}
            title={pickupLocation.name || "Pickup"}
            icon={{
              url: pickupMarkerIcon.url,
              scaledSize: new google.maps.Size(36, 36),
              anchor: new google.maps.Point(18, 36),
            }}
          />
        )}

        {/* Dropoff marker */}
        {dropoffLocation && (
          <Marker
            position={dropoffLocation}
            title={dropoffLocation.name || "Dropoff"}
            icon={{
              url: dropoffMarkerIcon.url,
              scaledSize: new google.maps.Size(36, 36),
              anchor: new google.maps.Point(18, 36),
            }}
          />
        )}

        {/* Driver/Car marker */}
        {driverLocation && (
          <Marker
            position={{ lat: driverLocation.lat, lng: driverLocation.lng }}
            title="Driver"
            icon={{
              url: carMarkerIcon.url,
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 20),
            }}
          />
        )}

        {/* Route display */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: "#4f46e5",
                strokeWeight: 4,
                strokeOpacity: 0.8,
              },
            }}
          />
        )}

        {/* Selected location marker */}
        {selectedLocation && selectionMode && (
          <Marker
            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            title={selectedLocation.name}
            animation={google.maps.Animation.DROP}
          />
        )}
      </GoogleMap>

      {/* ETA Display */}
      {eta && showRoute && (
        <div className="absolute top-4 left-4 bg-card rounded-xl shadow-lg border border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Estimated Time</p>
              <p className="font-semibold text-foreground">{eta}</p>
            </div>
          </div>
        </div>
      )}

      {/* Driver location status */}
      {driverLocation && (
        <div className="absolute bottom-4 left-4 bg-card rounded-xl shadow-lg border border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
            <div>
              <p className="text-xs text-muted-foreground">Driver Location</p>
              <p className="text-sm font-medium">Live Tracking Active</p>
            </div>
          </div>
        </div>
      )}

      {/* Selection mode indicator */}
      {selectionMode && (
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-xl shadow-lg px-4 py-2">
          <p className="text-sm font-medium">
            Click to select {selectionMode === "pickup" ? "pickup" : "drop-off"} point
          </p>
        </div>
      )}
    </div>
  );
};

export default LiveTrackingMap;
