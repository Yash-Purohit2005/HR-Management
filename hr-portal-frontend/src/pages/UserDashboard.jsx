// pages/UserDashboard.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Profile from "./Profile";
import LeaveRequests from "./LeaveRequest";
import UpdateProfile from "./UpdateProfile";
import ChangePassword from "./ChangePassword";
import LeaveApply from "./leave/LeaveApply";
import Header from "../components/Header";
import { getUsername,getRole, logout } from "../services/authService";

function UserDashboard() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {

     const storedUsername = getUsername();

     const displayName = storedUsername ? storedUsername.split("@")[0] : "User";

    setUsername(displayName);
    setRole(getRole());
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Fixed Header */}
      <Header username={username} role={role} />

      {/* Main layout (Sidebar + Page Content) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (fixed width, full height) */}
        <Sidebar logout={logout}/>

        {/* Page Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Routes>
            <Route path="/" element={<Navigate to="/user/profile" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="update-profile" element={<UpdateProfile />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="leaves" element={<LeaveRequests />} />
            <Route path="leave-apply" element={<LeaveApply />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default UserDashboard;
