import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginButton from './LoginButton';

const NavBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-800 text-white p-2">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-black-ops-one">
            JamSociety
          </Link>
          
          {/* Mobile menu button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="hover:text-gray-300 font-roboto font-medium">Home</Link>
            <Link to="/artists" className="hover:text-gray-300 font-roboto font-medium">Artists</Link>
            <Link to="/equipment" className="hover:text-gray-300 font-roboto font-medium">Equipment</Link>
            <Link to="/equipment-guides" className="hover:text-gray-300 font-roboto font-medium">Guides</Link>
            <Link to="/reserve" className="hover:text-gray-300 font-roboto font-medium">Reserve</Link>
            <Link to="/join" className="hover:text-gray-300 font-roboto font-medium">Join</Link>
            {!isAuthenticated ? (
              <LoginButton />
            ) : (
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <Link to="/" className="block py-2 hover:text-gray-300 font-roboto font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/artists" className="block py-2 hover:text-gray-300 font-roboto font-medium" onClick={() => setIsMenuOpen(false)}>Artists</Link>
            <Link to="/equipment" className="block py-2 hover:text-gray-300 font-roboto font-medium" onClick={() => setIsMenuOpen(false)}>Equipment</Link>
            <Link to="/equipment-guides" className="block py-2 hover:text-gray-300 font-roboto font-medium" onClick={() => setIsMenuOpen(false)}>Guides</Link>
            <Link to="/reserve" className="block py-2 hover:text-gray-300 font-roboto font-medium" onClick={() => setIsMenuOpen(false)}>Reserve</Link>
            <Link to="/join" className="block py-2 hover:text-gray-300 font-roboto font-medium" onClick={() => setIsMenuOpen(false)}>Join</Link>
            <div className="pt-2">
              {!isAuthenticated ? (
                <LoginButton />
              ) : (
                <button
                  onClick={logout}
                  className="w-full bg-red-500 hover:bg-red-600 px-3 py-2 rounded"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;