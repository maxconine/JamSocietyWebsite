import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginButton from './LoginButton';

const NavBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-black-ops-one">
          JamSociety
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/artists" className="hover:text-gray-300">Artists</Link>
          <Link to="/equipment" className="hover:text-gray-300">Equipment</Link>
          <Link to="/equipment-guides" className="hover:text-gray-300">Equipment Guides</Link>
          <Link to="/reserve" className="hover:text-gray-300">Reserve</Link>
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
    </nav>
  );
};

export default NavBar;