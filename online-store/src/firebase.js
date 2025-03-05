// Import the necessary Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGbiDKJClIXpIIslVHN84YW4hcY07I0ZE",
  authDomain: "online-store-a9fc8.firebaseapp.com",
  projectId: "online-store-a9fc8",
  storageBucket: "online-store-a9fc8.appspot.com", // Fixed the storageBucket URL
  messagingSenderId: "317045298356",
  appId: "1:317045298356:web:7d5f702db40160bba2b3e1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Export Firebase services
export {
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  googleProvider,
  facebookProvider,
  signInWithPopup
};
