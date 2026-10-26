import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  onSnapshot 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB8a9cAUDsKkmrLa8zWvOV73wJ3DbAKMz8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "thadi-be51b.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "thadi-be51b",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "thadi-be51b.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "999011807810",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:999011807810:web:3ea3ad56eaa661327a73db",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-YXYTVV7BQP"
};

// Only initialize if API key is present
const isConfigured = !!firebaseConfig.apiKey;

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (isConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  } catch (err) {
    console.warn("Firebase initialization skipped or failed:", err);
  }
}

export { auth, db, googleProvider, isConfigured };

/**
 * Sign in with Google Popup
 */
export async function loginWithGoogle() {
  if (!auth || !googleProvider) {
    throw new Error("Firebase is not configured yet. Please configure your .env.local file with Firebase credentials.");
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google sign in error:", error);
    throw error;
  }
}

/**
 * Sign out
 */
export async function logoutUser() {
  if (auth) {
    await signOut(auth);
  }
}

/**
 * Sync user profile to Firestore
 */
export async function syncUserProfile(uid, profileData) {
  if (!db || !uid) return;
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { profile: profileData, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (e) {
    console.error("Error syncing profile:", e);
  }
}

/**
 * Sync weight history to Firestore
 */
export async function syncWeightHistory(uid, historyData) {
  if (!db || !uid) return;
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { weightHistory: historyData, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (e) {
    console.error("Error syncing weight history:", e);
  }
}

/**
 * Sync daily log to Firestore
 */
export async function syncDailyLog(uid, dateKey, logData) {
  if (!db || !uid) return;
  try {
    const logRef = doc(db, 'users', uid, 'dailyLogs', dateKey);
    await setDoc(logRef, { ...logData, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (e) {
    console.error("Error syncing daily log:", e);
  }
}

/**
 * Load all user data from Firestore
 */
export async function loadUserData(uid) {
  if (!db || !uid) return null;
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (e) {
    console.error("Error loading user data:", e);
  }
  return null;
}
