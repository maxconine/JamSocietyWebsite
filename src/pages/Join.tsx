import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, sendEmailVerification } from 'firebase/auth';

const QUIZ_QUESTIONS = [
  {
    question: 'When can you use the jam room?',
    name: 'q2',
    options: ['Anytime', 'Only after F&M Hours'],
    correct: 'Only after F&M Hours',
  },
  {
    question: 'What do you have to do when you want to check out equipment from the room?',
    name: 'q3',
    options: [
      'Go to the equipment page and check it out',
      'Borrow it from the room without checking it out',
    ],
    correct: 'Go to the equipment page and check it out',
  },
  {
    question: 'What do you have to do when you want to return equipment from the room?',
    name: 'q4',
    options: [
      'Place the piece of equipment back where it belongs, go to the equipment page and return it',
      'Throw it in the room and leave',
    ],
    correct: 'Place the piece of equipment back where it belongs, go to the equipment page and return it',
  },
  {
    question: 'Are food and drink allowed in the jam room?',
    name: 'q5',
    options: ['Yes', 'No'],
    correct: 'No',
  },
  {
    question: 'How many days in advance should you reserve the room if you want to reserve it?',
    name: 'q6',
    options: ['No days in advance', '3 days'],
    correct: '3 days',
  },
];

export default function Join() {
  const { setQuizPassed, isAuthenticated } = useAuth();
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [hasPassedQuiz, setHasPassedQuiz] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  useEffect(() => {
    const checkQuizStatus = async () => {
      const schoolId = localStorage.getItem('schoolId');
      if (schoolId) {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', schoolId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.quizPassed) {
            setHasPassedQuiz(true);
            setSuccess('Quiz passed! You now have access to the Jam Room. Please give F&M a few days to add you to the swipe access list');
          }
          setIsVerified(!!userData.emailVerified);
        }
      }
    };
    checkQuizStatus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAnswers(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    // Validation
    for (const q of QUIZ_QUESTIONS) {
      if (!answers[q.name]) {
        setError('Please answer all questions.');
        setSubmitting(false);
        return;
      }
      if (answers[q.name] !== q.correct) {
        setError('You must answer all questions correctly to pass.');
        setSubmitting(false);
        return;
      }
    }
    try {
      await setQuizPassed(localStorage.getItem('schoolId')!);
      setSuccess('Quiz passed! You now have access to the Jam Room. Please give F&M a few days to add you to the swipe access list');
    } catch (err) {
      setError('Failed to record quiz completion.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handler for resending verification email
  const handleResendVerification = async () => {
    setResendStatus(null);
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setResendStatus('Verification email sent! Please check your inbox.');
      } else {
        setResendStatus('You must be logged in to resend verification email.');
      }
    } catch (err) {
      setResendStatus('Failed to send verification email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join the Jam Society!</h1>
          <p className="text-lg text-gray-600">
            Complete the quiz below to get access to the Jam Society room.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Rules</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 font-medium">
                  1
                </span>
              </div>
              <p className="ml-4 text-gray-600">
                Please only practice outside of F&M Hours, which are 8:00 am to 5:00 pm Monday-Friday.
              </p>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 font-medium">
                  2
                </span>
              </div>
              <p className="ml-4 text-gray-600">
                If you wish to take equipment out of the Jam Society room, <span className="font-bold">you must check it out through the equipment page</span>. If the equipment does not allow you to check it out then it is meant to be left in the room.
              </p>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 font-medium">
                  3
                </span>
              </div>
              <p className="ml-4 text-gray-600">
                Please respect "Do Not Use" signs. Some members store their instruments in the room which are not open to public use.
              </p>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 font-medium">
                  4
                </span>
              </div>
              <p className="ml-4 text-gray-600">
                Please leave food and drinks (besides water) <span className="font-bold">outside</span> the room.
              </p>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 font-medium">
                  5
                </span>
              </div>
              <p className="ml-4 text-gray-600">
                Please <span className="font-bold">turn everything off</span> and <span className="font-bold">wrap up cables</span> you used before leaving the room. Leave the room cleaner than you found it.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8 font-roboto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Take the Quiz</h2>
          {!isAuthenticated ? (
            <div className="text-red-600 font-medium">Please log in or register to take the quiz.</div>
          ) : success || hasPassedQuiz ? (
            <div className="text-green-500 text-lg font-normal text-center py-8">{success}</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {QUIZ_QUESTIONS.map((q, idx) => (
                <div key={q.name} className="mb-4">
                  <p className="font-medium mb-2">{idx + 1}. {q.question}</p>
                  <div className="flex flex-col space-y-2">
                    {q.options.map((opt, oIdx) => (
                      <label key={oIdx} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={q.name}
                          value={opt}
                          checked={answers[q.name] === opt}
                          onChange={handleChange}
                          className="mr-3"
                          required
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              {error && <p className="text-red-500 text-sm font-normal">{error}</p>}
              <button type="submit" disabled={submitting} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 font-roboto">
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            </form>
          )}
        </div>
        {/* Resend Verification Button */}
        {!isVerified && isAuthenticated && (
          <div className="flex flex-col items-center mt-6">
            <div className="mb-3 max-w-xl text-center text-gray-700 text-base font-normal">
              <p>
                <strong>You are not verified yet.</strong> In order to check out equipment and edit artist pages, you must verify that your school ID is linked to your email address. Please check your inbox for a verification email, and click the link inside to complete verification. If you did not receive the email, you can resend it below.
              </p>
            </div>
            <button
              onClick={handleResendVerification}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
            >
              Resend Verification Email
            </button>
            {resendStatus && (
              <p className={`mt-2 text-sm ${resendStatus.includes('sent') ? 'text-green-600' : 'text-red-600'}`}>{resendStatus}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 