import Header from "../components/Header";
import { getUsername, getRole, logout } from "../services/authService";
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHome from "./AdminHome";
import AdminProfile from "./AdminProfile";

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
        <div className="h-screen flex flex-col bg-gray-100">

            <Header username={username} role={role} />
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar (fixed width, full height) */}
                <AdminSidebar logout={logout}/>

                {/* Page Content Area */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <Routes>
                        <Route path="/" element={<Navigate to="/admin/admin-dashboard" replace />} />
                        <Route path="admin-dashboard" element={<AdminHome />} />
                        <Route path="admin-profile" element={<AdminProfile />} />
                    </Routes>
                </main>
            </div>
        </div>
    )
}