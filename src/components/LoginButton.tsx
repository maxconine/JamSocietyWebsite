import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginButton: React.FC = () => {
    const { login } = useAuth();
    const [schoolId, setSchoolId] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await login(schoolId);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to login. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <input
                type="text"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                placeholder="Enter School ID"
                className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                pattern="\d{8}"
                title="School ID must be exactly 8 digits"
            />
            <button
                onClick={handleLogin}
                disabled={isLoading}
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}
        </div>
    );
};

export default LoginButton; 