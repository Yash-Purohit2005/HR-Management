import API from "../api";

export const updateAdminProfileAPI = (data) => {
  return API.patch("/admin/employees/admin/update-profile", data);
};

export default{
    updateAdminProfileAPI
}