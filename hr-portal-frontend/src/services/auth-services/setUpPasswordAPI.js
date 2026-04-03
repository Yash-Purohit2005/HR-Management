import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/auth";

export const setupPasswordAPI = async (token, password) => {
  // We send the token and password as a JSON body to match your Spring Boot DTO
  const response = await axios.post(`${API_BASE_URL}/setup-password`, {
    token: token,
    password: password
  });
  return response.data;
};