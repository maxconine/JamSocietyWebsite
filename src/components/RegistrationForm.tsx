import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface RegistrationFormProps {
    onCancel: () => void;
    initialSchoolId: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onCancel, initialSchoolId }) => {
    const { registerNewUser, login } = useAuth();
    const [formData, setFormData] = useState({
        schoolId: initialSchoolId || '',
        firstName: '',
        lastName: '',
        classYear: '',
        email: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const schoolIdToUse = formData.schoolId.trim();
        if (!/^[0-9]{8}$/.test(schoolIdToUse)) {
            setError('School ID must be exactly 8 digits.');
            setIsLoading(false);
            return;
        }

        // Email domain validation
        if (!formData.email.endsWith('@hmc.edu') && !formData.email.endsWith('@g.hmc.edu')) {
            setError('Email must be a Harvey Mudd College address (@hmc.edu or @g.hmc.edu)');
            setIsLoading(false);
            return;
        }

        try {
            await registerNewUser(
                schoolIdToUse,
                formData.email.trim(),
                formData.firstName.trim(),
                formData.lastName.trim(),
                formData.classYear
            );
            // Immediately log the user in after registration
            await login(schoolIdToUse);
            setFormData({ schoolId: '', firstName: '', lastName: '', classYear: '', email: '' });
            navigate('/quiz');
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center font-roboto z-50">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full mx-4 sm:mx-8 sm:max-w-lg">
                <h2 className="text-xl font-bold text-center mb-3 text-black font-roboto">Register as a new user</h2>
                <p className="text-sm text-gray-600 text-center mb-6 font-roboto">
                    Register as a new user so you can get swipe access and check equipment in and out of the room
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="schoolId" className="block text-sm font-medium text-black font-roboto mb-1">
                            School ID
                        </label>
                        <input
                            type="text"
                            id="schoolId"
                            name="schoolId"
                            value={formData.schoolId}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black font-roboto py-3 px-4"
                            required
                            pattern="[0-9]{8}"
                            maxLength={8}
                            minLength={8}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-black font-roboto mb-1">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black font-roboto py-3 px-4"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-black font-roboto mb-1">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black font-roboto py-3 px-4"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="classYear" className="block text-sm font-medium text-black font-roboto mb-1">
                            Class Year
                        </label>
                        <div className="relative mt-1">
                            <select
                                id="classYear"
                                name="classYear"
                                value={formData.classYear}
                                onChange={handleChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 appearance-none bg-white pr-10 cursor-pointer text-black font-roboto py-3 px-4"
                                required
                            >
                                <option value="">Select Year</option>
                                <option value="2024">2026</option>
                                <option value="2025">2027</option>
                                <option value="2026">2028</option>
                                <option value="2027">2029</option>
                                <option value="2028">2030</option>
                                <option value="2029">2031</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-black font-roboto mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black font-roboto py-3 px-4"
                            required
                        />
                    </div>
                    {error && (
                        <p className="text-red-500 text-sm font-roboto mt-2">{error}</p>
                    )}
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-roboto"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 font-roboto"
                        >
                            {isLoading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrationForm; 