import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Artists from './pages/Artists';
import EquipmentPage from './pages/Equipment';
import CheckoutReturn from './pages/CheckoutReturn';
import Reserve from './pages/Reserve';
import Footer from './components/Footer';
import Inventory from './pages/Inventory';
import Admin from './pages/Admin';
import { getApp } from 'firebase/app';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const app = getApp();
      console.log('Firebase initialized successfully:', app.name);
      setIsFirebaseInitialized(true);
    } catch (err) {
      console.error('Firebase initialization error:', err);
      setError('Failed to initialize application. Please try again later.');
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isFirebaseInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <h1 className="text-2xl mt-4">Loading...</h1>
          <p className="text-gray-600">Please wait while we initialize the application.</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen flex flex-col">
          <NavBar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/equipment" element={<EquipmentPage />} />
              <Route path="/checkout-return" element={<CheckoutReturn />} />
              <Route path="/reserve" element={<Reserve />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;