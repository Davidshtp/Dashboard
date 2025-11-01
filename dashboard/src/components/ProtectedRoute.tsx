// components/ProtectedRoute.tsx
import { useAuthStore } from "../stores/authStore";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;