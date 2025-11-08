import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { verifyFirebaseToken } from "./middleware/authMiddleware.js";
import * as firebaseAdminModule from "./config/firebaseAdmin.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ===== Initialize Firebase Admin =====
const admin =
  (firebaseAdminModule && firebaseAdminModule.admin) ||
  (firebaseAdminModule && firebaseAdminModule.default) ||
  null;

let db = null;
if (admin && typeof admin.firestore === "function") {
  try {
    db = admin.firestore();
    console.log("✅ Firestore db reference obtained.");
  } catch (err) {
    console.error("⚠ Could not get Firestore db reference:", err.message);
    db = null;
  }
} else {
  console.log("⚠ Firebase Admin not available — using in-memory storage.");
}

// ===== Initialize Gemini =====
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ===== Sample Lessons =====
const lessons = [
  { id: 1, subject: "science", title: "Introduction to Physics" },
  { id: 2, subject: "science", title: "Basics of Chemistry" },
  { id: 3, subject: "science", title: "Advanced Biology" },
  { id: 4, subject: "math", title: "Fundamentals of Algebra" },
  { id: 5, subject: "math", title: "Geometry Basics" },
  { id: 6, subject: "math", title: "Advanced Calculus" },
  { id: 7, subject: "technology", title: "Introduction to AI" },
  { id: 8, subject: "engineering", title: "Engineering Design Basics" },
];

// ===== In-memory fallback store =====
const fallbackProgressStore = {};
const fallbackChatHistory = {}; // { userId: [ { role, content } ] }

// ===== Helper functions =====
async function getUserProgress(userId) {
  if (db) {
    const docRef = db.collection("userProgress").doc(userId);
    const snap = await docRef.get();
    return snap.exists ? snap.data() : {};
  }
  return fallbackProgressStore[userId] || {};
}

async function updateUserProgress(userId, subject, lessonId, updateData) {
  if (db) {
    const docRef = db.collection("userProgress").doc(userId);
    await docRef.set(
      {
        [subject]: {
          [`lesson_${lessonId}`]: updateData,
        },
      },
      { merge: true }
    );
  } else {
    if (!fallbackProgressStore[userId]) fallbackProgressStore[userId] = {};
    if (!fallbackProgressStore[userId][subject])
      fallbackProgressStore[userId][subject] = {};
    fallbackProgressStore[userId][subject][`lesson_${lessonId}`] = {
      ...(fallbackProgressStore[userId][subject][`lesson_${lessonId}`] || {}),
      ...updateData,
    };
  }
  return true;
}

// ===== Routes =====

// ✅ Test Route
app.get("/api/test", (req, res) => {
  res.json({ message: "🚀 Backend connected successfully!" });
});

// ✅ Lessons
app.get("/api/lessons", (req, res) => {
  res.json(lessons);
});

// ✅ User progress (Protected)
app.get("/api/progress", verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const progress = await getUserProgress(userId);

    let completed = 0,
      total = 0;
    const subjects = Object.keys(progress || {});
    subjects.forEach((sub) => {
      const lessons = progress[sub] || {};
      Object.values(lessons).forEach((l) => {
        total++;
        if (l.completed) completed++;
      });
    });

    res.json({
      totalLessons: total || 10,
      completedLessons: completed,
      progress,
    });
  } catch (error) {
    console.error("❌ Error fetching progress:", error);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

// ✅ Mark video watched
app.post("/api/video", verifyFirebaseToken, async (req, res) => {
  try {
    const { subject, lessonId } = req.body;
    const userId = req.user.uid;

    if (!subject || !lessonId)
      return res.status(400).json({ error: "Invalid request" });

    await updateUserProgress(userId, subject, lessonId, { videoWatched: true });
    res.json({ message: "Video marked as watched ✅" });
  } catch (error) {
    console.error("❌ Error marking video watched:", error);
    res.status(500).json({ error: "Failed to update video progress" });
  }
});

// ✅ Mark lesson completed
app.post("/api/lesson", verifyFirebaseToken, async (req, res) => {
  try {
    const { subject, lessonId } = req.body;
    const userId = req.user.uid;

    if (!subject || !lessonId)
      return res.status(400).json({ error: "Invalid request" });

    await updateUserProgress(userId, subject, lessonId, { completed: true });
    res.json({ message: "Lesson marked as completed ✅" });
  } catch (error) {
    console.error("❌ Error marking lesson completed:", error);
    res.status(500).json({ error: "Failed to update lesson progress" });
  }
});

// ✅ Chatbot Route (Gemini + Firestore memory)
app.post("/api/chat", verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    // Load user's chat history
    let chatHistory = [];
    if (db) {
      const chatRef = db.collection("chatHistory").doc(userId);
      const snap = await chatRef.get();
      if (snap.exists) chatHistory = snap.data().messages || [];
    } else {
      chatHistory = fallbackChatHistory[userId] || [];
    }

    chatHistory.push({ role: "user", content: message });

    // ✅ Generate Gemini response (safe parsing)
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash-lite" });
    const result = await model.generateContent(message);

    let reply = "";
    if (result?.response?.candidates?.[0]?.content?.parts?.length) {
      // Extract all text parts from the response
      reply = result.response.candidates[0].content.parts
        .map((p) => p.text)
        .join(" ")
        .trim();
    } else {
      reply = result?.response?.text?.() || "Sorry, I couldn’t process that.";
    }

    chatHistory.push({ role: "assistant", content: reply });

    // Save chat history
    if (db) {
      await db.collection("chatHistory").doc(userId).set({ messages: chatHistory });
    } else {
      fallbackChatHistory[userId] = chatHistory;
    }

    res.json({ reply });
  } catch (error) {
    console.error("❌ Gemini error:", error);
    res.status(500).json({
      reply: "Sorry, I couldn’t process that.",
      details: error.message,
    });
  }
});


// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));