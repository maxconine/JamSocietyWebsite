// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDE1MvLqd7kJT00OpvFXDC-KhThLyRJKR8",
    authDomain: "jamsoc-2473e.firebaseapp.com",
    projectId: "jamsoc-2473e",
    storageBucket: "jamsoc-2473e.firebasestorage.app",
    messagingSenderId: "122646849215",
    appId: "1:122646849215:web:31f0896174eb8931fec80a",
    measurementId: "G-42XB69XEFB"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const auth = getAuth(app);