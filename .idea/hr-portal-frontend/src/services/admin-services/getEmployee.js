import axios from "axios";
import { getToken } from "../authService";

export const fetchEmployeesAPI = async (query = {}, page = 0, pageSize = 10) => {
  const token = getToken();
  let url = "http://localhost:8080/api/admin/employees/get-all-employee";
  let params = { page, size: pageSize };

  if (query.keyword) {
    url = "http://localhost:8080/api/admin/employees/search";
    params.keyword = query.keyword;
  } else if (query.department || query.designation || query.active !== undefined) {
    url = "http://localhost:8080/api/admin/employees/filter";
    params = { ...params, ...query };
  } else if (query.sort) {
    // Sorting endpoint
    url = "http://localhost:8080/api/admin/employees/sort";
    params.direction = query.sortDirection || "asc"; // default ascending
  }

  const response = await axios.get(url, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};
