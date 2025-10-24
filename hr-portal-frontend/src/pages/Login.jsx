import { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api"; // Axios instance

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("jwt"); // clear any old token on page load
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Call backend login endpoint
     const response = await API.post("/auth/login", { email, password }, { withCredentials: true });

      // Get JWT from response
      const token = response.data.token;

      // Store JWT in localStorage
      localStorage.setItem("jwt", token);

      // Optionally store role for role-based UI
      localStorage.setItem("role", response.data.role);

      // Redirect to Dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      const message =
      error.response?.data?.message ||
      (error.response?.status === 500 && error.response?.data?.message?.includes("inactive")
        ? "Account is inactive. Contact admin."
        : "Login failed");

    alert(message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">HR Portal Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>

      </div>
    </div>
  );
}

export default Login;
