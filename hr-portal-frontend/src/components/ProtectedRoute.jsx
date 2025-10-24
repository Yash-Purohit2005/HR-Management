// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { getToken } from "../services/authService";

function ProtectedRoute({ children }) {
  return getToken() ? children : <Navigate to="/" />;
}

export default ProtectedRoute;

