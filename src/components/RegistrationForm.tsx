import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

interface RegistrationFormProps {
    onCancel: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onCancel }) => {
    const { registerNewUser } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        schoolId: '',
        firstName: '',
        lastName: '',
        classYear: '',
        email: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    const classYears = Array.from({ length: 8 }, (_, i) => (2026 + i).toString());

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateSchoolId = (schoolId: string) => {
        if (!/^\d{8}$/.test(schoolId)) {
            throw new Error('School ID must be exactly 8 digits.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        // Email domain validation
        if (!formData.email.endsWith('@hmc.edu') && !formData.email.endsWith('@g.hmc.edu')) {
            setError('Email must be a Harvey Mudd College address (@hmc.edu or @g.hmc.edu)');
            setIsLoading(false);
            return;
        }

        // School ID validation
        const trimmedSchoolId = formData.schoolId.trim();
        try {
            validateSchoolId(trimmedSchoolId);
        } catch (err) {
            setError((err as Error).message);
            setIsLoading(false);
            return;
        }

        // School ID uniqueness check (Firestore)
        try {
            const db = getFirestore();
            const userDoc = await getDoc(doc(db, 'users', trimmedSchoolId));
            if (userDoc.exists()) {
                setError('This school ID is already in use.');
                setIsLoading(false);
                return;
            }
        } catch (err) {
            setError('Failed to check school ID uniqueness.');
            setIsLoading(false);
            return;
        }

        try {
            await registerNewUser(trimmedSchoolId, formData.email.trim(), trimmedSchoolId);
            setFormData({ schoolId: '', firstName: '', lastName: '', classYear: '', email: '' });
            // Redirect to quiz page after registration
            window.location.href = '/quiz';
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to register. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md font-roboto">
            {success ? (
                <p className="text-green-500 text-sm font-normal">{success}</p>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="schoolId" className="block text-sm font-medium text-gray-700 font-medium">
                            School ID
                        </label>
                        <input
                            type="text"
                            id="schoolId"
                            name="schoolId"
                            value={formData.schoolId}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700 font-normal"
                        />
                    </div>
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 font-medium">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700 font-normal"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 font-medium">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700 font-normal"
                        />
                    </div>
                    <div>
                        <label htmlFor="classYear" className="block text-sm font-medium text-gray-700 font-medium">
                            Class Year
                        </label>
                        <select
                            id="classYear"
                            name="classYear"
                            value={formData.classYear}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700 font-normal"
                        >
                            <option value="" disabled>Select class year</option>
                            {classYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder=""
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700 font-normal"
                        />
                        <p className="mt-1 text-sm text-gray-500 font-normal">
                            Must be a Harvey Mudd College email address (@hmc.edu or @g.hmc.edu)
                        </p>
                    </div>
                    {error && (
                        <p className="text-red-500 text-sm font-normal">{error}</p>
                    )}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 font-medium"
                        >
                            {isLoading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default RegistrationForm; 