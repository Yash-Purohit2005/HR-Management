import axios from "axios";
import { getToken } from "./authService";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true, // send cookies if you use them
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

