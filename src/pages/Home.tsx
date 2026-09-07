import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FAQSection from '../components/FAQSection';
import StaffMelody from '../components/StaffMelody';
import {
  AmpIcon,
  BeamedNoteIcon,
  DrumsIcon,
  DiscordIcon,
  GuitarIcon,
  InstagramIcon,
  KeysIcon,
  NoteIcon,
} from '../components/Icons';

const images = [
  { src: '/room0.jpeg', alt: 'Inside a Jam Society space' },
  { src: '/room1.jpeg', alt: 'Inside a Jam Society space' },
  { src: '/room2.jpeg', alt: 'Inside a Jam Society space' },
];

const MISSION = `Jam Society is a student-run club that provides Mudders with an opportunity to continue or develop their musical interests while they are on campus, as well as fostering a musical community at Mudd.`;

const CONTACT_EMAIL = 'jamsociety-leadership-l@g.hmc.edu';
const MAILING_LIST_URL = 'https://groups.google.com/a/g.hmc.edu/g/jamsociety-l';
const DISCORD_URL = 'https://discord.gg/33ERv9rMmZ';
const INSTAGRAM_URL = 'https://www.instagram.com/hmcjamsoc/';

// What the club actually does, as tracks on a setlist rather than floating boxes.
const whatWeDo = [
  {
    label: 'EVENTS',
    Icon: BeamedNoteIcon,
    body: (
      <>
        We host music events like open mics, where anyone can come and play music with friends or
        strangers. Follow us on{' '}
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-jam-blue hover:text-jam-blue-hover underline">
          Instagram
        </a>{' '}
        or join the mailing list to hear about the next one.
      </>
    ),
  },
  {
    label: 'TUTORING',
    Icon: KeysIcon,
    body: (
      <>
        A peer tutoring program we started to connect Mudders with each other — so you can keep
        learning an instrument, or help someone else pick one up.{' '}
        <Link to="/peer-tutoring" className="text-jam-blue hover:text-jam-blue-hover underline">
          Learn more
        </Link>
        .
      </>
    ),
  },
  {
    label: 'GEAR',
    Icon: GuitarIcon,
    body: (
      <>
        Our spaces hold drum sets, electric and acoustic guitars, bass guitars, keyboards, microphones,
        speakers, mixers, and more — free for members to play in the rooms. Running an event? You can
        also{' '}
        <Link to="/equipment" className="text-jam-blue hover:text-jam-blue-hover underline">
          check equipment out
        </Link>{' '}
        for it.
      </>
    ),
  },
];

const jamSpaces = [
  {
    name: 'JAM ROOM',
    Icon: DrumsIcon,
    location: 'Platt Basement',
    body: `Our main jam room. Home to a recording studio in development, with a brand-new drum kit and production station. Find it in the basement hallway of Platt, east of the Facilities and Maintenance Office. Look for the Jam Society sign.`,
    notice: `A note on the Jam Room: it's open 24/7 for equipment checkout and other activities, but because Facilities and Maintenance is next door, playing hours are outside of F&M hours (Mon–Fri 8am–5pm) only.`,
  },
  {
    name: 'JAM LOUNGE',
    Icon: AmpIcon,
    location: 'Platt first floor, Music Room B',
    body: `A great spot for band practices and jam sessions, equipped with a PA system, drum set, guitars, amps, and a keyboard.`,
  },
  {
    name: 'THE PIT',
    Icon: NoteIcon,
    location: 'LAC second floor',
    body: `A cozy stage setup with musical equipment available. Look for some fun events to be hosted here.`,
  },
];

