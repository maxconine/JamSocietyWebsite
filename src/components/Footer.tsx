import { InstagramIcon, NoteIcon } from './Icons';

export default function Footer() {
  return (
    <footer className="bg-navy text-sky text-center py-6 px-4 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="flex flex-col items-center justify-center gap-2">
        <NoteIcon className="w-5 h-5 text-sky" />
        <div className="flex items-center justify-center gap-2">
          <span>© {new Date().getFullYear()} Jam Society</span>
          <a
            href="https://www.instagram.com/hmcjamsoc/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-11 h-11 text-sky hover:text-white transition-colors"
            aria-label="Jam Society on Instagram"
          >
            <InstagramIcon className="w-6 h-6 fill-current" />
          </a>
        </div>
        <a
          href="mailto:jamsociety-leadership-l@g.hmc.edu"
          className="text-sky hover:text-white transition-colors break-all px-2"
        >
          jamsociety-leadership-l@g.hmc.edu
        </a>
      </div>
    </footer>
  );
}
