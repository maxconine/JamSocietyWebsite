import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Artists from './pages/Artists';
import EquipmentPage from './pages/Equipment';
import CheckoutReturn from './pages/CheckoutReturn';
import Reserve from './pages/Reserve';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/checkout-return" element={<CheckoutReturn />} />
          <Route path="/reserve" element={<Reserve />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;