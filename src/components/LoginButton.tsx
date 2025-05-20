import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import RegistrationForm from './RegistrationForm';

const LoginButton: React.FC = () => {
    const { login } = useAuth();
    const [schoolId, setSchoolId] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showRegistration, setShowRegistration] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await login(schoolId);
        } catch (err) {
            if (err instanceof Error) {
                if (err.message === 'NEW_USER') {
                    setShowRegistration(true);
                } else {
                    setError(err.message);
                }
            } else {
                setError('Failed to login. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLogin(e);
        }
    };

    return (
        <>
            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter School ID #"
                    className="px-3 py-1 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-yellow-500 placeholder-white font-roboto font-medium text-sm"
                    pattern="\d{8}"
                    title="School ID must be exactly 8 digits"
                />
                <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 text-white-700 font-small"
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}
            </div>

            {showRegistration && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-clear rounded-lg shadow-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">New User Registration</h2>
                            <button
                                onClick={() => {
                                    setShowRegistration(false);
                                    setSchoolId('');
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <RegistrationForm
                            schoolId={schoolId}
                            onCancel={() => {
                                setShowRegistration(false);
                                setSchoolId('');
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default LoginButton; 