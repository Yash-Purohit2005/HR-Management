// pages/ChangePassword.jsx
import { useState } from "react";
import { Lock, Eye, EyeOff, Shield } from "lucide-react";
import { ToastContainer,toast } from "react-toastify";
import API from "../services/api"; // your axios instance
import { getToken } from "../services/authService";

function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (form.newPassword !== form.confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    setLoading(true);
    try {
      await API.put("/user/change-password", form, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      toast.success("Password changed successfully ");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "❌ Password change failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
     <ToastContainer position="top-right" autoClose={3000}  />
    <div className="max-w-lg mx-auto mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5">
        <div className="flex items-center gap-3">
          <Shield size={22} />
          <h2 className="text-xl font-semibold">Change Password</h2>
        </div>
        <span className="text-sm text-blue-100">Security Settings</span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Old Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Lock size={16} className="text-blue-600" />
            Old Password
          </label>
          <div className="relative">
            <input
              type={showPassword.old ? "text" : "password"}
              name="oldPassword"
              value={form.oldPassword}
              onChange={handleChange}
              required
              placeholder="Enter current password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword({ ...showPassword, old: !showPassword.old })
              }
              className="absolute right-3 top-2.5 text-gray-500 hover:text-blue-600"
            >
              {showPassword.old ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Lock size={16} className="text-blue-600" />
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword.new ? "text" : "password"}
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
              placeholder="Enter new password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword({ ...showPassword, new: !showPassword.new })
              }
              className="absolute right-3 top-2.5 text-gray-500 hover:text-blue-600"
            >
              {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Lock size={16} className="text-blue-600" />
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPassword.confirm ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter new password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword({
                  ...showPassword,
                  confirm: !showPassword.confirm,
                })
              }
              className="absolute right-3 top-2.5 text-gray-500 hover:text-blue-600"
            >
              {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2 font-medium text-white rounded-lg py-2.5 shadow transition-all ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <>
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
              Changing...
            </>
          ) : (
            <>
              <Lock size={18} />
              Change Password
            </>
          )}
        </button>
      </form>
    </div>
    </div>
  );
}

export default ChangePassword;
