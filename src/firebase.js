import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Surgical sanitization: Strips all whitespace, newlines, and non-printable characters ONLY
const clean = (val) => String(val || "").replace(/[\s\r\n\t]/g, "").trim();

const firebaseConfig = {
  apiKey: clean(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: clean(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: clean(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: clean(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: clean(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: clean(import.meta.env.VITE_FIREBASE_APP_ID)
};

console.log("Firebase initialized with sanitized keys. Key ends with (encoded):", encodeURIComponent(firebaseConfig.apiKey.slice(-5)));

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication & Providers
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
