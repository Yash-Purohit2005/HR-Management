import React from "react";
import NotificationBell from "./notification/NotificationBell";

function Header({ username, role}) {
  return (
    <header className="flex justify-between items-center bg-white shadow px-6 py-4 border-b border-gray-200">
      {/* Left side (Logo or Title) */}
      <h1 className="text-2xl font-semibold text-blue-900">HR Portal</h1>

      {/* Right side (Notification + User Info) */}
      <div className="flex items-center space-x-6">
        {/* Notification Icon */}
        <button
          
          className="relative text-gray-700 hover:text-blue-800 transition"
        >
          <NotificationBell className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
          </span>
        </button>

        {/* User Info */}
        <div className="flex flex-col items-center">
          <span className="font-medium  text-gray-800">Hi, {username} !</span>
          <span className="text-sm text-gray-500">{role}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
