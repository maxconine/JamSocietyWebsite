import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import EquipmentTable from '../components/EquipmentTable';
import RegistrationForm from '../components/RegistrationForm';

const Equipment: React.FC = () => {
  const { isAuthenticated, isAdmin, login } = useAuth();
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
        if (err.message === 'NEW_USER' && !isAuthenticated) {
          setShowRegistration(true);
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (showRegistration && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black-ops-one text-center mb-8">New User Registration</h1>
          <RegistrationForm
            schoolId={schoolId}
            onCancel={() => {
              setShowRegistration(false);
              setSchoolId('');
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black-ops-one text-center mb-8">Equipment</h1>

        {!isAuthenticated && (
          <div className="bg-white shadow rounded-lg p-4 mb-8">
            <form onSubmit={handleLogin} className="flex items-center space-x-4">
              <div className="flex-grow">
                <input
                  type="text"
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  placeholder="Enter School ID (8 digits)"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  pattern="\d{8}"
                  title="School ID must be exactly 8 digits"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <EquipmentTable />
        </div>
      </div>
    </div>
  );
};

export default Equipment;