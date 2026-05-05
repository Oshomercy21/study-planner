import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // 🚨 Wait until auth finishes loading
  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  // 🚨 Only redirect if user is truly not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}