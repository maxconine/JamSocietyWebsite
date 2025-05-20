import { useRef, useEffect, useState } from 'react';
import JamSocLogo from '../assets/Jam-Soc-Logo.svg';

const images = [
  { src: '/roomPhoto.jpeg', alt: 'Room Photo 1' },
  { src: '/roomPhoto2.jpeg', alt: 'Room Photo 2' },
];

const description = `Providing a "jam room" for students to use containing instruments, music equipment, stage equipment, and recording equipment. Maintained by students, for students.`;

function isMobile() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 768px)').matches || /Mobi|Android/i.test(navigator.userAgent);
}

export default function Home() {
  const descRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const [descStyle, setDescStyle] = useState({ opacity: 0, transform: 'translateY(40px)' });
  const [scrollLocked, setScrollLocked] = useState(!isMobile());
  const [currentSection, setCurrentSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollThreshold = 400;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted to true after initial render
    setMounted(true);
    // Only show loading on initial page load
    if (!mounted) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [mounted]);

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

  if (loading && !mounted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-yellow-400 mb-8"></div>
          <h1 className="text-5xl md:text-7xl font-black-ops-one text-yellow-400 mb-4">Loading Jam Society...</h1>
          <p className="text-white text-xl md:text-2xl">Please wait while we load your experience.</p>
        </div>
      </div>
    );
  }

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
        className="relative flex flex-col items-center justify-center w-full overflow-hidden"
        style={{
          minHeight: '93vh',
          scrollSnapAlign: !isMobile() ? 'start' : undefined,
          scrollSnapStop: !isMobile() ? 'always' : undefined,
          backgroundImage: 'url(/mamakStage.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: isMobile() ? 'scroll' : 'fixed',
          backgroundRepeat: 'no-repeat',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          marginTop: '-2rem',
          padding: 0,
          position: 'relative',
          top: 0
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/70 z-0 pointer-events-none" />
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <img
            src={JamSocLogo}
            alt="Jam Society Logo"
            className="w-[min(90vw,900px)] h-auto mb-6 md:mb-8 drop-shadow-[0_0_25px_rgba(239,68,68,0.3)] z-10 mx-auto"
            style={{ maxWidth: isMobile() ? '90vw' : '900px' }}
          />
          <div
            ref={descRef}
            className="max-w-full sm:max-w-2xl w-full text-center text-white text-base sm:text-lg md:text-2xl font-roboto italic drop-shadow-lg px-3 sm:px-6 py-4 z-10 mx-auto"
            style={{
              opacity: isMobile() ? 1 : descStyle.opacity,
              transform: isMobile() ? 'none' : descStyle.transform,
              marginTop: '1.5rem',
              transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
              letterSpacing: '0.01em',
              fontWeight: 400,
              fontStyle: 'italic',
            }}
          >
            {description}
          </div>
        </div>
        {!isMobile() && scrollLocked && currentSection === 0 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
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
          width: '100%',
          padding: isMobile() ? '2rem 0' : '4rem 0'
        }}
      >
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Info row section - 3 sharper, square, side-by-side blocks */}
          <div className="flex flex-col md:flex-row gap-4 mb-16 md:mb-24">
            {/* Location Block */}
            <div className="flex flex-col md:flex-1 items-center shadow-2xl py-16 md:py-24 px-6 md:px-10 border border-gray-300 rounded-lg" style={{ backgroundColor: '#40413c' }}>
              <img src="/pin.svg" alt="Location Pin" className="w-16 h-16 md:w-20 md:h-20 bg-transparent mb-4" style={{ filter: 'invert(100%) brightness(200%)' }} />
              <div className="font-roboto font-medium text-3xl md:text-5xl mb-4" style={{ fontWeight: 500, color: '#fff' }}>
                Location
              </div>
              <div className="text-gray-200 font-roboto italic font-light text-center" style={{ fontWeight: 300, fontStyle: 'italic', fontSize: '16px' }}>
                Located in the Basement of Platt east of the Facilities and Maintenance Office, 340 Foothill Blvd, Claremont, CA 91711
              </div>
            </div>
            {/* Hours Block */}
            <div className="flex flex-col md:flex-1 items-center shadow-2xl py-16 md:py-24 px-6 md:px-10 border border-gray-300 rounded-lg" style={{ backgroundColor: '#40413c' }}>
              <img src="/clock.svg" alt="Clock Icon" className="w-16 h-16 md:w-20 md:h-20 bg-transparent mb-4" style={{ filter: 'invert(100%) brightness(200%)' }} />
              <div className="font-roboto font-medium text-3xl md:text-5xl mb-4" style={{ fontWeight: 500, color: '#fff' }}>
                Hours
              </div>
              <div className="text-gray-200 font-roboto italic font-light text-center" style={{ fontWeight: 300, fontStyle: 'italic', fontSize: '16px' }}>
                After 5:00 pm Monday-Friday<br />All day Saturday-Sunday
              </div>
            </div>
            {/* Who can use the room Block */}
            <div className="flex flex-col md:flex-1 items-center shadow-2xl py-16 md:py-24 px-6 md:px-10 border border-gray-300 rounded-lg" style={{ backgroundColor: '#40413c' }}>
              <img src="/door.svg" alt="Door Icon" className="w-16 h-16 md:w-20 md:h-20 bg-transparent mb-4" style={{ filter: 'invert(100%) brightness(200%)' }} />
              <div className="font-roboto font-medium text-3xl md:text-5xl mb-4 text-center" style={{ fontWeight: 500, color: '#fff' }}>
                Who can use the room?
              </div>
              <div className="text-gray-200 font-roboto italic font-light text-center" style={{ fontWeight: 300, fontStyle: 'italic', fontSize: '16px' }}>
                You! It's free. Go to the Join page and fill out the room entry quiz to get 24/7 swipe access to the room and you'll be all set. Theres no commitment on your end other than following the rules and respecting the equipment in the room. We have over 400 HMC students involved!
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
              <p className="text-black-300 mb-6 md:mb-8 text-sm md:text-base">You can! If your band wants to practice at a certain time, you can mark it on the calendar. Just go to the reserve tab for more info.</p>

              <h2 className="font-roboto font-semibold text-xl md:text-2xl mb-3 md:mb-4">Unsure how to use a piece of equipment?</h2>
              <p className="text-black-300 mb-6 md:mb-8 text-sm md:text-base">We have made guides for you to use! Go to the equipment page to see equipment guides.</p>

              <h2 className="font-roboto font-semibold text-xl md:text-2xl mb-3 md:mb-4">Equipment damaged or want to request new equipment?</h2>
              <p className="text-black-300 text-sm md:text-base">We have a damage report form. Go to the equipment page.</p>

            </div>
          </div>

          {/* Final Section with Contact Information */}
          <div className="mt-8 md:mt-10 bg-white py-8 md:py-1 px-3 md:px-6 rounded-2xl">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-roboto font-semibold text-2xl md:text-3xl mb-6 md:mb-10">Meet your Jam Society Presidents</h2>
              <div className="flex flex-col sm:flex-row justify-center gap-6 md:gap-8">
                <div>
                  <img src="/MaxC.jpeg" alt="Max Conine" className="w-[42px] h-[57px] md:w-90 md:h-130 object-cover rounded-lg mb-2 mx-auto" />
                  <div className="font-roboto font-semibold text-base md:text-lg">Max Conine</div>
                  <div className="text-gray-700 text-sm md:text-base">mconine@hmc.edu</div>
                  <div className="text-gray-700 text-sm md:text-base">(857)-701-0870</div>
                </div>
                <div>
                  <img src="/MaxB.jpeg" alt="Max Buchanan" className="w-[42px] h-[57px] md:w-90 md:h-130 object-cover rounded-lg mb-2 mx-auto" />
                  <div className="font-roboto font-semibold text-base md:text-lg">Max Buchanan</div>
                  <div className="text-gray-700 text-sm md:text-base">mabuchanan@hmc.edu</div>
                  <div className="text-gray-700 text-sm md:text-base">(626) 238-5252</div>
                </div>
              </div>
              <p className="text-black-300 py-4 text-sm md:text-base">Hi, we're Max and Max and we're happy to be your 2025 -2026 Jam Society Presidents. We take care of the room, manage the equipment, and plan events. We're happy to talk about any ideas you have to improve the room or if there's any events you would like us to plan. Please don't hesitate to reach out!</p>
              
              {/* Instagram Section */}
              <div className="flex flex-col items-center justify-center gap-2 mt-6">
                <p className="text-black-300 text-sm md:text-base mb-2">Stay tuned for updates on live events and room improvements! Follow us on instagram!</p>
                <div className="flex items-center justify-center gap-2">
                  <a 
                    href="https://www.instagram.com/hmcjamsoc/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <img src="/insta.svg" alt="Instagram" className="w-6 h-6" />
                    <span className="text-gray-700 hover:text-gray-900 text-sm md:text-base">@hmcjamsoc</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}