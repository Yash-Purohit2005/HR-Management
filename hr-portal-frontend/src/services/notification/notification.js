// src/services/notificationService.js
import axios from "axios";
import { getToken } from "../../services/authService";

const BASE_URL = "https://hr-management-production-7384.up.railway.app/api/notifications";

// GET: Fetch top 10 notifications for the logged-in user
export const getUserNotifications = async () => {
  const response = await axios.get(`${BASE_URL}/get-notification`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data; 
};