import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

// Escape-proof sanitization: Strips both real CRLF and literal "\r" / "\n" strings
const clean = (val) => String(val || "").replace(/\\r/g, "").replace(/\\n/g, "").replace(/[\s\r\n\t]/g, "").trim();

const firebaseConfig = {
  apiKey: "AIzaSyCJZZaikCRCSdkDKd7M8IB0V-dQlRNaiGM",
  authDomain: "stock-market-9f99e.firebaseapp.com",
  projectId: "stock-market-9f99e",
  storageBucket: "stock-market-9f99e.firebasestorage.app",
  messagingSenderId: "913684856590",
  appId: "1:913684856590:web:032abbfc415dc45d4ee15f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication & Providers
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
