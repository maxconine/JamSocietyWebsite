import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously, User, onAuthStateChanged } from 'firebase/auth';

interface UserData {
    email: string;
    isAdmin: boolean;
    createdAt: string;
    schoolId: string;
    firstName: string;
    lastName: string;
    classYear: string;
}

export interface AuthContextType {
    isAuthenticated: boolean;
    isAdmin: boolean;
    user: User | null;
    userData: UserData | null;
    login: (schoolId: string) => Promise<void>;
    logout: () => Promise<void>;
    registerNewUser: (schoolId: string, email: string, firstName: string, lastName: string, classYear: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const db = getFirestore();
    const auth = getAuth();

    const validateSchoolId = (schoolId: string) => {
        if (!schoolId) {
            throw new Error('School ID is required');
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

    const registerNewUser = async (schoolId: string, email: string, firstName: string, lastName: string, classYear: string): Promise<void> => {
        try {
            // Validate school ID
            validateSchoolId(schoolId);

            // Validate email
            const trimmedEmail = email.trim();
            validateEmail(trimmedEmail);

            if (!firstName || !lastName || !classYear) {
                throw new Error('First name, last name, and class year are required.');
            }

            // Store user profile in Firestore using schoolId as the document ID
            const userData: UserData = {
                email: trimmedEmail,
                isAdmin: false,
                createdAt: new Date().toISOString(),
                schoolId: schoolId,
                firstName,
                lastName,
                classYear
            };

            await setDoc(doc(db, 'users', schoolId), {
                ...userData,
            });

            // Sign in anonymously
            await signInAnonymously(auth);
            localStorage.setItem('schoolId', schoolId);
            setIsAuthenticated(true);
            setUserData(userData);

            // Redirect to quiz page after registration
            window.location.href = '/quiz';
        } catch (error: any) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const login = async (schoolId: string) => {
        try {
            validateSchoolId(schoolId);
            
            // First check if user exists in Firestore
            const userDoc = await getDoc(doc(db, 'users', schoolId));
            if (!userDoc.exists()) {
                throw new Error('User not found. Please join Jam Society through our membership form: https://forms.gle/oy9483FkZGwEBc1u7');
            }
            
            const userData = userDoc.data() as UserData;
            
            // Sign in anonymously
            await signInAnonymously(auth);

            setUserData(userData);
            setIsAdmin(userData.isAdmin);
            localStorage.setItem('schoolId', schoolId);
            setIsAuthenticated(true);
        } catch (error: any) {
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

    // Add Firebase Auth state listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                // Try to get user data from Firestore
                const schoolId = localStorage.getItem('schoolId');
                if (schoolId) {
                    const userDoc = await getDoc(doc(db, 'users', schoolId));
                    if (userDoc.exists()) {
                        const userData = userDoc.data() as UserData;
                        setUserData(userData);
                        setIsAdmin(userData.isAdmin);
                        setIsAuthenticated(true);
                    }
                }
            } else {
                setUser(null);
                setUserData(null);
                setIsAuthenticated(false);
                setIsAdmin(false);
            }
        });

        return () => unsubscribe();
    }, []);

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

// 🔄 Firestore ➜ Sheet
function importFirestoreToSheet() {
  const token = getFirestoreToken();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Updated Inventory");
  sheet.clearContents();

  const headers = [
    "Image", "Item Code", "Item Name", "Location", "Type", "Description", "Value", "Owner",
    "Condition", "Notes", "Label Type", "Status",
    "Last Checked Out Name", "Last Checked Out Email", "Checkout Description",
    "Reason For Checkout", "Last Checked Out Date", "Last Returned Date", "Last Returned Notes"
  ];
  sheet.appendRow(headers);

  let pageToken = null;
  let allDocuments = [];

  do {
    let url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/equipment`;
    if (pageToken) {
      url += `?pageToken=${pageToken}`;
    }

    const response = UrlFetchApp.fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = JSON.parse(response.getContentText());
    if (data.documents) {
      allDocuments = allDocuments.concat(data.documents);
    }
    pageToken = data.nextPageToken;
  } while (pageToken);

  // Process all documents
  for (const doc of allDocuments) {
    const f = doc.fields || {};
    sheet.appendRow([
      f.image?.stringValue || "",
      f.code?.stringValue || "",
      f.name?.stringValue || "",
      f.location?.stringValue || "",
      f.type?.stringValue || "",
      f.description?.stringValue || "",
      f.price?.doubleValue || "",
      f.owner?.stringValue || "",
      f.condition?.stringValue || "",
      f.notes?.stringValue || "",
      f.labelType?.stringValue || "",
      f.status?.stringValue || "",
      f.lastCheckedOutByName?.stringValue || "",
      f.lastCheckedOutByEmail?.stringValue || "",
      f.checkoutDescription?.stringValue || "",
      f.reason?.stringValue || "",
      f.lastCheckedOutDate?.stringValue || "",
      f.lastReturnedDate?.stringValue || "",
      f.lastReturnedNotes?.stringValue || ""
    ]);
  }
} 