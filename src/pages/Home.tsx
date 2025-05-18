import { useRef, useEffect, useState } from 'react';

const images = [
  { src: '/roomPhoto.jpeg', alt: 'Room Photo 1' },
  { src: '/roomPhoto2.jpeg', alt: 'Room Photo 2' },
];

const description = `Providing a "jam room" with instruments, music equipment, stage equipment, and recording equipment. Maintained by students, for students.`;

function isMobile() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 768px)').matches || /Mobi|Android/i.test(navigator.userAgent);
}

export default function Home() {
  const headerRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const [descStyle, setDescStyle] = useState({ opacity: 0, transform: 'translateY(40px)' });
  const [scrollLocked, setScrollLocked] = useState(!isMobile());
  const [currentSection, setCurrentSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollThreshold = 400;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEnlarged, setIsEnlarged] = useState(false);

  // Remove scroll lock on mobile
  useEffect(() => {
    if (isMobile()) {
      setScrollLocked(false);
    }
  }, []);

  // Handle scroll snapping and animations (desktop only)
  useEffect(() => {
    if (isMobile()) return;
    let isScrolling = false;
    let scrollTimeout: number;
    let accumulatedDelta = 0;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrolling) return;
      accumulatedDelta += e.deltaY * 0.5;
      let progress;
      if (currentSection === 0) {
        progress = Math.min(Math.max((accumulatedDelta / scrollThreshold) * 100, 0), 100);
      } else {
        progress = Math.min(Math.max(100 + (accumulatedDelta / scrollThreshold) * 100, 0), 100);
      }
      setDescStyle({
        opacity: progress / 100,
        transform: `translateY(${40 * (1 - progress / 100)}px)`
      });
      if (Math.abs(accumulatedDelta) >= scrollThreshold) {
        const direction = accumulatedDelta > 0 ? 1 : -1;
        const nextSection = Math.max(0, Math.min(1, currentSection + direction));
        if (nextSection !== currentSection) {
          isScrolling = true;
          setCurrentSection(nextSection);
          accumulatedDelta = 0;
          window.scrollTo({
            top: nextSection * window.innerHeight,
            behavior: 'smooth'
          });
          if (nextSection === 1) {
            setScrollLocked(false);
          } else {
            setScrollLocked(true);
          }
          scrollTimeout = window.setTimeout(() => {
            isScrolling = false;
          }, 1500);
        }
      }
    };
    if (scrollLocked) {
      window.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(scrollTimeout);
    };
  }, [currentSection, scrollLocked]);

  // Lock/unlock body scroll based on scrollLocked (desktop only)
  useEffect(() => {
    if (isMobile()) return;
    if (scrollLocked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [scrollLocked]);

  // Fade in more info after description is visible
  useEffect(() => {
    const moreObserver = new window.IntersectionObserver(
      () => { },
      { threshold: 0.5 }
    );
    if (moreRef.current) moreObserver.observe(moreRef.current);
    return () => {
      if (moreRef.current) moreObserver.unobserve(moreRef.current);
    };
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
    <div
      ref={containerRef}
      className="w-full bg-black flex flex-col items-center justify-start pt-0 pb-0"
      style={{
        height: !isMobile() && scrollLocked ? '200vh' : 'auto',
        scrollSnapType: !isMobile() && scrollLocked ? 'y mandatory' : 'none'
      }}
    >
      {/* Hero section: fills first viewport */}
      <section
        className="relative flex flex-col items-center justify-center w-full"
        style={{
          minHeight: '93vh',
          scrollSnapAlign: !isMobile() ? 'start' : undefined,
          scrollSnapStop: !isMobile() ? 'always' : undefined,
          backgroundColor: 'black',
          width: '150%',
          margin: -33,
          padding: 0
        }}
      >
        <h1
          ref={headerRef}
          className="font-black-ops-one text-white text-3xl sm:text-5xl md:text-7xl text-center mb-6 md:mb-8 transition-opacity duration-1000 ease-out opacity-100"
        >
          Jam Society
        </h1>
        <div
          ref={descRef}
          className="max-w-full sm:max-w-2xl w-full text-center text-white text-base sm:text-lg md:text-2xl font-roboto font-semibold drop-shadow-lg bg-black/60 rounded-xl px-3 sm:px-6 py-4 border border-white/10"
          style={{
            ...descStyle,
            marginTop: '1.5rem',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
            letterSpacing: '0.01em',
          }}
        >
          {description}
        </div>
        {!isMobile() && scrollLocked && currentSection === 0 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="text-white text-sm mb-2">Scroll to reveal</div>
            <svg
              className="w-6 h-6 text-white"
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
        )}
      </section>

      {/* Content section with white background */}
      <section
        style={{
          minHeight: '100vh',
          scrollSnapAlign: !isMobile() ? 'start' : undefined,
          scrollSnapStop: !isMobile() ? 'always' : undefined,
          backgroundColor: 'white',
          width: '100vw',
          padding: isMobile() ? '2rem 0' : '4rem 0'
        }}
      >
        <div className="max-w-6xl mx-auto px-2 sm:px-4">
          {/* Info row section - 3 sharper, square, side-by-side blocks */}
          <div className="w-screen max-w-none flex flex-col md:flex-row gap-8 mb-16 md:mb-24 mx-[-50vw] left-[50vw] right-[50vw] relative" style={{ left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
            {/* Location Block */}
            <div className="flex flex-col md:flex-1 items-center bg-gray-100 shadow-2xl py-16 md:py-24 px-6 md:px-10 border border-gray-300 rounded-none">
              <img src="/pin.svg" alt="Location Pin" className="w-16 h-16 md:w-20 md:h-20 bg-transparent mb-4" />
              <div className="text-center w-full">
                <div className="font-roboto font-extrabold text-3xl md:text-5xl text-gray-900 mb-4">Location</div>
                <div className="text-gray-700 text-xl md:text-2xl font-medium">Located in the Basement of Platt east of the Facilities and Maintenance Office, 340 Foothill Blvd, Claremont, CA 91711</div>
              </div>
            </div>
            {/* Hours Block */}
            <div className="flex flex-col md:flex-1 items-center bg-gray-100 shadow-2xl py-16 md:py-24 px-6 md:px-10 border border-gray-300 rounded-none">
              <div className="font-roboto font-extrabold text-3xl md:text-5xl text-gray-900 mb-4">Hours</div>
              <div className="text-gray-700 text-center text-xl md:text-2xl font-medium">
                After 5:00 pm Monday-Friday<br />All day Saturday-Sunday
              </div>
            </div>
            {/* Who can use the room Block */}
            <div className="flex flex-col md:flex-1 items-center bg-gray-100 shadow-2xl py-16 md:py-24 px-6 md:px-10 border border-gray-300 rounded-none">
              <div className="font-roboto font-extrabold text-3xl md:text-5xl text-gray-900 mb-4 text-center">Who can use the room?</div>
              <div className="text-gray-700 text-xl md:text-2xl font-medium text-center">
                You! It's free. Just fill out the room entry quiz to get 24/7 swipe access to the room and you'll be all set. Theres no commitment on your end other than respecting the equipment in the room. We have over 400 active members!
              </div>
            </div>
          </div>

          {/* Photo Gallery Section */}
          <div className="mt-16">
            <h2 className="font-roboto font-semibold text-2xl text-gray-900 mb-6 text-center"></h2>
            <div className="relative">
              <img
                src={images[currentImageIndex].src}
                alt={images[currentImageIndex].alt}
                className="w-full h-auto rounded-lg shadow-lg cursor-pointer"
                onClick={() => setIsEnlarged(true)}
              />
              <button onClick={prevImage} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full">←</button>
              <button onClick={nextImage} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full">→</button>
            </div>
            {isEnlarged && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setIsEnlarged(false)}>
                <img
                  src={images[currentImageIndex].src}
                  alt={images[currentImageIndex].alt}
                  className="max-w-full max-h-full"
                />
              </div>
            )}
          </div>

          {/* New Section with Black Background */}
          <div className="mt-8 md:mt-10 bg-white text-black py-8 md:py-12 px-3 md:px-6 rounded-2xl">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-roboto font-semibold text-xl md:text-2xl mb-3 md:mb-4">Need to check out equipment for an event?</h2>
              <p className="text-black-300 mb-6 md:mb-8 text-sm md:text-base">We have an equipment checkout system. Please only check out items for a maximum of 3 days. Sign in, then go to the equipment page to select what items you are checking out. When you are done with the equipment don't forget to go back to the equipment page and return them.</p>

              <h2 className="font-roboto font-semibold text-xl md:text-2xl mb-3 md:mb-4">Want to reserve the room?</h2>
              <p className="text-black-300 mb-6 md:mb-8 text-sm md:text-base">You can! Now you don't have to worry about other bands practicing while you want to practice. Just go to the reserve tab for more info.</p>

              <h2 className="font-roboto font-semibold text-xl md:text-2xl mb-3 md:mb-4">Equipment damaged or want to request new equipment?</h2>
              <p className="text-black-300 text-sm md:text-base">Go to the equipment page.</p>
            </div>
          </div>

          {/* Final Section with Contact Information */}
          <div className="mt-8 md:mt-10 bg-white py-8 md:py-12 px-3 md:px-6 rounded-2xl">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-roboto font-semibold text-2xl md:text-3xl mb-6 md:mb-10">Meet your Jam Society Presidents</h2>
              <div className="flex flex-col sm:flex-row justify-center gap-6 md:gap-8">
                <div>
                  <img src="/MaxC.jpeg" alt="Max Conine" className="w-32 h-44 md:w-90 md:h-130 object-cover rounded-lg mb-2 mx-auto" />
                  <div className="font-roboto font-semibold text-base md:text-lg">Max Conine</div>
                  <div className="text-gray-700 text-sm md:text-base">mconine@hmc.edu</div>
                </div>
                <div>
                  <img src="/MaxB.jpeg" alt="Max Buchanan" className="w-32 h-44 md:w-90 md:h-130 object-cover rounded-lg mb-2 mx-auto" />
                  <div className="font-roboto font-semibold text-base md:text-lg">Max Buchanan</div>
                  <div className="text-gray-700 text-sm md:text-base">mabuchanan@hmc.edu</div>
                </div>
              </div>
              <p className="text-gray-700 mt-4 md:mt-6 text-sm md:text-base">Hi, we're Max and Max and we're happy to be your 2025 -2026 Jam Society Presidents. We take care of the room, manage the equipment, and plan events. We're happy to talk about any ideas you have to improve the room or if there's any events you would like us to plan.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}