// Google Maps API Configuration
// Add your Google Maps API key here

export const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

// Map styling for the campus theme
export const mapStyles = [
  {
    featureType: "all",
    elementType: "geometry.fill",
    stylers: [{ weight: "2.00" }],
  },
  {
    featureType: "all",
    elementType: "geometry.stroke",
    stylers: [{ color: "#9c9c9c" }],
  },
  {
    featureType: "all",
    elementType: "labels.text",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "landscape",
    elementType: "all",
    stylers: [{ color: "#f2f2f2" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry.fill",
    stylers: [{ color: "#f1f5f9" }],
  },
  {
    featureType: "poi",
    elementType: "all",
    stylers: [{ visibility: "simplified" }],
  },
  {
    featureType: "poi.school",
    elementType: "all",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "road",
    elementType: "all",
    stylers: [{ saturation: -100 }, { lightness: 45 }],
  },
  {
    featureType: "road.highway",
    elementType: "all",
    stylers: [{ visibility: "simplified" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [{ color: "#e2e8f0" }],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    elementType: "all",
    stylers: [{ color: "#c0e6f4" }, { visibility: "on" }],
  },
];

// NIT Jalandhar Campus locations
export const campusLocations = {
  mainGate: { lat: 31.3960, lng: 75.5352, name: "Main Gate" },
  adminBlock: { lat: 31.3965, lng: 75.5358, name: "Administrative Block" },
  academicBlock: { lat: 31.3968, lng: 75.5365, name: "Academic Block" },
  library: { lat: 31.3962, lng: 75.5370, name: "Central Library" },
  hostelMGH: { lat: 31.3955, lng: 75.5345, name: "Mega Girls Hostel" },
  hostelBH1: { lat: 31.3958, lng: 75.5380, name: "Boys Hostel 1" },
  hostelBH2: { lat: 31.3950, lng: 75.5385, name: "Boys Hostel 2" },
  canteen: { lat: 31.3963, lng: 75.5355, name: "Central Canteen" },
  sportsComplex: { lat: 31.3945, lng: 75.5360, name: "Sports Complex" },
  auditorium: { lat: 31.3970, lng: 75.5350, name: "Auditorium" },
  ece: { lat: 31.3972, lng: 75.5368, name: "ECE Department" },
  cse: { lat: 31.3975, lng: 75.5372, name: "CSE Department" },
  mechanical: { lat: 31.3967, lng: 75.5378, name: "Mechanical Department" },
  civil: { lat: 31.3964, lng: 75.5382, name: "Civil Department" },
};

// Default map center (NIT Jalandhar)
export const defaultCenter = {
  lat: 31.3960,
  lng: 75.5365,
};

// Map default options
export const defaultMapOptions = {
  zoom: 17,
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  styles: mapStyles,
};

// Car marker icon
export const carMarkerIcon = {
  url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='32' height='32'%3E%3Cpath fill='%234f46e5' d='M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z'/%3E%3C/svg%3E",
  scaledSize: { width: 40, height: 40 },
  anchor: { x: 20, y: 20 },
};

// Pickup marker icon
export const pickupMarkerIcon = {
  url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='32' height='32'%3E%3Cpath fill='%2210b981' d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",
  scaledSize: { width: 36, height: 36 },
  anchor: { x: 18, y: 36 },
};

// Dropoff marker icon
export const dropoffMarkerIcon = {
  url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='32' height='32'%3E%3Cpath fill='%2314b8a6' d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",
  scaledSize: { width: 36, height: 36 },
  anchor: { x: 18, y: 36 },
};
