import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const VerifyEmail: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const db = getFirestore();
    const { verifyEmail } = useAuth();

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
                }
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        checkVerification();
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const schoolId = localStorage.getItem('schoolId');
            if (!schoolId) {
                throw new Error('No school ID found');
            }

            const isValid = await verifyEmail(schoolId, verificationCode);
            if (isValid) {
                navigate('/quiz');
            } else {
                setError('Invalid verification code. Please try again.');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Verify Your Email</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Please enter the 6-digit verification code sent to your email.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="verificationCode" className="sr-only">
                            Verification Code
                        </label>
                        <input
                            id="verificationCode"
                            name="verificationCode"
                            type="text"
                            required
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="Enter 6-digit code"
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                            maxLength={6}
                            pattern="\d{6}"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">{error}</div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Verifying...' : 'Verify Email'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyEmail; 