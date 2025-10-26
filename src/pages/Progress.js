import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { ProgressService } from "../services/progressService";
import { useNavigate } from "react-router-dom";

const Progress = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progressStats, setProgressStats] = useState(null);
  const [detailedProgress, setDetailedProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) {
        console.log("No user found");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching progress for user:", user.uid);
        const stats = await ProgressService.getProgressStats(user.uid);
        const detailed = await ProgressService.getUserProgress(user.uid);
        
        console.log("Progress stats:", stats);
        console.log("Detailed progress:", detailed);
        
        setProgressStats(stats);
        setDetailedProgress(detailed);
      } catch (error) {
        console.error("Error fetching progress:", error);
        // Set default values if there's an error
        setProgressStats({
          totalLessons: 12,
          completedLessons: 0,
          videosWatched: 0,
          subjectProgress: {
            science: { completed: 0, videosWatched: 0, total: 3, progress: 0 },
            math: { completed: 0, videosWatched: 0, total: 3, progress: 0 },
            technology: { completed: 0, videosWatched: 0, total: 3, progress: 0 },
            // engineering: { completed: 0, videosWatched: 0, total: 3, progress: 0 }
          },
          overallProgress: 0
        });
        setDetailedProgress({});
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0a1a2b] via-[#0b2236] to-black text-gray-200">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-300">Loading your progress...</p>
      </div>
    );
  }

  // If no user, show login prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1a2b] via-[#0b2236] to-black text-gray-200 p-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-red-400 mb-4">📊 Your Learning Progress</h1>
          <p className="text-gray-300 mb-8">Please log in to view your progress</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const subjects = [
    { key: 'science', name: 'Science', icon: '🧪', color: 'text-green-400' },
    { key: 'math', name: 'Mathematics', icon: '📘', color: 'text-blue-400' },
    { key: 'technology', name: 'Technology', icon: '💻', color: 'text-purple-400' },
    // { key: 'engineering', name: 'Engineering', icon: '⚙️', color: 'text-yellow-400' }
  ];

  const lessonNames = {
    1: 'Introduction',
    2: 'Basic Concepts', 
    3: 'Advanced Concepts'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a2b] via-[#0b2236] to-black text-gray-200 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-400 mb-4">📊 Your Learning Progress</h1>
          <p className="text-gray-300">Track your completed lessons and video watch progress</p>
          <p className="text-sm text-gray-500 mt-2">User: {user?.email || 'Not logged in'}</p>
        </div>

        {/* Overall Stats */}
        {progressStats && (
          <div className="bg-[#0f2942] border border-red-600/50 rounded-2xl p-6 mb-8 shadow-lg">
            <h2 className="text-2xl font-bold text-red-400 mb-6">Overall Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{progressStats.completedLessons}</div>
                <div className="text-sm text-gray-400">Lessons Completed</div>
                <div className="text-xs text-gray-500">out of {progressStats.totalLessons}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{progressStats.videosWatched}</div>
                <div className="text-sm text-gray-400">Videos Watched</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{progressStats.overallProgress}%</div>
                <div className="text-sm text-gray-400">Overall Progress</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">
                  {Math.round((progressStats.videosWatched / progressStats.totalLessons) * 100)}%
                </div>
                <div className="text-sm text-gray-400">Video Completion</div>
              </div>
            </div>
            <div className="mt-6">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-red-500 to-yellow-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressStats.overallProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Show message if no progress data yet */}
        {!progressStats && (
          <div className="bg-[#0f2942] border border-red-600/50 rounded-2xl p-6 mb-8 shadow-lg text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-4">No Progress Data Yet</h2>
            <p className="text-gray-300 mb-4">
              Start learning to see your progress here! Complete lessons and watch videos to track your journey.
            </p>
            <button 
              onClick={() => navigate('/learning')}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded transition"
            >
              Start Learning
            </button>
          </div>
        )}

        {/* Subject Progress Cards */}
        {progressStats && (
          <div className="bg-[#0f2942] border border-red-600/50 rounded-2xl p-6 mb-8 shadow-lg">
            <h2 className="text-2xl font-bold text-red-400 mb-6 text-center">📚 Subject Progress</h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(progressStats.subjectProgress).map(([subject, data]) => {
                const subjectIcons = {
                  science: "🧪",
                  math: "📘", 
                  technology: "💻"
                  /* engineering: "⚙️" */
                };
                const subjectNames = {
                  science: "Science",
                  math: "Mathematics",
                  technology: "Technology" 
                  /* engineering: "Engineering" */
                };
                
                return (
                  <div 
                    key={subject}
                    onClick={() => navigate(`/learning/${subject}`)}
                    className="bg-[#0a1a2b] border border-red-600/50 rounded-2xl p-6 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{subjectIcons[subject]}</span>
                      <span className="text-lg font-bold text-red-400">{data.progress}%</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{subjectNames[subject]}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Completed:</span>
                        <span className="text-green-400">{data.completed}/{data.total}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Videos:</span>
                        <span className="text-blue-400">{data.videosWatched}/{data.total}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                        <div 
                          className="bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${data.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Detailed Progress by Subject */}
        {detailedProgress && (
          <div className="space-y-6">
            {subjects.map(subject => (
              <div key={subject.key} className="bg-[#0f2942] border border-red-600/50 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{subject.icon}</span>
                    <h3 className="text-xl font-bold text-white">{subject.name}</h3>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${subject.color}`}>
                      {progressStats?.subjectProgress[subject.key]?.progress || 0}%
                    </div>
                    <div className="text-sm text-gray-400">
                      {progressStats?.subjectProgress[subject.key]?.completed || 0}/3 completed
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[1, 2, 3].map(lessonId => {
                    const lessonKey = `${subject.key}.${lessonId}`;
                    const lessonData = detailedProgress[lessonKey];
                    const isCompleted = lessonData?.completed || false;
                    const isVideoWatched = lessonData?.videoWatched || false;

                    return (
                      <div 
                        key={lessonId}
                        onClick={() => navigate(`/learning/${subject.key}/${lessonId}`)}
                        className="bg-[#0a1a2b] rounded-xl p-4 border border-gray-600/30 hover:border-red-500/50 transition cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-semibold text-white">
                              {lessonId}. {lessonNames[lessonId]}
                            </span>
                            <div className="flex space-x-2">
                              {isVideoWatched && (
                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                  📹 Video Watched
                                </span>
                              )}
                              {isCompleted && (
                                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                  ✅ Completed
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {isVideoWatched ? (
                              <span className="text-green-400">📹</span>
                            ) : (
                              <span className="text-gray-500">📹</span>
                            )}
                            {isCompleted ? (
                              <span className="text-green-400">✅</span>
                            ) : (
                              <span className="text-gray-500">⏳</span>
                            )}
                          </div>
                        </div>
                        {lessonData?.completedAt && (
                          <div className="mt-2 text-xs text-gray-400">
                            Completed on: {new Date(lessonData.completedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Subject Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${progressStats?.subjectProgress[subject.key]?.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
