import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import EquipmentPage from './pages/Equipment';
import EquipmentGuides from './pages/EquipmentGuides';
import Reserve from './pages/Reserve';
import PeerTutoring from './pages/PeerTutoring';
import Footer from './components/Footer';
import Join from './pages/Join';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import RouteErrorBoundary from './components/RouteErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import DocumentMeta from './components/DocumentMeta';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Mirrors the Jam Society style guide: blue/white palette, square edges, Roboto.
const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 0,
  },
  palette: {
    primary: {
      main: '#2563EB',
      dark: '#1D4ED8',
    },
    secondary: {
      main: '#102A43',
    },
    text: {
      primary: '#102A43',
      secondary: '#627D98',
    },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 0 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '1px solid #D9E2EC',
          boxShadow: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Router>
          <ScrollToTop />
          <DocumentMeta />
          <div className="min-h-screen flex flex-col bg-white">
            <NavBar />
            <main className="flex-grow w-full min-w-0 overflow-x-clip pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
              <Routes>
                <Route path="/" element={
                  <RouteErrorBoundary routeName="Home">
                    <Home />
                  </RouteErrorBoundary>
                } />
                <Route path="/equipment" element={
                  <RouteErrorBoundary routeName="Equipment">
                    <EquipmentPage />
                  </RouteErrorBoundary>
                } />
                <Route path="/equipment-guides" element={
                  <RouteErrorBoundary routeName="Equipment Guides">
                    <EquipmentGuides />
                  </RouteErrorBoundary>
                } />
                <Route path="/reserve" element={
                  <RouteErrorBoundary routeName="Reservation">
                    <Reserve />
                  </RouteErrorBoundary>
                } />
                <Route path="/peer-tutoring" element={
                  <RouteErrorBoundary routeName="Peer Tutoring">
                    <PeerTutoring />
                  </RouteErrorBoundary>
                } />
                <Route path="/join" element={
                  <RouteErrorBoundary routeName="Join">
                    <Join />
                  </RouteErrorBoundary>
                } />
                <Route path="*" element={
                  <RouteErrorBoundary routeName="Not Found">
                    <NotFound />
                  </RouteErrorBoundary>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
