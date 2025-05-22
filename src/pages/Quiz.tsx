import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

const QUESTIONS = [
  {
    question: 'When can you use the jam room?',
    name: 'q2',
    options: ['Anytime', 'Only after F&M Hours'],
    correct: 1, // 'Only after F&M Hours'
  },
  {
    question: 'What do you have to do when you want to check out equipment from the room?',
    name: 'q3',
    options: [
      'Go to the equipment page and check it out',
      'Borrow it from the room without checking it out',
    ],
    correct: 0, // 'Go to the equipment page and check it out'
  },
  {
    question: 'What do you have to do when you want to return equipment from the room?',
    name: 'q4',
    options: [
      'Place the piece of equipment back where it belongs, go to the equipment page and return it',
      'Throw it in the room and leave',
    ],
    correct: 0, // 'Place the piece of equipment back where it belongs, go to the equipment page and return it'
  },
  {
    question: 'Are food and drink allowed in the jam room?',
    name: 'q5',
    options: ['Yes', 'No'],
    correct: 1, // 'No'
  },
  {
    question: 'How many days in advance should you reserve the room if you want to reserve it?',
    name: 'q6',
    options: ['No days in advance', '3 days'],
    correct: 1, // '3 days'
  },
];

const Quiz: React.FC = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const db = getFirestore();
  const schoolId = userData?.schoolId;

  if (!schoolId) {
    return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">You must be logged in to take the quiz.</div>;
  }

  const handleChange = (qIdx: number, value: string) => {
    setAnswers(a => ({ ...a, [`q${qIdx}`]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    // Check answers
    for (let i = 0; i < QUESTIONS.length; i++) {
      if (answers[`q${i + 2}`] !== QUESTIONS[i].correct.toString()) {
        setError('You must answer all questions correctly to pass.');
        setSubmitting(false);
        return;
      }
    }
    try {
      if (schoolId) {
        // Mark quiz as passed in Firestore using schoolId
        await updateDoc(doc(db, 'users', schoolId), { quizPassed: true });
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError('No user found. Please log in again.');
      }
    } catch (err) {
      setError('Failed to record quiz completion.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-2">
      <div className="bg-white p-4 md:p-8 rounded-lg shadow-md max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Jam Society Quiz</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {QUESTIONS.map((q, idx) => (
            <div key={idx} className="mb-6">
              <p className="font-medium mb-3 text-base md:text-lg">{idx + 1}. {q.question}</p>
              <div className="flex flex-col gap-2">
                {q.options.map((opt, oIdx) => (
                  <label key={oIdx} className="flex items-center text-sm md:text-base cursor-pointer">
                    <input
                      type="radio"
                      name={`q${idx + 2}`}
                      value={oIdx.toString()}
                      checked={answers[`q${idx + 2}`] === oIdx.toString()}
                      onChange={() => handleChange(idx, oIdx.toString())}
                      className="mr-3 w-4 h-4"
                      required
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          {error && <p className="text-red-500 text-sm font-normal">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-base font-medium"
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Quiz; 