import { useState, useEffect } from "react";
import { User, Mail, Phone, Save, Edit2 } from "lucide-react";
import API from "../services/api";

function UpdateProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/user/profile")
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put("/user/update-profile", profile);
      alert("Profile updated successfully!");
      setProfile(res.data);
    } catch (err) {
      console.error("Update failed:", err.response || err);
      if (err.response && err.response.status === 403) {
        alert("You are not authorized to update this profile.");
      } else {
        alert("Update failed. Please try again.");
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>No profile data found</p>;

  return (
     <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">
        <div className="flex items-center gap-3">
          <Edit2 size={22} />
          <h2 className="text-xl font-semibold">Update Profile</h2>
        </div>
        <span className="text-sm text-blue-100">HR Portal • Employee Settings</span>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
          >
            <User size={16} className="text-blue-600" />
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={profile.firstName || ""}
            onChange={handleChange}
            placeholder="Enter first name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Last Name */}
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
          >
            <User size={16} className="text-blue-600" />
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={profile.lastName || ""}
            onChange={handleChange}
            placeholder="Enter last name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
          >
            <Mail size={16} className="text-blue-600" />
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email || ""}
            onChange={handleChange}
            placeholder="Enter email address"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
          >
            <Phone size={16} className="text-blue-600" />
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={profile.phone || ""}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <div className="col-span-2 flex justify-end mt-4">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white font-medium px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 transition-all"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateProfile;
