import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(name, email, password);

      toast.success("🎉 Registration successful! Please login.");

      // Redirect directly to login page
      navigate("/login");
    } catch (error) {
      console.error("Register error:", error);

      if (error.code === "auth/email-already-in-use") {
        toast.error("❌ Email already registered.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("❌ Invalid email format.");
      } else if (error.code === "auth/weak-password") {
        toast.error("❌ Password should be at least 6 characters.");
      } else if (error.message === "auth/firestore-permission-denied") {
        toast.error("⚠️ Firestore permission denied. Check your rules.");
      } else {
        toast.error("❌ Registration failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-black">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md border border-red-500">
        <h2 className="text-2xl font-bold text-center text-red-400 mb-6">
          Create Account
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-red-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
