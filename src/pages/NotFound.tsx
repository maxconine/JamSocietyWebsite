import { Link } from 'react-router-dom';
import { NoteIcon } from '../components/Icons';

export default function NotFound() {
  return (
    <div className="bg-white min-h-[60vh] px-4 py-16 font-roboto">
      <div className="max-w-[1120px] mx-auto">
        <div className="jam-staff pt-6 pb-10 mb-10">
          <div className="flex items-start gap-3 sm:gap-5">
            <NoteIcon className="w-9 h-9 sm:w-12 sm:h-12 shrink-0 text-jam-blue mt-2" />
            <h1 className="min-w-0 font-display text-navy text-[clamp(1.75rem,8vw,4.5rem)] leading-none">
              PAGE NOT FOUND
            </h1>
          </div>
        </div>

        <p className="max-w-3xl text-copy text-base md:text-lg mb-8">
          That URL isn&apos;t a page on this site. Head home, or go to Join if you&apos;re looking
          for swipe access.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/" className="jam-btn jam-btn-primary jam-btn-lg">
            Back Home
          </Link>
          <Link to="/join" className="jam-btn jam-btn-secondary jam-btn-lg">
            Join
          </Link>
        </div>
      </div>
    </div>
  );
}
