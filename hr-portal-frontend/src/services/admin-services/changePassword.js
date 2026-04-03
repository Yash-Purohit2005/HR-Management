import API from "../api";

export const changePasswordAPI = (data) => {
  return API.put("/user/change-password", data);
};

export default{
    changePasswordAPI
}