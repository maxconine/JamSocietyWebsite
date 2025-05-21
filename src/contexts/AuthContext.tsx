import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, User } from 'firebase/auth';
import axios from 'axios';

interface UserData {
    email: string;
    isAdmin: boolean;
    createdAt: string;
    quizPassed?: boolean;
    schoolId: string;
}

export interface AuthContextType {
    isAuthenticated: boolean;
    isAdmin: boolean;
    user: User | null;
    userData: UserData | null;
    login: (schoolId: string) => Promise<void>;
    logout: () => Promise<void>;
    registerNewUser: (schoolId: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const db = getFirestore();

    const validateSchoolId = (schoolId: string) => {
        if (!/^\d{8}$/.test(schoolId)) {
            throw new Error('School ID must be exactly 8 digits');
        }
    };

    const validateEmail = (email: string) => {
        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Please enter a valid email address');
        }

        // Domain validation
        const validDomains = ['@hmc.edu', '@g.hmc.edu'];
        if (!validDomains.some(domain => email.toLowerCase().endsWith(domain))) {
            throw new Error('Email must end with @hmc.edu or @g.hmc.edu');
        }

        // Additional validation for common issues
        if (email.includes(' ')) {
            throw new Error('Email cannot contain spaces');
        }
        if (email.length > 254) {
            throw new Error('Email is too long');
        }
    };

    const registerNewUser = async (schoolId: string, email: string, password: string): Promise<void> => {
        try {
            // Validate school ID
            validateSchoolId(schoolId);

            // Validate email
            const trimmedEmail = email.trim();
            validateEmail(trimmedEmail);

            // Validate password
            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }

            const auth = getAuth();

            // Create Firebase Auth user
            const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
            // const firebaseUser = userCredential.user; // No longer needed for Firestore doc ID

            // Store user profile in Firestore using schoolId as the document ID
            const userData: UserData = {
                email: trimmedEmail,
                isAdmin: false,
                createdAt: new Date().toISOString(),
                quizPassed: false,
                schoolId: schoolId
            };

            await setDoc(doc(db, 'users', schoolId), {
                ...userData,
            });

            // Redirect to quiz page after registration
            window.location.href = '/quiz';
        } catch (error: any) {
            console.error('Registration error:', error);
            
            // Handle specific Firebase errors
            switch (error.code) {
                case 'auth/email-already-in-use':
                    throw new Error('This email is already registered. Please try logging in instead.');
                case 'auth/invalid-email':
                    throw new Error('Please enter a valid email address ending with @hmc.edu or @g.hmc.edu');
                case 'auth/weak-password':
                    throw new Error('Password is too weak. Please use at least 6 characters.');
                case 'auth/operation-not-allowed':
                    throw new Error('Email/password accounts are not enabled. Please contact support.');
                default:
                    if (error.message) {
                        throw new Error(error.message);
                    }
                    throw new Error('An error occurred during registration. Please try again.');
            }
        }
    };

    const login = async (schoolId: string) => {
        try {
            validateSchoolId(schoolId);
            // Directly get the user doc by schoolId
            const userDoc = await getDoc(doc(db, 'users', schoolId));
            if (!userDoc.exists()) {
                throw new Error('NEW_USER');
            }
            const userData = userDoc.data() as UserData;
            const email = userData.email;
            if (!email) {
                throw new Error('No email found for this user.');
            }
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, email, schoolId);
            setUserData(userData);
            setIsAdmin(userData.isAdmin);
            localStorage.setItem('schoolId', schoolId);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUser(null);
        setUserData(null);
        localStorage.removeItem('schoolId');
    };

    useEffect(() => {
        const schoolId = localStorage.getItem('schoolId');
        if (schoolId) {
            checkAuth(schoolId);
        }
    }, []);

    const checkAuth = async (schoolId: string) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', schoolId));
            if (userDoc.exists()) {
                const userData = userDoc.data() as UserData;
                setIsAuthenticated(true);
                setIsAdmin(userData.isAdmin);
                setUserData(userData);
            }
        } catch (error) {
            console.error('Error checking auth:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, user, userData, login, logout, registerNewUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 