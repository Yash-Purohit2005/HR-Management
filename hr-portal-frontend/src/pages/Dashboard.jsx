import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove JWT and role from localStorage
    localStorage.removeItem("jwt");
    localStorage.removeItem("role");

    // Redirect to login
    navigate("/");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 space-y-6">
      <h1 className="text-3xl font-bold">Welcome to HR Portal Dashboard</h1>

      {/* Example of showing username or role */}
      <p className="text-lg">
        Role: <span className="font-semibold">{localStorage.getItem("role")}</span>
      </p>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
