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
import Join from './pages/Join';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase/config';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import LoadingScreen from './components/LoadingScreen';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#666666',
    },
  },
});

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <LoadingScreen />
            <div className="min-h-screen flex flex-col">
              <NavBar />
              <main className="flex-grow w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/artists" element={<Artists />} />
                  <Route path="/equipment" element={<EquipmentPage />} />
                  <Route path="/equipment-guides" element={<EquipmentGuides />} />
                  <Route path="/reserve" element={<Reserve />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/join" element={<Join />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;