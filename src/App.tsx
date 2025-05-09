import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Artists from './pages/Artists';
import EquipmentPage from './pages/Equipment';
import EquipmentGuides from './pages/EquipmentGuides';
import Reserve from './pages/Reserve';
import Footer from './components/Footer';
import Admin from './pages/Admin';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase/config';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        await initializeApp(firebaseConfig);
        setIsFirebaseInitialized(true);
      } catch (error) {
        console.error('Error initializing Firebase:', error);
      }
    };

    initializeFirebase();
  }, []);

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
      <AuthProvider>
        <Router>
          <LoadingScreen />
          <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/artists" element={<Artists />} />
                <Route path="/equipment" element={<EquipmentPage />} />
                <Route path="/equipment-guides" element={<EquipmentGuides />} />
                <Route path="/reserve" element={<Reserve />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;