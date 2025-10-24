import { useState, useEffect } from "react";
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
    <div className="bg-white p-6 rounded shadow max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["firstName", "lastName", "email", "phone"].map((field) => (
          <div key={field}>
            <label
              htmlFor={field}
              className="block text-sm font-medium text-gray-700"
            >
              {field.replace(/^\w/, (c) => c.toUpperCase())}
            </label>
            <input
              type={field === "email" ? "email" : "text"}
              id={field}
              name={field}
              value={profile[field] || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default UpdateProfile;
