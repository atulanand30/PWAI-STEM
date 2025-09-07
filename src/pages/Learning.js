// src/pages/Learning.js
import React from "react";
import { useNavigate } from "react-router-dom";

const subjects = [
  {
    name: "Science",
    icon: "🔬",
    description: "Explore physics, chemistry, biology lessons",
  },
  {
    name: "Math",
    icon: "📐",
    description: "Learn algebra, geometry, calculus and more",
  },
  {
    name: "Technology",
    icon: "💻",
    description: "Dive into coding, AI and robotics",
  },
  // {
  //   name: "Engineering",
  //   icon: "⚙️",
  //   description: "Understand core engineering concepts",
  // },
];

const Learning = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a2b] via-[#0b2236] to-black text-gray-200 p-6">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-red-400">
          Choose Your Subject
        </h1>
        <p className="text-gray-300">Interactive STEM lessons — even offline</p>
      </header>

      <section className="max-w-6xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subj) => (
          <div
            key={subj.name}
            onClick={() => navigate(`/learning/${subj.name.toLowerCase()}`)}
            className="bg-[#0f2942] border border-red-600/50 rounded-2xl p-6 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition cursor-pointer"
          >
            <span className="text-5xl">{subj.icon}</span>
            <h3 className="text-xl font-bold mt-3 text-red-400">{subj.name}</h3>
            <p className="text-gray-300 mt-1">{subj.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Learning;
