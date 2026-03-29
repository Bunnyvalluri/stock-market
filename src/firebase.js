import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Add your Firebase configuration object below or pass through Vite .env mapping
// Firebase configuration with safety trim to strip hidden \r from env variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.trim() || "YOUR_FIREBASE_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim() || "YOUR_AUTH_DOMAIN",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim() || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim() || "YOUR_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim() || "YOUR_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID?.trim() || "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication & Providers
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
