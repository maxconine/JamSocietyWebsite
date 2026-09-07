import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NoteIcon } from './Icons';

const links = [
  { to: '/', label: 'Home' },
  { to: '/equipment', label: 'Equipment' },
  { to: '/equipment-guides', label: 'Guides' },
  { to: '/reserve', label: 'Reserve' },
  { to: '/peer-tutoring', label: 'Peer Tutoring' },
  { to: '/join', label: 'Join' },
];

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMenuOpen]);

  return (
    <nav aria-label="Primary" className="sticky top-0 z-50 bg-navy text-white pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center min-h-12">
          <Link to="/" className="flex items-center gap-2 min-w-0 text-white hover:text-white py-2">
            <NoteIcon className="w-6 h-6 shrink-0 text-sky" />
            <span className="text-xl sm:text-2xl font-display leading-none truncate">JamSociety</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen(open => !open)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 -mr-2"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
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

          <div className="hidden md:flex items-center space-x-5">
            {links.map(link => {
              const isCurrent = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`font-roboto font-medium transition-colors py-3 border-b-2 ${
                    isCurrent
                      ? 'text-white border-white'
                      : 'text-sky hover:text-white border-transparent'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {isMenuOpen && (
          <div
            id="mobile-nav"
            className="md:hidden border-t border-white/20 py-2 max-h-[calc(100svh-var(--jam-nav-height))] overflow-y-auto"
          >
            {links.map(link => {
              const isCurrent = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`flex items-center min-h-11 py-3 font-roboto font-medium ${
                    isCurrent ? 'text-white' : 'text-sky hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
