import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ProgressService } from "../services/progressService";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const LessonContent = () => {
  const { subject, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isVideoWatched, setIsVideoWatched] = useState(false);
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);

  // subject icons
  const subjectIcons = {
    math: "📘",
    science: "🧪",
    technology: "💻",
    // engineering: "⚙️",
  };

  // static lessons
  const lessons = {
    1: "Introduction",
    2: "Basic Concepts",
    3: "Advanced Concepts",
  };

  const icon = subjectIcons[subject.toLowerCase()] || "📘";
  const current = parseInt(lessonId, 10);
  const title = lessons[current] || "Lesson";

  // previous & next lesson ids
  const prevLesson = current > 1 ? current - 1 : null;
  const nextLesson = current < Object.keys(lessons).length ? current + 1 : null;

  // Check current progress status
  useEffect(() => {
    const checkProgress = async () => {
      if (!user) return;
      
      try {
        // Initialize progress document if needed
        await ProgressService.initializeUserProgress(user.uid);
        
        // Get progress status
        const videoWatched = await ProgressService.isVideoWatched(user.uid, subject.toLowerCase(), current);
        const lessonCompleted = await ProgressService.isLessonCompleted(user.uid, subject.toLowerCase(), current);
        
        console.log(`Progress check for ${subject.toLowerCase()} lesson ${current}:`, {
          videoWatched,
          lessonCompleted
        });
        
        setIsVideoWatched(videoWatched);
        setIsLessonCompleted(lessonCompleted);
      } catch (error) {
        console.error("Error checking progress:", error);
        toast.error("Failed to load progress status");
      }
    };

    checkProgress();
  }, [user, subject, current]);

  // Handle video watch tracking
  const handleVideoWatch = async () => {
    if (!user) {
      toast.error("Please log in to track your progress");
      return;
    }

    try {
      const success = await ProgressService.markVideoWatched(user.uid, subject.toLowerCase(), current);
      if (success) {
        setIsVideoWatched(true);
        toast.success("📹 Video marked as watched!");
        
        // Verify the status was updated
        const verified = await ProgressService.isVideoWatched(user.uid, subject.toLowerCase(), current);
        if (!verified) {
          console.error("Video watched status verification failed");
          toast.error("Failed to verify progress update");
          setIsVideoWatched(false);
        }
      } else {
        toast.error("Failed to update progress");
      }
    } catch (error) {
      console.error("Error marking video as watched:", error);
      toast.error("Failed to update progress");
    }
  };

  // Handle lesson completion
  const handleLessonComplete = async () => {
    if (!user) {
      toast.error("Please log in to track your progress");
      return;
    }

    try {
      const success = await ProgressService.markLessonCompleted(user.uid, subject.toLowerCase(), current);
      if (success) {
        setIsLessonCompleted(true);
        toast.success("🎉 Lesson marked as completed!");
        
        // Verify the status was updated
        const verified = await ProgressService.isLessonCompleted(user.uid, subject.toLowerCase(), current);
        if (!verified) {
          console.error("Lesson completion status verification failed");
          toast.error("Failed to verify progress update");
          setIsLessonCompleted(false);
        }
      } else {
        toast.error("Failed to update progress");
      }
    } catch (error) {
      console.error("Error marking lesson as completed:", error);
      toast.error("Failed to update progress: " + (error.message || "Unknown error"));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a2b] via-[#0b2236] to-black text-gray-200 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-6xl">{icon}</span>
        <h1 className="text-3xl font-bold text-red-400 mt-3">
          {subject.toUpperCase()} {title}
        </h1>
        <p className="text-gray-400">Deep dive into {title.toLowerCase()}.</p>
      </div>

      {/* Content */}
      <div className="bg-[#0f2942] border border-red-600/50 rounded-2xl p-6 shadow-lg text-gray-300">
        <p>
          This is the <span className="text-red-400">{title}</span> lesson for{" "}
          <span className="text-red-400">{subject}</span>.
          {/* Add your content here
          (text, images, videos, quizzes, etc). */}
        </p>
      </div>
      {/* YouTube Video - Only for Science Introduction */}
      {subject.toLowerCase() === 'science' && current === 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex flex-col justify-between">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/QVq5htPY_BA?si=BKjpNqGRj63QWB1g" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            <div className="flex space-x-2 mt-2">
              <button 
                onClick={handleVideoWatch}
                disabled={isVideoWatched}
                className={`font-semibold py-2 px-5 rounded transition ${
                  isVideoWatched 
                    ? 'bg-green-500 text-white cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isVideoWatched ? '📹 Video Watched' : '📹 Mark Video Watched'}
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded transition">Quizes</button>
            </div>
          </div>
        </div>
      )}
      {/* YouTube Video - Only for Science Basics */}
      {subject.toLowerCase() === 'science' && current === 2 && (
        <div className="mt-6 flex justify-center">
          <div className="flex flex-col justify-between">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/QjFP7ywz3A0?si=hg7OEyo5OJeKbB3k"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
            <div className="flex space-x-2 mt-2">
              <button 
                onClick={handleVideoWatch}
                disabled={isVideoWatched}
                className={`font-semibold py-2 px-5 rounded transition ${
                  isVideoWatched 
                    ? 'bg-green-500 text-white cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isVideoWatched ? '📹 Video Watched' : '📹 Mark Video Watched'}
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded transition">Quizes</button>
            </div>
          </div>
        </div>
      )}
      {/* YouTube Video - Only for Science advances */}
      {subject.toLowerCase() === 'science' && current === 3 && (
        <div className="mt-6 flex justify-center">
          <div className="flex flex-col justify-between">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/lv6dC0coQeI?si=Oe34f_YqHUAJoJiu" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            <div className="flex space-x-2 mt-2">
              <button 
                onClick={handleVideoWatch}
                disabled={isVideoWatched}
                className={`font-semibold py-2 px-5 rounded transition ${
                  isVideoWatched 
                    ? 'bg-green-500 text-white cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isVideoWatched ? '📹 Video Watched' : '📹 Mark Video Watched'}
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded transition">Quizes</button>
            </div>
          </div>
        </div>
      )}


      {/* YouTube Video - Only for Maths intro */}
      {subject.toLowerCase() === 'math' && current === 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex flex-col justify-between">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/64643Op6WJo?si=dL8PeoR-0_t0eKBe" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            <div className="flex space-x-2 mt-2">
              <button 
                onClick={handleVideoWatch}
                disabled={isVideoWatched}
                className={`font-semibold py-2 px-5 rounded transition ${
                  isVideoWatched 
                    ? 'bg-green-500 text-white cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isVideoWatched ? '📹 Video Watched' : '📹 Mark Video Watched'}
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded transition">Quizes</button>
            </div>
          </div>
        </div>
      )}
      {/* YouTube Video - Only for maths Basics */}
      {subject.toLowerCase() === 'math' && current === 2 && (
        <div className="mt-6 flex justify-center">
          <div className="flex flex-col justify-between">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/NybHckSEQBI?si=POJbMwFw4m4rY8VQ" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            <div className="flex space-x-2 mt-2">
              <button 
                onClick={handleVideoWatch}
                disabled={isVideoWatched}
                className={`font-semibold py-2 px-5 rounded transition ${
                  isVideoWatched 
                    ? 'bg-green-500 text-white cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isVideoWatched ? '📹 Video Watched' : '📹 Mark Video Watched'}
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded transition">Quizes</button>
            </div>
          </div>
        </div>
      )}
      {/* YouTube Video - Only for maths advanced */}
      {subject.toLowerCase() === 'math' && current === 3 && (
        <div className="mt-6 flex justify-center">
          <div className="flex flex-col justify-between">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/OmJ-4B-mS-Y?si=ahqWy1vYBMAdHhSo" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            <div className="flex space-x-2 mt-2">
              <button 
                onClick={handleVideoWatch}
                disabled={isVideoWatched}
                className={`font-semibold py-2 px-5 rounded transition ${
                  isVideoWatched 
                    ? 'bg-green-500 text-white cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isVideoWatched ? '📹 Video Watched' : '📹 Mark Video Watched'}
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded transition">Quizes</button>
            </div>
          </div>
        </div>
      )}


      {/* YouTube Video - Only for technoloy intro */}
      {subject.toLowerCase() === 'technology' && current === 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex flex-col justify-between">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/Fno0L_XsdWM?si=iarYJCiU8QAa6T98" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            <div className="flex space-x-2 mt-2">
              <button 
                onClick={handleVideoWatch}
                disabled={isVideoWatched}
                className={`font-semibold py-2 px-5 rounded transition ${
                  isVideoWatched 
                    ? 'bg-green-500 text-white cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isVideoWatched ? '📹 Video Watched' : '📹 Mark Video Watched'}
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded transition">Quizes</button>
            </div>
          </div>
        </div>
      )}
      {/* YouTube Video - Only for technology Basics */}
      {subject.toLowerCase() === 'technology' && current === 2 && (
        <div className="mt-6 flex justify-center">
          <div className="flex flex-col justify-between">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/difvQyWFmxw?si=yqRB1DxNryci6tUF" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            <div className="flex space-x-2 mt-2">
              <button 
                onClick={handleVideoWatch}
                disabled={isVideoWatched}
                className={`font-semibold py-2 px-5 rounded transition ${
                  isVideoWatched 
                    ? 'bg-green-500 text-white cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isVideoWatched ? '📹 Video Watched' : '📹 Mark Video Watched'}
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded transition">Quizes</button>
            </div>
          </div>
        </div>
      )}
      {/* YouTube Video - Only for technology advanced */}
      {subject.toLowerCase() === 'technology' && current === 3 && (
        <div className="mt-6 flex justify-center">
          <div className="flex flex-col justify-between">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/ttIOdAdQaUE?si=mlEyyWGTcSwIaVmE" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            <div className="flex space-x-2 mt-2">
              <button 
                onClick={handleVideoWatch}
                disabled={isVideoWatched}
                className={`font-semibold py-2 px-5 rounded transition ${
                  isVideoWatched 
                    ? 'bg-green-500 text-white cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isVideoWatched ? '📹 Video Watched' : '📹 Mark Video Watched'}
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded transition">Quizes</button>
            </div>
          </div>
        </div>
      )}

      {/* YouTube Video - Only for engineering intro */}
      {/* {subject.toLowerCase() === 'engineering' && current === 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex flex-col justify-between">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/btGYcizV0iI?si=lv9Z4U3oK4XVn_JT" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>            
            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded transition mt-2">Quizes</button>
          </div>
        </div>
      )} */}
      {/* YouTube Video - Only for engineering Basics */}
      {/* {subject.toLowerCase() === 'engineering' && current === 2 && (
        <div className="mt-6 flex justify-center">
          <div className="flex flex-col justify-between">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/u-xjja6mK2k?si=a8gjI_nvCFoQoYzw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>            
            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded transition mt-2">Quizes</button>
          </div>
        </div>
      )} */}
      {/* YouTube Video - Only for engineering advanced */}
      {/* {subject.toLowerCase() === 'engineering' && current === 3 && (
        <div className="mt-6 flex justify-center">
          <div className="flex flex-col justify-between">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/ttIOdAdQaUE?si=mlEyyWGTcSwIaVmE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded transition mt-2">Quizes</button>
          </div>
        </div>
      )} */}
      


      {/* Lesson Completion Section */}
      <div className="mt-8 flex justify-center">
        <div className="bg-[#0f2942] border border-red-600/50 rounded-2xl p-6 shadow-lg max-w-md w-full">
          <h3 className="text-xl font-bold text-red-400 mb-4 text-center">Complete This Lesson</h3>
          <p className="text-gray-300 text-center mb-4">
            Mark this lesson as completed when you've finished watching the video and understanding the content.
          </p>
          <button 
            onClick={handleLessonComplete}
            disabled={isLessonCompleted}
            className={`w-full font-semibold py-3 px-6 rounded transition ${
              isLessonCompleted 
                ? 'bg-green-500 text-white cursor-not-allowed' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isLessonCompleted ? '✅ Lesson Completed' : '🎯 Mark Lesson Complete'}
          </button>
          {isLessonCompleted && (
            <p className="text-green-400 text-sm text-center mt-2">
              Great job! This lesson is marked as completed.
            </p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex mx-auto justify-evenly max-w-2xl">
        {prevLesson ? (
          <button
            onClick={() => navigate(`/learning/${subject}/${prevLesson}`)}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded transition"
          >
            ⬅ Previous
          </button>
        ) : (
          <span />
        )}

        <Link
          to={`/learning/${subject}`}
          className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-5 rounded transition"
        >
          ⬅ Back to Lessons
        </Link>

        {nextLesson ? (
          <button
            onClick={() => navigate(`/learning/${subject}/${nextLesson}`)}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded transition"
          >
            Next ➡
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
};

export default LessonContent;
