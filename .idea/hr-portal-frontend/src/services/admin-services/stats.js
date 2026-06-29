import axios from "axios";
import { getToken } from "../authService";

export const getEmployeeStats = async () => {
  
  const token = getToken();
   const response = await axios.get("http://localhost:8080/api/admin/employees/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


