import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationProvider } from "@/hooks/useNotifications";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BookingPage from "./pages/BookingPage";
import MyRidesPage from "./pages/MyRidesPage";
import DriverDashboard from "./pages/DriverDashboard";
import SchedulePage from "./pages/SchedulePage";
import DriverHistory from "./pages/DriverHistory";
import CarManagementPage from "./pages/CarManagementPage";
import LiveTrackingPage from "./pages/LiveTrackingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <NotificationProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          
          {/* Auth Routes */}
          <Route path="/login-student" element={<LoginPage role="student" />} />
          <Route path="/login-driver" element={<LoginPage role="driver" />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Student Routes */}
          <Route path="/book" element={<BookingPage />} />
          <Route path="/myrides" element={<MyRidesPage />} />
          <Route path="/track/:rideId" element={<LiveTrackingPage />} />
          
          {/* Driver Routes */}
          <Route path="/driver-dashboard" element={<DriverDashboard />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/driver/history" element={<DriverHistory />} />
          
          {/* Admin Routes */}
          <Route path="/admin/cars" element={<CarManagementPage />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </NotificationProvider>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
