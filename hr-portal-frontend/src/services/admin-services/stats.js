import axios from "axios";
import { getToken } from "../authService";

export const getEmployeeStats = async () => {
  
  const token = getToken();
   const response = await axios.get("https://hr-management-production-7384.up.railway.app/api/admin/employees/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


