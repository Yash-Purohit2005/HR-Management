import { useState, useEffect } from "react";
import { getUserNotifications } from "../../services/notification/notification";
import { Bell, X } from "lucide-react"; // Import X icon

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getUserNotifications();
      // Sorting by date descending
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(sorted);

      if (sorted.length > 0) {
        const newest = new Date(sorted[0].createdAt);
        const lastSeen = localStorage.getItem("lastSeenNotification");
        if (!lastSeen || new Date(lastSeen) < newest) {
          setHasUnread(true);
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const toggleDropdown = () => {
    const newState = !showDropdown;
    setShowDropdown(newState);

    if (newState) {
      if (notifications.length > 0) {
        const latestTime = notifications[0].createdAt;
        localStorage.setItem("lastSeenNotification", latestTime);
      }
      setHasUnread(false);
    }
  };

  // Function specifically for the X button
  const closeDropdown = (e) => {
    e.stopPropagation(); // Prevents the click from bubbling up
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button onClick={toggleDropdown} className="relative p-2 hover:bg-gray-100 rounded-full transition">
        <Bell className="w-6 h-6 text-gray-700" />
        {hasUnread && (
          <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
        )}
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          
          {/* Header with Close (X) Button */}
          <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-700">Notifications</h3>
            <button 
              onClick={closeDropdown} 
              className="p-1 hover:bg-gray-200 rounded-full text-gray-500 transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-gray-500 text-sm">No notifications yet.</p>
            ) : (
              <ul>
                {notifications.map((n, index) => (
                  <li 
                    key={index} 
                    className={`p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition ${
                      n.important ? 'bg-red-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-semibold ${n.important ? 'text-red-700' : 'text-gray-800'}`}>
                        {n.title}
                      </p>
                      {n.important && (
                        <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded uppercase font-bold">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-xs mt-1 leading-relaxed">{n.message}</p>
                    <p className="text-gray-400 text-[10px] mt-2 italic">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Optional: Footer to "View All" */}
          <div className="p-2 border-t text-center bg-white">
            <button className="text-xs text-blue-600 hover:underline font-medium">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
