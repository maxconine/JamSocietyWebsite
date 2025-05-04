import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

interface UserData {
    firstName?: string;
    lastName?: string;
    email?: string;
    isAdmin: boolean;
    createdAt: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (schoolId: string) => Promise<void>;
    registerNewUser: (userData: Omit<UserData, 'isAdmin' | 'createdAt'> & { schoolId: string }) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const db = getFirestore();

    const ADMIN_IDS = ['40226906'];

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

    const registerNewUser = async (userData: Omit<UserData, 'isAdmin' | 'createdAt'> & { schoolId: string }) => {
        try {
            validateSchoolId(userData.schoolId);
            validateEmail(userData.email);
            const isAdminUser = ADMIN_IDS.includes(userData.schoolId);
            await setDoc(doc(db, 'users', userData.schoolId), {
                ...userData,
                isAdmin: isAdminUser,
                createdAt: new Date().toISOString()
            });
            setIsAuthenticated(true);
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

    useEffect(() => {
        const storedSchoolId = localStorage.getItem('schoolId');
        if (storedSchoolId) {
            login(storedSchoolId).catch(() => {
                localStorage.removeItem('schoolId');
            });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, registerNewUser, logout }}>
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