import React from 'react';
import PageHero from '../components/PageHero';

const DISCORD_URL = 'https://discord.gg/33ERv9rMmZ';
const CONTACT_EMAIL = 'jamsociety-leadership-l@g.hmc.edu';
const LEARN_MAIL = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Peer tutoring — I want to learn')}`;
const TUTOR_MAIL = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Peer tutoring — I want to tutor')}`;

const PeerTutoring: React.FC = () => {
  return (
    <div className="min-h-screen font-roboto">
      <PageHero
        image="/peer_tutoring_cover.jpeg"
        title="PEER TUTORING"
        backgroundPosition="0% 30%"
      />

      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="border-l-4 border-jam-blue pl-4 sm:pl-6 mb-12 max-w-3xl">
            <p className="text-base sm:text-lg text-copy mb-4">
              This is a peer tutoring program we started to connect Mudders with each other — so you
              can keep learning an instrument, and so you can help someone else pick one up.
            </p>
            <p className="text-base sm:text-lg text-copy">
              We match volunteer tutors with students looking to build skills on drums, keyboard,
              guitar, and bass (and other instruments if there&apos;s demand). Lessons are free,
              scheduled around you, and happen in the Jam Room or upstairs in the practice rooms.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="font-display text-navy text-[clamp(1.35rem,6vw,1.875rem)] leading-none mb-4">
              SIGN UP
            </h2>
            <p className="text-copy max-w-3xl mb-6">
              Email us to be matched, or hop on Discord if you already know who you want to play with.
              The spreadsheet below is the current roster — it isn&apos;t the sign-up form.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <a href={LEARN_MAIL} className="jam-btn jam-btn-primary jam-btn-lg">
                I want to learn
              </a>
              <a href={TUTOR_MAIL} className="jam-btn jam-btn-secondary jam-btn-lg">
                I want to tutor
              </a>
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="jam-btn jam-btn-secondary jam-btn-lg"
              >
                Ask on Discord
              </a>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="font-display text-navy text-[clamp(1.35rem,6vw,1.875rem)] leading-none mb-4">
              CURRENT SIGN UPS
            </h2>
            <div className="border border-hairline overflow-auto -mx-4 sm:mx-0">
              <iframe
                src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQ0sx2d1VjHsqRNV3CFx71himL_fLMAh8Nv0aBpyW877Pt22ZK3fmrz8EP1q9xfVXvuc9eZIoCLYz2Z/pubhtml?widget=true&headers=false"
                title="Peer Tutoring Sign Up Spreadsheet"
                className="w-full min-w-[320px] h-[70vh] md:h-[600px] border-0"
              />
            </div>
          </div>

          <div className="border-t border-hairline pt-8">
            <h2 className="text-xl font-semibold text-ink mb-3">Questions?</h2>
            <p className="text-copy mb-4">
              Email{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-jam-blue hover:text-jam-blue-hover underline break-all">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeerTutoring;
