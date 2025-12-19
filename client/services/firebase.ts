import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAYGfaNn60KWL-Q-JJBZWgEk6LSpyq3AUs",
  authDomain: "legally-ee5f9.firebaseapp.com",
  projectId: "legally-ee5f9",
  storageBucket: "legally-ee5f9.firebasestorage.app",
  messagingSenderId: "448771419380",
  appId: "1:448771419380:web:51d35b8c1c85b87c2602a1",
  measurementId: "G-1Y3XBM7RH0",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

const onAuthStateChangedWithAuth = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};

const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

const signInWithGithub = async () => {
  try {
    const provider = new GithubAuthProvider();
    provider.addScope("user:email");
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("GitHub sign-in error:", error);
    throw error;
  }
};

export {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseSignOut,
  onAuthStateChangedWithAuth,
  signInWithGoogle,
  signInWithGithub,
};
