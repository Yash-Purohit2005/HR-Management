import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import UserDashboard from "./user/pages/UserDashboard";
import AdminDashboard from "./admin/pages/AdminDashboard";
import ProtectedRoute from "./user/component/ProtectedRoute";
import SetupPassword from "./auth/SetUpPassword";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
       <Route path="/setup-password" element={<SetupPassword />} />
       <Route path="/forgot-password" element={<ForgotPassword/>} />
       <Route path="/reset-password" element={<ResetPassword />} />
     {/* USER DASHBOARD */}
      <Route
        path="/user/*"
        element={
          <ProtectedRoute allowedRoles={['USER']}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* ADMIN DASHBOARD */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;




