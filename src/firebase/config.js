/**
 * Firebase Configuration for Jam Society Website
 *
 * This module initializes Firebase services for:
 * - Authentication (user login/logout)
 * - Firestore database (equipment, reservations, user data)
 * - Cloud Storage (image uploads)
 */
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
/**
 * Firebase project configuration
 * Contains all necessary keys and identifiers for the Jam Society Firebase project
 */
export const firebaseConfig = {
    apiKey: "AIzaSyDE1MvLqd7kJT00OpvFXDC-KhThLyRJKR8",
    authDomain: "jamsoc-2473e.firebaseapp.com",
    projectId: "jamsoc-2473e",
    storageBucket: "jamsoc-2473e.appspot.com",
    messagingSenderId: "122646849215",
    appId: "1:122646849215:web:31f0896174eb8931fec80a"
};
// Initialize Firebase app
const app = initializeApp(firebaseConfig);
// Export Firebase services
export const auth = getAuth(app); // Authentication service
export const db = getFirestore(app); // Firestore database service
export const storage = getStorage(app); // Cloud Storage service
