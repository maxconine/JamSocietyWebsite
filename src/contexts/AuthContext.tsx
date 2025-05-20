import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getUserBySchoolId } from '../firebase/db';
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from 'firebase/auth';

interface UserData {
    firstName?: string;
    lastName?: string;
    email?: string;
    classYear?: string;
    quizPassed?: boolean;
    isAdmin: boolean;
    createdAt: string;
    emailVerified: boolean;
    verificationCode?: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (schoolId: string) => Promise<void>;
    registerNewUser: (userData: Omit<UserData, 'isAdmin' | 'createdAt'> & { schoolId: string; password?: string }) => Promise<void>;
    logout: () => void;
    setQuizPassed: (schoolId: string) => Promise<void>;
    verifyEmail: (schoolId: string, code: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const db = getFirestore();

    const ADMIN_IDS = ['40226906', '40225571'];

    const generateVerificationCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    };

    const validateSchoolId = (schoolId: string) => {
        if (!/^\d{8}$/.test(schoolId)) {
            throw new Error('School ID must be exactly 8 digits');
        }
    };

    const validateEmail = (email: string) => {
        const validDomains = ['@hmc.edu', '@g.hmc.edu'];
        if (!validDomains.some(domain => email.toLowerCase().endsWith(domain))) {
            throw new Error('Email must end with @hmc.edu or @g.hmc.edu');
        }
    };

    const login = async (schoolId: string) => {
        try {
            validateSchoolId(schoolId);
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
            // Try to sign in with schoolId as password (since that's how you register)
            await signInWithEmailAndPassword(auth, email, schoolId);
            const isAuthVerified = auth.currentUser?.emailVerified;
            if (isAuthVerified && !userData.emailVerified) {
                // Sync Firestore if needed
                await setDoc(doc(db, 'users', schoolId), { emailVerified: true }, { merge: true });
            }
            if (!isAuthVerified && !userData.emailVerified) {
                throw new Error('Please verify your email before logging in');
            }
            setIsAuthenticated(true);
            setIsAdmin(userData.isAdmin || ADMIN_IDS.includes(schoolId));
            localStorage.setItem('schoolId', schoolId);
        } catch (error) {
            if (error instanceof Error && error.message === 'NEW_USER') {
                throw error;
            }
            console.error('Login error:', error);
            throw error;
        }
    };

    const registerNewUser = async (userData: Omit<UserData, 'isAdmin' | 'createdAt'> & { schoolId: string; password?: string }) => {
        try {
            validateSchoolId(userData.schoolId);
            validateEmail(userData.email || '');
            const isAdminUser = ADMIN_IDS.includes(userData.schoolId);
            const auth = getAuth();
            const password = userData.password || userData.schoolId;
            const verificationCode = generateVerificationCode();

            // Create Firebase Auth user
            const userCredential = await createUserWithEmailAndPassword(auth, userData.email!, password);
            
            // Store user profile in Firestore
            await setDoc(doc(db, 'users', userData.schoolId), {
                schoolId: userData.schoolId,
                firstName: userData.firstName,
                lastName: userData.lastName,
                classYear: userData.classYear,
                email: userData.email,
                quizPassed: false,
                isAdmin: isAdminUser,
                createdAt: new Date().toISOString(),
                emailVerified: false,
                verificationCode: verificationCode
            });

            // Send verification email with code
            // TODO: Implement email sending functionality here
            console.log('Verification code:', verificationCode); // For testing purposes

            // Sign out the user after registration
            await signOut(auth);
            setIsAuthenticated(false);
            setIsAdmin(isAdminUser);
            localStorage.setItem('schoolId', userData.schoolId);
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                throw new Error('This email is already in use.');
            }
            if (error.code === 'auth/invalid-email') {
                throw new Error('Invalid email address.');
            }
            if (error.code === 'auth/weak-password') {
                throw new Error('Password is too weak.');
            }
            console.error('Registration error:', error);
            throw error;
        }
    };

    const verifyEmail = async (schoolId: string, code: string): Promise<boolean> => {
        try {
            const userDoc = await getDoc(doc(db, 'users', schoolId));
            if (!userDoc.exists()) {
                throw new Error('User not found');
            }

            const userData = userDoc.data() as UserData;
            if (userData.verificationCode === code) {
                await setDoc(doc(db, 'users', schoolId), {
                    emailVerified: true,
                    verificationCode: null // Clear the code after successful verification
                }, { merge: true });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Verification error:', error);
            throw error;
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setIsAdmin(false);
        localStorage.removeItem('schoolId');
    };

    const setQuizPassed = async (schoolId: string) => {
        try {
            await setDoc(doc(db, 'users', schoolId), { quizPassed: true }, { merge: true });
        } catch (error) {
            console.error('Error setting quizPassed:', error);
            throw error;
        }
    };

    useEffect(() => {
        const schoolId = localStorage.getItem('schoolId');
        if (schoolId) {
            checkAuth(schoolId);
        }
    }, []);

    const checkAuth = async (schoolId: string) => {
        try {
            const user = await getUserBySchoolId(schoolId);
            if (user) {
                setIsAuthenticated(true);
                setIsAdmin(user.isAdmin);
            }
        } catch (error) {
            console.error('Error checking auth:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, registerNewUser, logout, setQuizPassed, verifyEmail }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 