/**
 * Firebase Configuration for Jam Society Website
 *
 * This module initializes Firebase services for:
 * - Authentication (user login/logout)
 * - Firestore database (equipment, reservations, user data)
 * - Cloud Storage (image uploads)
 */
/**
 * Firebase project configuration
 * Contains all necessary keys and identifiers for the Jam Society Firebase project
 */
export declare const firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
};
export declare const auth: import("@firebase/auth").Auth;
export declare const db: import("@firebase/firestore").Firestore;
export declare const storage: import("@firebase/storage").FirebaseStorage;
