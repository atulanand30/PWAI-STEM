// backend/middleware/authMiddleware.js
import { admin, firebaseInitialized } from "../config/firebaseAdmin.js";

export const verifyFirebaseToken = async (req, res, next) => {
  if (!firebaseInitialized) {
    console.error("❌ Firebase Admin not initialized before verifying token");
    return res
      .status(500)
      .json({ error: "Internal server error (Firebase not ready)" });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided ❌" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(403).json({ error: "Invalid or expired token 🔐" });
  }
};