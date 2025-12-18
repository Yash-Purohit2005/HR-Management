// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { getToken } from "../services/authService";

function ProtectedRoute({ allowedRoles, children }) {

  const token = localStorage.getItem("jwt"); 
  const role = localStorage.getItem("role");

  // ❌ Not logged in → redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // ❌ Logged in but role not allowed
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // ✅ Access granted
  return children;
}

export default ProtectedRoute;

