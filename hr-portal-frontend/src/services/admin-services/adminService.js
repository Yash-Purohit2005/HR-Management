import API from "../api";

export const getAdminProfile = () => {
  return API.get("/admin/employees/admin-profile");
};

export default{
  getAdminProfile
}