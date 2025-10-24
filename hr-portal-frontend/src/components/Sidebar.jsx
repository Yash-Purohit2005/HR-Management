import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiChevronDown, FiChevronRight, FiCalendar } from "react-icons/fi"; // icons

function Sidebar() {
  const navigate = useNavigate();
  const [leaveDropdownOpen, setLeaveDropdownOpen] = useState(false);

  const logout = () => {
  localStorage.removeItem("jwt");
  localStorage.removeItem("role");
};

  return (
    <div className="w-64 bg-blue-900 text-white flex flex-col h-screen">
      <h2 className="text-2xl font-bold p-4">HR Portal</h2>

      <nav className="flex-1">
        <Link to="/dashboard/profile" className="flex items-center px-4 py-2 hover:bg-blue-700">
          My Profile
        </Link>

        <Link to="/dashboard/update-profile" className="block px-4 py-2 hover:bg-gray-200">
          Update Profile
        </Link>

        <Link to="/dashboard/change-password" className="block px-4 py-2 hover:bg-gray-200">
          Change Password
        </Link>

        {/* Leave Management with Icon + Dropdown */}
        <div>
          <button
            onClick={() => setLeaveDropdownOpen(!leaveDropdownOpen)}
            className="w-full flex items-center  px-4 py-2 hover:bg-blue-700"
          > 
            {leaveDropdownOpen ? <FiChevronDown /> : <FiChevronRight />}
            <div className="flex items-center px-2">
               Leave Management
            </div>
            
          </button>

          {leaveDropdownOpen && (
            <div className="ml-6">
              <Link
                to="/dashboard/leaves"
                className="flex items-center px-4 py-2 hover:bg-blue-600"
              >
                <FiCalendar className="mr-2" /> Leave Requests
              </Link>
              <Link
                to="/dashboard/leave-apply"
                className="flex items-center px-4 py-2 hover:bg-blue-600"
              >
                <FiCalendar className="mr-2" /> Apply Leave
              </Link>
            </div>
          )}
        </div>

        <Link to="/dashboard/notifications" className="block px-4 py-2 hover:bg-blue-700">
          Notifications
        </Link>
      </nav>

      <button
        onClick={() => {
          logout();
          navigate("/");
        }}
        className="bg-red-600 p-2 m-4 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
