import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Building2,
  Save,
  ArrowLeft,
  AlertTriangle
} from "lucide-react";

import { getAdminProfile } from "../../services/admin-services/adminService";
import { updateAdminProfileAPI } from "../../services/admin-services/editProfile";

export default function UpdateEmployee() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailChanged, setEmailChanged] = useState(false);
  const [originalEmail, setOriginalEmail] = useState("");

  useEffect(() => {
    getAdminProfile()
      .then(res => {
        const data = res.data;
        setForm({
          name: data.username,
          email: data.email,
          phone: data.phone || "",
          department: data.department || ""
        });
        setOriginalEmail(data.email);
      })
      .catch(() => setError("Failed to load profile"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === "email") {
      setEmailChanged(value !== originalEmail);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await updateAdminProfileAPI(form);

      if (res.forceLogout) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      navigate("/admin/admin-profile");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="bg-white rounded-t-xl p-6 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-600 rounded-lg flex items-center justify-center">
              <User className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>
              <p className="text-sm text-gray-500">
                Update your personal details
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/admin/admin-profile")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-b-xl shadow-sm p-6 space-y-5"
        >
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Username */}
          <Input
            label="Username"
            icon={<User size={18} />}
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          {/* Email */}
          <Input
            label="Email"
            icon={<Mail size={18} />}
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          {emailChanged && (
            <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg text-sm">
              <AlertTriangle size={18} />
              Changing email will log you out after saving.
            </div>
          )}

          {/* Phone */}
          <Input
            label="Phone"
            icon={<Phone size={18} />}
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          {/* Department */}
          <Input
            label="Department"
            icon={<Building2 size={18} />}
            name="department"
            value={form.department}
            onChange={handleChange}
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate("/admin/admin-profile")}
              className="px-5 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------------- Reusable Input ---------------- */

function Input({ label, icon, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
        <input
          {...props}
          className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
    </div>
  );
}
