// pages/UserDashboard.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Profile from "./Profile";
import LeaveRequests from "./LeaveRequest";
import Notifications from "./Notifications";
import UpdateProfile from "./UpdateProfile";
import ChangePassword from "./ChangePassword";
import LeaveApply from "./leave/LeaveApply";


function UserDashboard() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/profile" replace />} />
          <Route path="profile" element={<Profile />} />
          <Route path="update-profile" element={<UpdateProfile />} />
           <Route path="change-password" element={<ChangePassword />} />
          <Route path="leaves" element={<LeaveRequests />} />
          <Route path="leave-apply" element ={<LeaveApply/>}/>
          <Route path="notifications" element={<Notifications />} />
        </Routes>
      </div>
    </div>
  );
}

export default UserDashboard;

