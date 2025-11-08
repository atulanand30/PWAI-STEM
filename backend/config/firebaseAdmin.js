// backend/config/firebaseAdmin.js
import admin from "firebase-admin";
import fs from "fs";
import path from "path";

let firebaseInitialized = false;

try {
  const serviceAccountPath = path.resolve("config/firebase-service-account.json");

  const serviceAccount = JSON.parse(
    fs.readFileSync(serviceAccountPath, "utf8")
  );

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://pwai-b8b35-default-rtdb.firebaseio.com",
    });
    firebaseInitialized = true;
    console.log("🔥 Firebase Admin initialized successfully (from JSON file)");
  }
} catch (error) {
  console.error("❌ Failed to initialize Firebase Admin:", error.message);
}

export { admin, firebaseInitialized };