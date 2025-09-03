// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDh8I1SeW9KYTjaEjRg0A74owZjZbQBftg",
  authDomain: "pwai-b8b35.firebaseapp.com",
  projectId: "pwai-b8b35",
  storageBucket: "pwai-b8b35.firebasestorage.app",
  messagingSenderId: "980512964436",
  appId: "1:980512964436:web:60a893e3dc4b6c865092c1",
  measurementId: "G-SN6ZP844ZZ",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
