import Header from "../../user/component/Header";
import { getUsername, getRole, logout } from "../../services/authService";
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminHome from "../components/AdminHome";
import AdminProfile from "./AdminProfile";
import LeaveManagement from "./LeaveManagement"
import CreateEmployees from "../components/CreateEmployees";
import UpdateEmployee from "../components/UpdateEmployee";
import ChangePassword from "../components/ChangePassword";
import EditEmployee from "../components/EditEmployee";
import CreateNotification from "./CreateNotification";
import AdminChat from "./AdminChat";

export default function AdminDashboard() {

    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {

        const storedUsername = getUsername();

        const displayName = storedUsername ? storedUsername.split("@")[0] : "User";

        setUsername(displayName);
        setRole(getRole());
    }, []);

    return (
        <div className="h-screen flex flex-col">

            <Header username={username} role={role} />
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar (fixed width, full height) */}
                <AdminSidebar logout={logout}/>

                {/* Page Content Area */}
                <main className="flex-1 overflow-y-auto p-6 ">
                    <Routes>
                        <Route path="/" element={<Navigate to="/admin/admin-dashboard" replace />} />
                        <Route path="admin-dashboard" element={<AdminHome />} />
                        <Route path="admin-profile" element={<AdminProfile />} />
                        <Route path="leave-management" element={<LeaveManagement/>}/>
                        <Route path="employees/new" element={<CreateEmployees/>}/>
                        <Route path="employees/:id/edit" element={<EditEmployee/>}/>
                        <Route path="edit-profile" element={<UpdateEmployee />} />
                        <Route path="change-password" element={<ChangePassword />} />
                        <Route path="create-notification" element={<CreateNotification/>}/>
                        <Route path="chat" element={<AdminChat/>} /> {/* ✅ ADDED */}
                    </Routes>
                </main>
            </div>
        </div>
    )
}