export default function Home() {
  const [missionRevealed, setMissionRevealed] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isPresidentEnlarged, setIsPresidentEnlarged] = useState(false);
  const [enlargedPresidentSrc, setEnlargedPresidentSrc] = useState<string | null>(null);

  // The mission fades in on its own once the page is up. It is the first thing
  // anyone should read, so it is never gated behind scrolling.
  useEffect(() => {
    const timer = setTimeout(() => setMissionRevealed(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isEnlarged) {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') setIsEnlarged(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEnlarged]);

  return (
    <div className="w-full bg-white flex flex-col items-center justify-start pt-0 pb-0">
      {/* Hero: logo, then the mission, front and center */}
      <section
        className="jam-hero-home relative flex flex-col items-center justify-center w-full overflow-hidden bg-cover bg-center bg-no-repeat bg-scroll md:bg-fixed"
        style={{ backgroundImage: 'url(/home/home_page_cover.webp)' }}
      >
        {/* Scrim only across the lower half, so the photo and logo stay untinted */}
        <div
          className="absolute inset-x-0 bottom-0 h-2/3 z-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(11,31,51,0.9), rgba(11,31,51,0))' }}
        />
        <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <img
            src="/Jam-Soc-Logo.svg"
            alt="Jam Society Logo"
            className="w-[min(82vw,900px)] sm:w-[min(90vw,900px)] max-w-full h-auto mb-6 md:mb-8 drop-shadow-[0_0_25px_rgba(239,68,68,0.3)] mx-auto"
            loading="lazy"
            decoding="async"
          />
          <p
            className="max-w-3xl w-full text-center text-white text-base sm:text-xl md:text-2xl font-roboto px-4 sm:px-6 mx-auto"
            style={{
              opacity: missionRevealed ? 1 : 0,
              transform: missionRevealed ? 'none' : 'translateY(40px)',
              transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
              letterSpacing: '0.01em',
              fontWeight: 300,
            }}
          >
            {MISSION}
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 hidden md:block">
            <svg
              className="w-6 h-6 text-sky"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
        </div>
      </section>

      {/* Content section with white background */}
      <section className="bg-white w-full py-8 md:py-16">
        <div className="w-full max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* The pitch */}
          <StaffMelody>
            <h2 className="font-display text-navy text-[clamp(1.75rem,8vw,4.5rem)] leading-none w-fit max-w-full">
              KEEP MUSIC
              <br />
              IN YOUR LIFE
            </h2>
            <div className="mt-6 max-w-3xl space-y-4 text-base md:text-lg text-copy">
              <p>
                If music — performing, producing, recording, or just jamming — is something you&apos;d
                like to continue pursuing or start learning about during your time at Mudd, we think you
                should join Jam Society.
              </p>
              <p className="relative -top-1">
                We understand that many Mudders come from afar, and that instruments aren&apos;t always
                brought with you, but we hope to help keep music in your life even during school.
              </p>
            </div>
          </StaffMelody>

          {/* What we do */}
          <div className="mb-16 md:mb-24">
            {whatWeDo.map(({ label, Icon, body }, index) => (
              <article
                key={label}
                className={`jam-staff py-8 md:py-10 ${index === whatWeDo.length - 1 ? '' : 'border-b border-hairline'}`}
              >
                <div className="flex items-start gap-3 sm:gap-5 md:gap-8">
                  <Icon className="w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 shrink-0 text-jam-blue mt-2" />
                  <div className="min-w-0">
                    <h2 className="font-display text-navy text-[clamp(2rem,9vw,4.5rem)] leading-none">
                      {label}
                    </h2>
                    <p className="mt-3 max-w-3xl text-base md:text-lg text-copy">{body}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Get involved */}
          <div className="mb-16 md:mb-24">
            <h2 className="font-display text-navy text-[clamp(1.75rem,8vw,3.75rem)] leading-none mb-6">
              GET INVOLVED
            </h2>
            <p className="max-w-3xl text-base md:text-lg text-copy mb-8">
              Any current Mudd student can join. Fill out the{' '}
              <Link to="/join" className="text-jam-blue hover:text-jam-blue-hover underline">
                new member form
              </Link>{' '}
              on Join — that&apos;s the room-entry quiz — to get 24/7 swipe access to our Jam Spaces.
              There&apos;s no commitment on your end other than following the rules and respecting the
              equipment. Over 400 current HMC students are involved.
            </p>

            <Link to="/join" className="jam-btn jam-btn-primary jam-btn-lg">
              Join Jam Society
              <span aria-hidden="true">→</span>
            </Link>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 border-l border-t border-hairline">
              <a
                href={MAILING_LIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="border-r border-b border-hairline bg-mist p-6 hover:bg-sky transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <NoteIcon className="w-7 h-7 text-jam-blue" />
                  <h3 className="text-lg font-semibold text-ink">Mailing list</h3>
                </div>
                <p className="text-sm text-copy">
                  Stay in the loop on events, tutoring sign-ups, and space improvements.
                </p>
              </a>
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="border-r border-b border-hairline bg-mist p-6 hover:bg-sky transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <DiscordIcon className="w-7 h-7 text-jam-blue fill-current" />
                  <h3 className="text-lg font-semibold text-ink">Discord</h3>
                </div>
                <p className="text-sm text-copy">
                  Connect with other members, find people to jam with, and send us feedback or questions.
                </p>
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="border-r border-b border-hairline bg-mist p-6 hover:bg-sky transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <InstagramIcon className="w-7 h-7 text-jam-blue fill-current" />
                  <h3 className="text-lg font-semibold text-ink">@hmcjamsoc</h3>
                </div>
                <p className="text-sm text-copy">
                  Follow along for events, new gear, and cool stuff happening in the spaces.
                </p>
              </a>
            </div>
          </div>

          {/* Jam Spaces */}
          <div className="mb-16 md:mb-24">
            <h2 className="font-display text-navy text-[clamp(1.75rem,8vw,3.75rem)] leading-none mb-6">
              JAM SPACES
            </h2>
            <p className="max-w-3xl text-base md:text-lg text-copy mb-10">
              We provide access to Jam Spaces around campus, and we're constantly expanding and improving them.
            </p>

            <div className="border-t border-hairline">
              {jamSpaces.map(({ name, Icon, location, body, notice }) => (
                <article key={name} className="border-b border-hairline py-8">
                  <div className="flex items-start gap-3 sm:gap-5 md:gap-8">
                    <Icon className="w-9 h-9 md:w-12 md:h-12 shrink-0 text-jam-blue mt-1" />
                    <div className="min-w-0">
                      <h3 className="font-display text-navy text-[clamp(1.5rem,7vw,3rem)] leading-none">
                        {name}
                      </h3>
                      <p className="mt-2 font-roboto font-medium text-sm md:text-base uppercase tracking-wide text-jam-blue">
                        {location}
                      </p>
                      <p className="mt-3 max-w-3xl text-base md:text-lg text-copy">{body}</p>
                      {notice && (
                        <p className="mt-3 max-w-3xl text-sm text-muted">{notice}</p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Photo Gallery */}
            <div className="mt-10">
              <div className="relative">
                <img
                  src={images[currentImageIndex].src}
                  alt={images[currentImageIndex].alt}
                  className="w-full h-auto cursor-pointer border border-hairline"
                  onClick={() => setIsEnlarged(true)}
                  loading="lazy"
                  decoding="async"
                />
                <button
                  onClick={prevImage}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-navy/80 hover:bg-jam-blue text-white w-11 h-12 transition-colors"
                  aria-label="Previous photo"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-navy/80 hover:bg-jam-blue text-white w-11 h-12 transition-colors"
                  aria-label="Next photo"
                >
                  →
                </button>
              </div>
              {isEnlarged && (
                <div
                  className="fixed inset-0 flex items-center justify-center z-50 p-4"
                  style={{ background: 'rgba(11, 31, 51, 0.9)' }}
                  onClick={() => setIsEnlarged(false)}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Jam Space photo"
                >
                  <img
                    src={images[currentImageIndex].src}
                    alt={images[currentImageIndex].alt}
                    className="max-w-full max-h-[100dvh] object-contain"
                    onClick={e => e.stopPropagation()}
                  />
                  <button
                    type="button"
                    className="absolute top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] text-white text-3xl font-bold bg-navy/70 hover:bg-jam-blue w-11 h-11 flex items-center justify-center jam-focus-ring-on-navy transition-colors"
                    onClick={() => setIsEnlarged(false)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Resources */}
          <div className="mb-16 md:mb-24">
            <h2 className="font-display text-navy text-[clamp(1.75rem,8vw,3.75rem)] leading-none mb-8">
              RESOURCES
            </h2>
            <div className="max-w-3xl">
              <h3 className="font-roboto font-semibold text-xl md:text-2xl text-ink mb-3">Equipment Checkout</h3>
              <p className="text-copy mb-8 text-sm md:text-base">
                Playing in the rooms is always free — you only check gear out when you&apos;re taking it
                somewhere else for an event. Head to the{' '}
                <Link to="/equipment" className="text-jam-blue hover:text-jam-blue-hover underline">
                  Equipment
                </Link>{' '}
                page and fill out the form before anything leaves a Jam Space. Checkouts are limited to
                48 hours, and it&apos;s your responsibility to make sure the gear is treated
                respectfully. The downstairs Jam Room drum kit stays put — only the upstairs Jam Lounge
                kit can be checked out.
              </p>

              <h3 className="font-roboto font-semibold text-xl md:text-2xl text-ink mb-3">Room Reservations</h3>
              <p className="text-copy mb-8 text-sm md:text-base">
                You can reserve the Jam Room for a band practice or recording session! Just go to the{' '}
                <Link to="/reserve" className="text-jam-blue hover:text-jam-blue-hover underline">
                  Reserve
                </Link>{' '}
                tab and select a time on the calendar. If you&apos;re taking the upstairs drum set or
                many items from a Jam Space, reserve that room for the times the equipment will be gone.
              </p>

              <h3 className="font-roboto font-semibold text-xl md:text-2xl text-ink mb-3">Equipment Guides</h3>
              <p className="text-copy mb-8 text-sm md:text-base">
                If you&apos;re new to an instrument or piece of equipment, we have guides to help you play
                and operate it. The{' '}
                <Link to="/equipment-guides" className="text-jam-blue hover:text-jam-blue-hover underline">
                  Guides
                </Link>{' '}
                page covers instruments like guitar and drums as well as microphones and mixers.
              </p>

              <h3 className="font-roboto font-semibold text-xl md:text-2xl text-ink mb-3">
                Damaged Equipment &amp; New Requests
              </h3>
              <p className="text-copy text-sm md:text-base">
                If some equipment gets damaged during normal use, it&apos;s okay! Just make sure to fill
                out our damage report form on the Equipment page. If you think a Jam Space could use a
                specific new piece of equipment, fill out the New Equipment Request Form found there
                too.
              </p>
            </div>
          </div>

          {/* Presidents */}
          <div>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-display text-navy text-[clamp(1.5rem,7vw,3rem)] leading-none mb-8 md:mb-10">
                MEET YOUR PRESIDENTS
              </h2>
              <div className="flex flex-col sm:flex-row justify-center gap-6 md:gap-8">
                <div>
                  <img
                    src="/equipment-images/processed/MaxC_P.webp"
                    alt="Max Conine"
                    className="w-full max-w-[270px] md:max-w-[378px] aspect-[3/4] object-cover mb-2 mx-auto cursor-pointer border border-hairline hover:opacity-95 transition"
                    onClick={() => { setEnlargedPresidentSrc('/MaxC.jpeg'); setIsPresidentEnlarged(true); }}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="font-roboto font-semibold text-base md:text-lg text-ink">Max Conine</div>
                  <div className="text-muted text-sm md:text-base break-all">mconine@hmc.edu</div>
                </div>
                <div>
                  <img
                    src="/equipment-images/processed/MaxB_P.webp"
                    alt="Max Buchanan"
                    className="w-full max-w-[270px] md:max-w-[378px] aspect-[3/4] object-cover mb-2 mx-auto cursor-pointer border border-hairline hover:opacity-95 transition"
                    onClick={() => { setEnlargedPresidentSrc('/MaxB.jpeg'); setIsPresidentEnlarged(true); }}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="font-roboto font-semibold text-base md:text-lg text-ink">Max Buchanan</div>
                  <div className="text-muted text-sm md:text-base break-all">mabuchanan@hmc.edu</div>
                </div>
              </div>
              {isPresidentEnlarged && enlargedPresidentSrc && (
                <div
                  className="fixed inset-0 flex items-center justify-center z-50 p-4"
                  style={{ background: 'rgba(11, 31, 51, 0.9)' }}
                  onClick={() => setIsPresidentEnlarged(false)}
                >
                  <img
                    src={enlargedPresidentSrc}
                    alt="President Fullscreen"
                    className="max-w-full max-h-[100dvh] object-contain"
                    onClick={e => e.stopPropagation()}
                  />
                  <button
                    className="absolute top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] text-white text-3xl font-bold bg-navy/70 hover:bg-jam-blue w-11 h-11 flex items-center justify-center jam-focus-ring-on-navy transition-colors"
                    onClick={() => setIsPresidentEnlarged(false)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                </div>
              )}
              <p className="text-copy py-6 text-sm md:text-base">
                Hi, we&apos;re Max and Max and we&apos;re happy to be your 2025-2027 Jam Society
                Presidents. We take care of the Jam Spaces, manage the equipment, and plan events.
                We&apos;re happy to talk about any ideas you have to improve the spaces or any events you
                would like us to plan. Please don&apos;t hesitate to reach out!
              </p>
              <p className="text-copy text-sm md:text-base">See you around the Jam Spaces!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Support Jam Society Section */}
      <div className="bg-white py-12 w-full">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-navy text-[clamp(1.5rem,7vw,3rem)] leading-none mb-8 text-center">
            SUPPORT THE CLUB
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 border-l border-t border-hairline">
            {/* Donate Section */}
            <div className="border-r border-b border-hairline bg-mist p-6">
              <div className="flex items-center gap-3 mb-4">
                <BeamedNoteIcon className="w-8 h-8 text-jam-blue" />
                <h3 className="text-xl font-semibold text-ink">Donate</h3>
              </div>
              <p className="font-roboto font-light text-copy">
                Reach out to{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-jam-blue hover:text-jam-blue-hover underline break-all">
                  {CONTACT_EMAIL}
                </a>{' '}
                if you are interested in supporting our club, or reach out to the Office of Advancement
                at HMC.
              </p>
            </div>
            {/* Donate Equipment Section */}
            <div className="border-r border-b border-hairline bg-mist p-6">
              <div className="flex items-center gap-3 mb-4">
                <GuitarIcon className="w-8 h-8 text-jam-blue" />
                <h3 className="text-xl font-semibold text-ink">Donate Equipment</h3>
              </div>
              <p className="font-roboto font-light text-copy mb-4">
                Have musical equipment you&apos;d like to donate to the Jam Society? Email us and
                we&apos;ll arrange getting it into a Jam Space and labeled.
              </p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="jam-btn jam-btn-primary">
                Email Us About a Donation
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Place FAQSection at the very end of the main container */}
      <FAQSection />
    </div>
  );
}
