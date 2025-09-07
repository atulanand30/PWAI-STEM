import { Link, useParams } from "react-router-dom";

const LessonList = () => {
  const { subject } = useParams();

  // static lesson titles
  const lessons = [
    { id: 1, title: "Introduction" },
    { id: 2, title: "Basic Concepts" },
    { id: 3, title: "Advanced Concepts" },
  ];

  // choose icon for the subject
  const subjectIcons = {
    math: "📘",
    science: "🧪",
    technology: "💻",
    engineering: "⚙️",
  };
  const icon = subjectIcons[subject.toLowerCase()] || "📘";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a2b] via-[#0b2236] to-black text-gray-200 p-6">
      <h1 className="text-3xl font-bold text-red-400 mb-6 text-center">
        {subject.toUpperCase()} Lessons
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            to={`/learning/${subject}/${lesson.id}`}
            className="bg-[#0f2942] border border-red-600/50 rounded-2xl p-6 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition cursor-pointer text-center"
          >
            <span className="text-5xl">{icon}</span>
            <h3 className="text-xl font-bold mt-3 text-red-400">
              {lesson.title}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LessonList;
