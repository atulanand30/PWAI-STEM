import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ProgressService } from "../services/progressService";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState(
    user?.displayName || user?.email || ""
  );
  const [loading, setLoading] = useState(!user?.displayName);
  const [progressStats, setProgressStats] = useState(null);

  // const handleLogout = async () => {
  //   try {
  //     await logout();
  //     toast.info("👋 Logged out successfully");
  //     navigate("/login");
  //   } catch (e) {
  //     toast.error("❌ Logout failed: " + e.message);
  //   }
  // };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user name
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setUserName(snap.data().name || user.email);
        } else {
          setUserName(user.email);
        }

        // Fetch progress stats
        const stats = await ProgressService.getProgressStats(user.uid);
        setProgressStats(stats);
      } catch (err) {
        console.error("Error fetching user data:", err.message);
        setUserName(user.email);
        setProgressStats({
          totalLessons: 12,
          completedLessons: 0,
          videosWatched: 0,
          subjectProgress: {},
          overallProgress: 0
        });
      }

      setLoading(false);
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0a1a2b] via-[#0b2236] to-black text-gray-200">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-300">Loading your dashboard...</p>
      </div>
    );
  }

  // format join date
  const joinDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString()
    : "—";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a2b] via-[#0b2236] to-black text-gray-200 p-6">
      {/* User Info Card */}
      <div className="max-w-4xl mx-auto bg-[#0f2942] border border-red-600/50 rounded-2xl p-6 mb-8 shadow-lg">
        <h1 className="text-3xl font-extrabold text-red-400">
          Welcome, {userName || "Learner"} 👋
        </h1>
        <p className="text-gray-300">
          Email: <span className="text-silver-300">{user?.email}</span>
        </p>
        <p className="text-gray-300">
          Joined on: <span className="text-silver-300">{joinDate}</span>
        </p>
        
        {/* Progress Overview */}
        {progressStats && (
          <div className="mt-6 bg-[#0a1a2b] rounded-xl p-4 border border-red-500/30">
            <h2 className="text-xl font-bold text-red-400 mb-4">📊 Your Learning Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{progressStats.completedLessons}</div>
                <div className="text-sm text-gray-400">Lessons Completed</div>
                <div className="text-xs text-gray-500">out of {progressStats.totalLessons}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{progressStats.videosWatched}</div>
                <div className="text-sm text-gray-400">Videos Watched</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{progressStats.overallProgress}%</div>
                <div className="text-sm text-gray-400">Overall Progress</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressStats.overallProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>


      {/* Action Cards */}
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
