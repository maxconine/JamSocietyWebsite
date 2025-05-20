import { useEffect, useState } from 'react';
import { getAuth, reload } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function VerifyEmail() {
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth = getAuth();

  const checkVerification = async () => {
    setLoading(true);
    setError(null);
    try {
      if (auth.currentUser) {
        await reload(auth.currentUser);
        if (auth.currentUser.emailVerified) {
          setEmailVerified(true);
          navigate('/quiz');
        } else {
          setEmailVerified(false);
        }
      }
    } catch (err) {
      setError('Failed to check verification status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkVerification();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        <p className="mb-4">A verification link has been sent to your email address. Please check your inbox and click the link to verify your account.</p>
        <button
          onClick={checkVerification}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'I have verified my email'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
} 