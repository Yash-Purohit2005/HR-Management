import axios from "axios";
import { getToken } from "../authService";

export const getRecentActivities = async (page = 0, size = 5) => {
  const token = getToken();

  const response = await axios.get(
    `https://hr-management-production-7384.up.railway.app/api/admin/employees/logs/recent?page=${page}&size=${size}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
