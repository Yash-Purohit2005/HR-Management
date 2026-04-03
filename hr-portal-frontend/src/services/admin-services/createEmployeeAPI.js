import axios from "axios";
import { getToken } from "../authService";

export const createEmployeeAPI = async (employeeData) => {
  const token = getToken();

  const response = await axios.post("http://localhost:8080/api/admin/employees/create-employee",
    employeeData,
    {
       headers : {
         Authorization : `Bearer ${token}`,
         "Content-Type" : "application/json"
       }
    }
  );
};
