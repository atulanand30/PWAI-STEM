import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import InstallPrompt from "../components/InstallPrompt";

const AppHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a2b] via-[#0b2236] to-black text-gray-200">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Learn smarter with <span className="text-red-500">AI STEM PWA</span>
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Personalized STEM learning, offline friendly, with instant AI help.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => navigate(user ? "/dashboard" : "/login")}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              🚀 {user ? "Go to Dashboard" : "Get Started"}
            </button>
            <button
              onClick={() => navigate("/register")}
              className="border border-gray-500 hover:border-red-500 hover:text-red-400 px-6 py-3 rounded-lg font-semibold transition"
            >
              Create Account
            </button>
            <div className="flex items-center">
              <InstallPrompt />
            </div>
          </div>
        </div>

        <div className="flex md:justify-end">
          <img
            className="w-64 md:w-80 drop-shadow-[0_10px_25px_rgba(239,68,68,0.35)]"
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Learning"
          />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-16 grid gap-6 grid-cols-1 md:grid-cols-3">
        <div className="bg-[#0f2942] border border-red-600/50 rounded-xl p-6 hover:-translate-y-1 hover:shadow-2xl transition cursor-pointer">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2910/2910768.png"
            alt=""
            className="w-14 mb-4 fill-white"
          />
          <h3 className="text-xl font-bold text-red-400">STEM Learning</h3>
          <p className="text-gray-300 mt-1">
            Interactive Science, Technology, Engineering, and Math lessons.
          </p>
        </div>
        <div className="bg-[#0f2942] border border-red-600/50 rounded-xl p-6 hover:-translate-y-1 hover:shadow-2xl transition cursor-pointer">
          <img
            src="https://cdn-icons-png.flaticon.com/512/942/942748.png"
            alt=""
            className="w-14 mb-4"
          />
          <h3 className="text-xl font-bold text-red-400">Track Progress</h3>
          <p className="text-gray-300 mt-1">
            Visualize your growth and celebrate milestones.
          </p>
        </div>
        <div className="bg-[#0f2942] border border-red-600/50 rounded-xl p-6 hover:-translate-y-1 hover:shadow-2xl transition cursor-pointer">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
            alt=""
            className="w-14 mb-4"
          />
          <h3 className="text-xl font-bold text-red-400">AI Chatbot</h3>
          <p className="text-gray-300 mt-1">
            Ask questions and get instant explanations.
          </p>
        </div>
      </section>

      <footer className="text-center text-gray-400 border-t border-red-600/40 py-6">
        © {new Date().getFullYear()} AI STEM PWA — Learning Made Smarter
      </footer>
    </div>
  );
};

export default AppHome;
