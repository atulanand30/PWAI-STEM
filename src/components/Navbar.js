import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import InstallPrompt from "./InstallPrompt";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.info("👋 Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("❌ Logout failed: " + error.message);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 via-black to-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="PWAI Logo"
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-red-400">PWAI</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:text-red-400 transition">
              Home
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-red-400 transition">
                  Dashboard
                </Link>
                <InstallPrompt />
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-white transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-red-400 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-white transition"
                >
                  Register
                </Link>
                <InstallPrompt />
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="focus:outline-none"
            >
              <span className="text-2xl">☰</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 px-4 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block hover:text-red-400"
          >
            Home
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block hover:text-red-400"
              >
                Dashboard
              </Link>
              <div onClick={() => setMenuOpen(false)}>
                <InstallPrompt />
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full text-left bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block hover:text-red-400"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
              >
                Register
              </Link>
              <div onClick={() => setMenuOpen(false)}>
                <InstallPrompt />
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
