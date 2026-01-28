import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { auth } from "@/lib/firebase/auth";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();

  // ✅ Firebase is the single source of truth
  const user = auth.currentUser;

  if (!user) {
    // 🚦 Redirect based on route type
    if (location.pathname.startsWith("/driver")) {
      return <Navigate to="/login-driver" replace />;
    }
    return <Navigate to="/login-student" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
