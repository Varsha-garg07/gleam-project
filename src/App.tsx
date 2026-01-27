import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { NotificationProvider } from "@/hooks/useNotifications";
import { onAuthChange } from "@/lib/firebase/auth";
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
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Firebase auth listener (single source of truth)
  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ⏳ Prevent route flicker while auth is resolving
  if (loading) {
    return null; // or spinner
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NotificationProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
            <Routes>
              {/* ===== PUBLIC ROUTES ===== */}
              <Route path="/" element={<HomePage />} />

              {/* ===== AUTH ROUTES (NO REDIRECT LOGIC HERE) ===== */}
              <Route path="/login-student" element={<LoginPage role="student" />} />
              <Route path="/login-driver" element={<LoginPage role="driver" />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* ===== STUDENT ROUTES ===== */}
              <Route
                path="/book"
                element={
                  <ProtectedRoute user={user}>
                    <BookingPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/myrides"
                element={
                  <ProtectedRoute user={user}>
                    <MyRidesPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/track/:rideId"
                element={
                  <ProtectedRoute user={user}>
                    <LiveTrackingPage />
                  </ProtectedRoute>
                }
              />

              {/* ===== DRIVER ROUTES ===== */}
              <Route
                path="/driver-dashboard"
                element={
                  <ProtectedRoute user={user}>
                    <DriverDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/schedule"
                element={
                  <ProtectedRoute user={user}>
                    <SchedulePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/driver/history"
                element={
                  <ProtectedRoute user={user}>
                    <DriverHistory />
                  </ProtectedRoute>
                }
              />

              {/* ===== ADMIN ROUTES ===== */}
              <Route
                path="/admin/cars"
                element={
                  <ProtectedRoute user={user}>
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
