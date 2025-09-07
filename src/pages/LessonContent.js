import { useParams, Link, useNavigate } from "react-router-dom";

const LessonContent = () => {
  const { subject, lessonId } = useParams();
  const navigate = useNavigate();

  // subject icons
  const subjectIcons = {
    math: "📘",
    science: "🧪",
    technology: "💻",
    engineering: "⚙️",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a2b] via-[#0b2236] to-black text-gray-200 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-6xl">{icon}</span>
        <h1 className="text-3xl font-bold text-red-400 mt-3">
          {subject.toUpperCase()} – {title}
        </h1>
        <p className="text-gray-400">Deep dive into {title.toLowerCase()}.</p>
      </div>

      {/* Content */}
      <div className="bg-[#0f2942] border border-red-600/50 rounded-2xl p-6 shadow-lg text-gray-300">
        <p>
          This is the <span className="text-red-400">{title}</span> lesson for{" "}
          <span className="text-red-400">{subject}</span>. Add your content here
          (text, images, videos, quizzes, etc).
        </p>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
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
