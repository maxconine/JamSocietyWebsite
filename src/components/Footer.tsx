import { InstagramIcon } from './Icons';

export default function Footer() {
    return (
      <footer className="bg-black text-gray-500 text-center py-2">
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="flex items-center justify-center gap-1">
            <span>© {new Date().getFullYear()} Jam Society </span>
            <a 
              href="https://www.instagram.com/hmcjamsoc/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
              style={{filter: 'invert(100%) brightness(200%)'}}
            >
              <InstagramIcon className="w-6 h-6 inline-block" />
            </a>
          </div>
          <a 
            href="mailto:jamsociety-leadership-l@g.hmc.edu" 
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            jamsociety-leadership-l@g.hmc.edu
          </a>
          <div className="flex items-center justify-center gap-2">
            <span className="text-gray-500">website created by Max Conine</span>
            <a 
              href="https://github.com/maxconine/JamSocietyWebsite" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img 
                src="/github.png" 
                alt="GitHub" 
                className="w-5 h-5 inline-block" 
                style={{ filter: 'invert(100%) brightness(200%)' }}
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </footer>
    );
  }