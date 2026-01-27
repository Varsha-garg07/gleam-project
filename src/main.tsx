import "leaflet/dist/leaflet.css";
import "@/lib/leafletFix";

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { startDriverSimulation } from "@/lib/locationSimulator";
startDriverSimulation("demoRide");

createRoot(document.getElementById("root")!).render(<App />);
