import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../index.css";

const subjects = [
  {
    id: "science",
    name: "Science",
    icon: "🔬",
    description: "Explore Physics, Chemistry, and Biology.",
  },
  {
    id: "technology",
    name: "Technology",
    icon: "💻",
    description: "Learn about computers, coding, and AI.",
  },
  {
    id: "engineering",
    name: "Engineering",
    icon: "⚙️",
    description: "Discover how things are built and designed.",
  },
  {
    id: "math",
    name: "Math",
    icon: "📐",
    description: "Master algebra, geometry, and more.",
  },
];

const Learning = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const openLesson = (subjectId) => {
    navigate(`/learning/${subjectId}`);
  };

  useEffect(() => {
    // Simulating data fetch delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading subjects...</p>
      </div>
    );
  }

  return (
    <div className="learning-container">
      {/* Header */}
      <header className="learning-header">
        <h1>📚 Choose a Subject</h1>
        <p>Select a subject to start your learning journey</p>
      </header>

      {/* Subjects */}
      <div className="subject-grid">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="subject-card"
            onClick={() => openLesson(subject.id)}
          >
            <div className="subject-icon">{subject.icon}</div>
            <h3>{subject.name}</h3>
            <p>{subject.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Learning;
