import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);

      toast.success("✅ Login successful! Welcome back.");
      navigate("/dashboard"); // go to dashboard immediately
    } catch (error) {
      console.error("Login error:", error);

      if (error.code === "auth/user-not-found") {
        toast.error("❌ No account found with this email.");
      } else if (error.code === "auth/wrong-password") {
        toast.error("❌ Incorrect password.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("❌ Invalid email format.");
      } else {
        toast.error("❌ Login failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-black">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md border border-red-500">
        <h2 className="text-2xl font-bold text-center text-red-400 mb-6">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white font-semibold"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-gray-400 mt-4 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-red-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
