import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [schoolId, setSchoolId] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showRegistration, setShowRegistration] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        const db = getFirestore();
        try {
            // Query Firestore for user by schoolId
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('schoolId', '==', schoolId));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                // Not found, show registration
                localStorage.setItem('schoolId', schoolId);
                setShowRegistration(true);
                setIsLoading(false);
                return;
            }
            
            // User exists, proceed with login
            await login(schoolId);
            navigate('/');
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (showRegistration) {
        return (
            <RegistrationForm
                onCancel={() => setShowRegistration(false)}
                initialSchoolId={schoolId}
            />
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="schoolId" className="block text-sm font-medium text-gray-700">
                            School ID
                        </label>
                        <input
                            type="text"
                            id="schoolId"
                            value={schoolId}
                            onChange={(e) => setSchoolId(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login; 