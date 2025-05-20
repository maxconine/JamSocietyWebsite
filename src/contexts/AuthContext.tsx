import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getUserBySchoolId } from '../firebase/db';

interface UserData {
    firstName?: string;
    lastName?: string;
    email?: string;
    classYear?: string;
    quizPassed?: boolean;
    isAdmin: boolean;
    createdAt: string;
    emailVerified: boolean;
}

interface AuthContextType {
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (schoolId: string) => Promise<void>;
    registerNewUser: (userData: Omit<UserData, 'isAdmin' | 'createdAt'> & { schoolId: string; password?: string }) => Promise<void>;
    logout: () => void;
    setQuizPassed: (schoolId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const db = getFirestore();
    const auth = getAuth();

    const ADMIN_IDS = ['40226906', '40225571'];

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
            if (userDoc.exists()) {
                const userData = userDoc.data() as UserData;
                setIsAuthenticated(true);
                setIsAdmin(userData.isAdmin || ADMIN_IDS.includes(schoolId));
                localStorage.setItem('schoolId', schoolId);
            } else {
                throw new Error('NEW_USER');
            }
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
            
            // Create a Firebase Auth user using the school ID as the password
            const userCredential = await createUserWithEmailAndPassword(auth, userData.email!, userData.schoolId);
            // Send verification email
            await sendEmailVerification(userCredential.user);
            
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
                emailVerified: false
            });
            setIsAuthenticated(false); // Not authenticated until email is verified and quiz is passed
            setIsAdmin(isAdminUser);
            localStorage.setItem('schoolId', userData.schoolId);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setIsAdmin(false);
        localStorage.removeItem('schoolId');
    };

    // Function to set quizPassed to true after quiz completion
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
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, registerNewUser, logout, setQuizPassed }}>
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