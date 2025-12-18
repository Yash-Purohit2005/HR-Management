import { useState, useEffect } from "react";
import axios from "axios";
import { Bell } from "lucide-react";

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
      const token = localStorage.getItem("jwt");
      const response = await axios.get(
        "http://localhost:8080/api/notifications/get-notification",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const sorted = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNotifications(sorted);

      // compare latest with last seen
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
      // user opened dropdown → mark as read
      if (notifications.length > 0) {
        const latestTime = notifications[0].createdAt;
        localStorage.setItem("lastSeenNotification", latestTime);
      }
      setHasUnread(false);
    }
  };

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="relative">
        <Bell className="w-6 h-6 text-gray-700" />
        {hasUnread && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-3 z-10">
          <h3 className="text-sm font-semibold mb-2">Notifications</h3>
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm">No notifications</p>
          ) : (
            <ul className="max-h-60 overflow-y-auto">
              {notifications.map((n, index) => (
                <li key={index} className="border-b border-gray-200 py-2">
                  <p className="font-medium">{n.title}</p>
                  <p className="text-gray-600 text-sm">{n.message}</p>
                  <p className="text-gray-400 text-xs">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
