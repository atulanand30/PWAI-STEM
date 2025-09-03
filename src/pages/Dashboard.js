import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState(
    user?.displayName || user?.email || ""
  );
  const [loading, setLoading] = useState(!user?.displayName);

  const handleLogout = async () => {
    try {
      await logout();
      toast.info("👋 Logged out successfully");
      navigate("/login");
    } catch (e) {
      toast.error("❌ Logout failed: " + e.message);
    }
  };

  useEffect(() => {
    const fetchName = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        //Fetch from user's own document (safe rules allow this)
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setUserName(snap.data().name || user.email);
        } else {
          setUserName(user.email);
        }
      } catch (err) {
        console.error("Error fetching user:", err.message);
        toast.error("⚠️ Failed to fetch profile data");
        setUserName(user.email);
      }

      setLoading(false);
    };

    fetchName();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0a1a2b] via-[#0b2236] to-black text-gray-200">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-300">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a2b] via-[#0b2236] to-black text-gray-200 p-6">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-red-400">
          Welcome, {userName || "Learner"} 👋
        </h1>
        <p className="text-gray-300">
          Ready to continue your learning journey?
        </p>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded transition"
        >
          Logout
        </button>
      </header>

      {/* Cards */}
      <section className="max-w-6xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div
          onClick={() => navigate("/learning")}
          className="bg-[#0f2942] border border-red-600/50 rounded-2xl p-6 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition cursor-pointer"
        >
          <span className="text-5xl">📚</span>
          <h3 className="text-xl font-bold mt-3 text-red-400">
            Start Learning
          </h3>
          <p className="text-gray-300 mt-1">
            Choose a subject and begin your next lesson.
          </p>
        </div>

        <div
          onClick={() => navigate("/progress")}
          className="bg-[#0f2942] border border-red-600/50 rounded-2xl p-6 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition cursor-pointer"
        >
          <span className="text-5xl">📊</span>
          <h3 className="text-xl font-bold mt-3 text-red-400">View Progress</h3>
          <p className="text-gray-300 mt-1">
            Check your completed lessons and scores.
          </p>
        </div>

        <div
          onClick={() => navigate("/chatbot")}
          className="bg-[#0f2942] border border-red-600/50 rounded-2xl p-6 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition cursor-pointer"
        >
          <span className="text-5xl">🤖</span>
          <h3 className="text-xl font-bold mt-3 text-red-400">AI Chatbot</h3>
          <p className="text-gray-300 mt-1">
            Ask questions and get instant explanations.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
