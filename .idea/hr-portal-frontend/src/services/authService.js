// services/authService.js
export const getToken = () => localStorage.getItem("jwt");
export const getRole = () => localStorage.getItem("role");
export const getUsername = () => localStorage.getItem("username");
export const isAuthenticated = () => !!getToken();

export const logout = () => {
  localStorage.removeItem("jwt");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
  window.location.href = "/"; // back to login
};
