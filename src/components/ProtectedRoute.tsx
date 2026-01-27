import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, children }: any) => {
  if (!user) {
    return <Navigate to="/login-student" replace />;
  }
  return children;
};

export default ProtectedRoute;
