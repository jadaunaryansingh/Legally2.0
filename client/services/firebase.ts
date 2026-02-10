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
import {
  getDatabase,
  ref,
  push,
  set,
  get,
  update,
  serverTimestamp,
  query,
  orderByChild,
  limitToLast,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAYGfaNn60KWL-Q-JJBZWgEk6LSpyq3AUs",
  authDomain: "legally-ee5f9.firebaseapp.com",
  databaseURL: "https://legally-ee5f9-default-rtdb.firebaseio.com",
  projectId: "legally-ee5f9",
  storageBucket: "legally-ee5f9.firebasestorage.app",
  messagingSenderId: "448771419380",
  appId: "1:448771419380:web:51d35b8c1c85b87c2602a1",
  measurementId: "G-1Y3XBM7RH0",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

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

// Database functions for user data and chat history

interface UserData {
  uid: string;
  email: string;
  phone?: string;
  createdAt: any;
  lastLogin: any;
  displayName?: string;
  photoURL?: string;
}

interface ChatMessage {
  id?: string;
  userId: string;
  userEmail: string;
  message: string;
  response: string;
  category?: string;
  timestamp: any;
}

// Save or update user data
export const saveUserData = async (userData: Partial<UserData>) => {
  try {
    const userId = userData.uid || auth.currentUser?.uid;
    if (!userId) {
      throw new Error("No user ID provided");
    }

    // Remove undefined values to avoid Firebase errors
    const cleanUserData = Object.fromEntries(
      Object.entries(userData).filter(([_, value]) => value !== undefined)
    );

    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      // Update existing user
      await update(userRef, {
        ...cleanUserData,
        lastLogin: serverTimestamp(),
      });
    } else {
      // Create new user
      await set(userRef, {
        ...cleanUserData,
        uid: userId,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });
    }

    return true;
  } catch (error) {
    console.error("Error saving user data:", error);
    throw error;
  }
};

// Save chat message
export const saveChatMessage = async (chatData: Omit<ChatMessage, 'id'>) => {
  try {
    const userId = chatData.userId || auth.currentUser?.uid;
    if (!userId) {
      throw new Error("No user ID provided");
    }

    const chatsRef = ref(database, `chats/${userId}`);
    const newChatRef = push(chatsRef);
    
    await set(newChatRef, {
      ...chatData,
      userId,
      timestamp: serverTimestamp(),
    });

    return newChatRef.key;
  } catch (error) {
    console.error("Error saving chat message:", error);
    throw error;
  }
};

// Get user data
export const getUserData = async (userId?: string) => {
  try {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) {
      throw new Error("No user ID provided");
    }

    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      return snapshot.val() as UserData;
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};

// Get user's chat history
export const getUserChats = async (userId?: string, limit: number = 50) => {
  try {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) {
      throw new Error("No user ID provided");
    }

    const chatsRef = ref(database, `chats/${uid}`);
    const chatsQuery = query(chatsRef, orderByChild('timestamp'), limitToLast(limit));
    const snapshot = await get(chatsQuery);
    
    if (snapshot.exists()) {
      const chats: ChatMessage[] = [];
      snapshot.forEach((child) => {
        chats.push({
          id: child.key || '',
          ...child.val(),
        });
      });
      return chats.reverse(); // Most recent first
    }
    return [];
  } catch (error) {
    console.error("Error getting user chats:", error);
    throw error;
  }
};

// Update last login timestamp
export const updateLastLogin = async (userId?: string) => {
  try {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) {
      throw new Error("No user ID provided");
    }

    const userRef = ref(database, `users/${uid}`);
    await update(userRef, {
      lastLogin: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error updating last login:", error);
    throw error;
  }
};

// Get all users (for admin panel)
export const getAllUsers = async () => {
  try {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    
    if (snapshot.exists()) {
      const users: UserData[] = [];
      snapshot.forEach((child) => {
        users.push(child.val());
      });
      return users;
    }
    return [];
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
};

// Get all chats (for admin panel)
export const getAllChats = async () => {
  try {
    const chatsRef = ref(database, 'chats');
    const snapshot = await get(chatsRef);
    
    if (snapshot.exists()) {
      const allChats: ChatMessage[] = [];
      snapshot.forEach((userChats) => {
        userChats.forEach((chat) => {
          allChats.push({
            id: chat.key || '',
            ...chat.val(),
          });
        });
      });
      return allChats.sort((a, b) => b.timestamp - a.timestamp);
    }
    return [];
  } catch (error) {
    console.error("Error getting all chats:", error);
    throw error;
  }
};

export {
  auth,
  database,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseSignOut,
  onAuthStateChangedWithAuth,
  signInWithGoogle,
  signInWithGithub,
};
