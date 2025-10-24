import { useEffect, useState } from "react";
import API from "../services/api";

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    API.get("/user/profile")
      .then(res => setProfile(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      <div className="space-y-3">
        <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Phone:</strong> {profile.phone}</p>
        <p><strong>Gender:</strong> {profile.gender}</p>
        <p><strong>Department:</strong> {profile.department}</p>
        <p><strong>Designation:</strong> {profile.designation}</p>
        <p><strong>Previous Company:</strong> {profile.previousCompany}</p>
        <p><strong>Joining Date:</strong> {profile.joiningDate}</p>
        <p><strong>Status:</strong> {profile.active ? "Active" : "Inactive"}</p>
        <p><strong>Roles:</strong> {profile.roles.join(", ")}</p>
      </div>
    </div>
  );
}

export default Profile;

