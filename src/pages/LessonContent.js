// src/pages/LessonContent.js
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const LessonContent = () => {
  const { subject, lessonId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a2b] via-[#0b2236] to-black text-gray-200 p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
      >
        ← Back
      </button>
      <h1 className="text-3xl font-bold text-red-400">
        {subject.toUpperCase()} Lesson {lessonId}
      </h1>
      <p className="mt-4 text-gray-300">
        This is placeholder content for lesson {lessonId} in {subject}.<br />
        Later you can embed text, videos, quizzes, etc. here.
      </p>
    </div>
  );
};

export default LessonContent;
