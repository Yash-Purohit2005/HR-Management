import { useEffect, useState } from "react";
import { User, Mail, Phone, Calendar, Building2, Briefcase, UserCheck, Shield } from "lucide-react";
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
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header Section */}
      <div className="flex items-center gap-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <img
          src={`https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=fff&color=1E40AF&size=128`}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-white shadow-md"
        />
        <div>
          <h2 className="text-3xl font-semibold">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="text-blue-100">{profile.designation} • {profile.department}</p>
          <span
            className={`inline-block mt-2 px-3 py-1 text-sm rounded-full font-medium ${
              profile.active
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {profile.active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-gray-700">
        <div className="flex items-center gap-3">
          <Mail className="text-blue-600" size={20} />
          <span className="font-medium">Email:</span>
          <span className="text-gray-600">{profile.email}</span>
        </div>

        <div className="flex items-center gap-3">
          <User className="text-blue-600" size={20} />
          <span className="font-medium">Username:</span>
          <span className="text-gray-600">{profile.username}</span>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="text-blue-600" size={20} />
          <span className="font-medium">Phone:</span>
          <span className="text-gray-600">{profile.phone}</span>
        </div>

        <div className="flex items-center gap-3">
          <UserCheck className="text-blue-600" size={20} />
          <span className="font-medium">Gender:</span>
          <span className="text-gray-600">{profile.gender}</span>
        </div>

        <div className="flex items-center gap-3">
          <Building2 className="text-blue-600" size={20} />
          <span className="font-medium">Previous Company:</span>
          <span className="text-gray-600">{profile.previousCompany}</span>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="text-blue-600" size={20} />
          <span className="font-medium">Joining Date:</span>
          <span className="text-gray-600">{profile.joiningDate}</span>
        </div>

        <div className="flex items-center gap-3 col-span-2">
          <Shield className="text-blue-600" size={20} />
          <span className="font-medium">Roles:</span>
          <div className="flex flex-wrap gap-2">
            {profile.roles.map((role, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

