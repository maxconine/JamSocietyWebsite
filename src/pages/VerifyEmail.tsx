import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const VerifyEmail: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const db = getFirestore();

    useEffect(() => {
        const checkVerification = async () => {
            try {
                const schoolId = localStorage.getItem('schoolId');
                if (!schoolId) {
                    throw new Error('No school ID found');
                }

                const userDoc = await getDoc(doc(db, 'users', schoolId));
                if (!userDoc.exists()) {
                    throw new Error('User not found');
                }

                const userData = userDoc.data();
                if (userData.emailVerified) {
                    navigate('/quiz');
                } else {
                    setError('Please verify your email before proceeding');
                }
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        checkVerification();
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Checking verification status...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Verification Required</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default VerifyEmail; 