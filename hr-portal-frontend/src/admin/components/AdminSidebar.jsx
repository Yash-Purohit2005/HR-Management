import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
 
  FiHome,
  FiLogOut,
  FiBell,
} from "react-icons/fi";
import { MdBeachAccess } from "react-icons/md";

import { FaUserCircle } from "react-icons/fa";


const AdminSidebar = ({ logout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to highlight the active link
  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-white text-gray-800 flex flex-col justify-between h-full border-r shadow-sm">
      {/* Sidebar Top */}
      <div>
        
        <nav className="flex flex-col mt-2 text-[15px] font-medium">

          <Link
            to="/admin/admin-dashboard"
            className="flex items-center px-4 py-3 hover:bg-blue-100 transition"
          >
            <FiHome className="mr-3 text-blue-700 text-lg" />
            Dashboard
          </Link>

          <Link
            to="/admin/admin-profile"
            className="flex items-center px-4 py-3 hover:bg-blue-100 transition"
          >
            <FaUserCircle className="mr-3 text-blue-700 text-lg" />
           Profile
          </Link>

           <Link
            to="/admin/leave-management"
            className="flex items-center px-4 py-3 hover:bg-blue-100 transition"
          >
            <MdBeachAccess className="mr-3 text-blue-700 text-lg" />
           Leave Management
          </Link>
          
          <Link
            to="/admin/create-notification"
            className="flex items-center px-4 py-3 hover:bg-blue-100 transition"
          >
            <FiBell className="mr-3 text-blue-700 text-lg" />
           Create Notification
          </Link>


        </nav>
      </div>

      {/* Sidebar Bottom (Fixed Logout Button) */}
      <div className="p-4 border-t">
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          <FiLogOut className="text-lg" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
