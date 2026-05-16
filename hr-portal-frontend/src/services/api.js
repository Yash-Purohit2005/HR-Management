import axios from "axios";
import { getToken } from "./authService";


const API = axios.create({
  baseURL: "https://hr-management-production-7384.up.railway.app/api",
  withCredentials: true,
});
// Automatically attach JWT to all requests
API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout(); // remove JWT + redirect to login
    }
    return Promise.reject(error);
  }
);

export default API;

