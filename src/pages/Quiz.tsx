import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const QUESTIONS = Array.from({ length: 10 }, (_, i) => ({
  question: `Sample Question ${i + 1}?`,
  options: ['A', 'B', 'C', 'D'],
  answer: 0 // Always A for placeholder
}));

export default function Quiz() {
  const { setQuizPassed } = useAuth();
  const [answers, setAnswers] = useState<number[]>(Array(10).fill(-1));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const schoolId = localStorage.getItem('schoolId');

  const handleChange = (qIdx: number, value: number) => {
    setAnswers(a => a.map((v, i) => (i === qIdx ? value : v)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    // Simple scoring: all answers must be 0 (A)
    if (answers.some(a => a !== 0)) {
      setError('You must answer all questions correctly to pass.');
      setSubmitting(false);
      return;
    }
    try {
      if (schoolId) {
        await setQuizPassed(schoolId);
        navigate('/');
      } else {
        setError('No school ID found. Please log in again.');
      }
    } catch (err) {
      setError('Failed to record quiz completion.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Jam Society Quiz</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {QUESTIONS.map((q, idx) => (
            <div key={idx} className="mb-4">
              <p className="font-medium mb-2">{idx + 1}. {q.question}</p>
              <div className="flex space-x-4">
                {q.options.map((opt, oIdx) => (
                  <label key={oIdx} className="flex items-center">
                    <input
                      type="radio"
                      name={`q${idx}`}
                      value={oIdx}
                      checked={answers[idx] === oIdx}
                      onChange={() => handleChange(idx, oIdx)}
                      className="mr-2"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </form>
      </div>
    </div>
  );
} 