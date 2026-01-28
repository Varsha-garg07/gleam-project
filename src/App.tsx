import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { NotificationProvider } from "@/hooks/useNotifications";

import ProtectedRoute from "@/components/ProtectedRoute";

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

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NotificationProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
            <Routes>
              {/* ===== PUBLIC ===== */}
              <Route path="/" element={<HomePage />} />

              {/* ===== AUTH ===== */}
              <Route
                path="/login-student"
                element={<LoginPage role="student" />}
              />
              <Route
                path="/login-driver"
                element={<LoginPage role="driver" />}
              />
              <Route path="/register" element={<RegisterPage />} />

              {/* ===== STUDENT ===== */}
              <Route
                path="/book"
                element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/myrides"
                element={
                  <ProtectedRoute>
                    <MyRidesPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/track/:rideId"
                element={
                  <ProtectedRoute>
                    <LiveTrackingPage />
                  </ProtectedRoute>
                }
              />

              {/* ===== DRIVER ===== */}
              <Route
                path="/driver-dashboard"
                element={
                  <ProtectedRoute>
                    <DriverDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/schedule"
                element={
                  <ProtectedRoute>
                    <SchedulePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/driver/history"
                element={
                  <ProtectedRoute>
                    <DriverHistory />
                  </ProtectedRoute>
                }
              />

              {/* ===== ADMIN ===== */}
              <Route
              
                path="/admin/cars"
                element={
                  <ProtectedRoute>
                    <CarManagementPage />
                  </ProtectedRoute>
                }
              />

              {/* ===== FALLBACK ===== */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>

        </NotificationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
