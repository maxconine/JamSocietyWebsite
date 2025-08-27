// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
    apiKey: "AIzaSyDE1MvLqd7kJT00OpvFXDC-KhThLyRJKR8",
    authDomain: "jamsoc-2473e.firebaseapp.com",
    projectId: "jamsoc-2473e",
    storageBucket: "jamsoc-2473e.appspot.com",
    messagingSenderId: "122646849215",
    appId: "1:122646849215:web:31f0896174eb8931fec80a"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);