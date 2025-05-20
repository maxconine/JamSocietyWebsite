export default function Footer() {
    return (
      <footer className="bg-black text-gray-500 text-center py-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center justify-center gap-2">
            <span>© {new Date().getFullYear()} Jam Society</span>
            <a 
              href="https://www.instagram.com/hmcjamsoc/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img 
                src="/insta.svg" 
                alt="Instagram" 
                className="w-5 h-5 inline-block" 
                style={{ filter: 'invert(100%) brightness(200%)' }}
              />
            </a>
          </div>
          <a 
            href="mailto:jamsociety-leadership-l@g.hmc.edu" 
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            jamsociety-leadership-l@g.hmc.edu
          </a>
        </div>
      </footer>
    );
  }