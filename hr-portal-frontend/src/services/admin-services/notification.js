// src/services/notificationService.js
import axios from "axios";
import { getToken } from "../../services/authService"; // Adjust this path if authService is elsewhere

const BASE_URL = "https://hr-management-production-7384.up.railway.app/api/notifications";

export const createAdminNotification = async (notificationData) => {
  const response = await axios.post(
    `${BASE_URL}/create-notification`,
    notificationData,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  return response.data;
};