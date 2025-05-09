import { useRef, useEffect, useState } from 'react';

const images = [
  { src: '/src/assets/roomPhoto.jpeg', alt: 'Room Photo 1' },
  { src: '/src/assets/roomPhoto2.jpeg', alt: 'Room Photo 2' },
];

const description = `Jam Society seeks to serve the musicians of Harvey Mudd college by providing a soundproof "jam room" with instruments, music equipment, and recording equipment, thus giving students the space and means to pursue their musical passions. We also aim to serve Harvey Mudd college as a whole by lending this equipment for campus events such as concerts and student performances.`;

const moreInfo = `\
- Location: Basement of Platt, east of the Facilities and Maintenance Office, 340 Foothill Blvd, Claremont, CA 91711\n- Hours: After 5:00 pm Monday-Friday, All day Saturday-Sunday\n- Contact: Max Conine (mconine@hmc.edu) and Max Buchanan (mabuchanan@hmc.edu)\n- Equipment: Instruments, music gear, and recording equipment available for checkout\n- Events: Lending for campus concerts and student performances\n`;

export default function Home() {
  const headerRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [descStyle, setDescStyle] = useState({ opacity: 0, transform: 'translateY(40px)' });
  const [moreVisible, setMoreVisible] = useState(false);
  const [scrollLocked, setScrollLocked] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollThreshold = 400;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEnlarged, setIsEnlarged] = useState(false);

  // Handle scroll snapping and animations
  useEffect(() => {
    let isScrolling = false;
    let scrollTimeout: number;
    let accumulatedDelta = 0;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (isScrolling) return;

      // Reduce scroll sensitivity
      accumulatedDelta += e.deltaY * 0.5;

      // Calculate progress percentage based on current section and scroll direction
      let progress;
      if (currentSection === 0) {
        // First section: progress from 0 to 100
        progress = Math.min(Math.max((accumulatedDelta / scrollThreshold) * 100, 0), 100);
      } else {
        // Second section: progress from 100 to 0
        progress = Math.min(Math.max(100 + (accumulatedDelta / scrollThreshold) * 100, 0), 100);
      }

      // Update description style based on scroll progress
      setDescStyle({
        opacity: progress / 100,
        transform: `translateY(${40 * (1 - progress / 100)}px)`
      });

      // Only trigger section change when threshold is reached
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

          // Unlock scroll after reaching second section
          if (nextSection === 1) {
            setScrollLocked(false);
          } else {
            setScrollLocked(true);
          }

          // Reset scrolling flag after animation
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

  // Lock/unlock body scroll based on scrollLocked
  useEffect(() => {
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
      ([entry]) => setMoreVisible(entry.isIntersecting),
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
        height: scrollLocked ? '200vh' : 'auto',
        scrollSnapType: scrollLocked ? 'y mandatory' : 'none'
      }}
    >
      {/* Hero section: fills first viewport */}
      <section
        className="relative flex flex-col items-center justify-center w-full"
        style={{
          minHeight: '93vh',
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always',
          backgroundColor: 'black',
          width: '150%',
          margin: -33,
          padding: 0
        }}
      >
        <h1
          ref={headerRef}
          className={`font-black-ops-one text-white text-5xl md:text-7xl text-center mb-8 transition-opacity duration-1000 ease-out ${headerVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          Welcome to Jam Society
        </h1>
        <div
          ref={descRef}
          className="max-w-2xl w-full text-center text-white text-lg md:text-2xl font-roboto font-semibold drop-shadow-lg bg-black/60 rounded-xl px-6 py-4 border border-white/10"
          style={{
            ...descStyle,
            marginTop: '2rem',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
            letterSpacing: '0.01em',
          }}
        >
          {description}
        </div>
        {scrollLocked && currentSection === 0 && (
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
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always',
          backgroundColor: 'white',
          width: '100vw',
          padding: '4rem 0'
        }}
      >
        <div className="max-w-6xl mx-auto px-4">
          {/* New info row section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-gray-100 rounded-2xl shadow-lg py-10 px-6 mb-16">
            {/* Left: Pin and location */}
            <div className="flex items-center gap-4 w-full md:w-1/3 justify-start">
              <img src="/src/assets/pin.svg" alt="Location Pin" className="w-10 h-10 bg-transparent" />
              <div className="text-center">
                <div className="font-roboto font-semibold text-lg text-gray-900 mb-1">Location</div>
                <div className="text-gray-700 text-sm">Located in the Basement of Platt east of the Facilities and Maintenance Office, 340 Foothill Blvd, Claremont, CA 91711</div>
              </div>
            </div>
            {/* Center: Hours */}
            <div className="flex flex-col items-center w-full md:w-1/3">
              <div className="font-roboto font-semibold text-lg text-gray-900 mb-2">Hours</div>
              <div className="text-gray-700 text-center text-base">
                After 5:00 pm Monday-Friday<br />All day Saturday-Sunday
              </div>
            </div>
            {/* Right: Who can use the room? */}
            <div className="flex flex-col items-center w-full md:w-1/3">
              <div className="font-roboto font-semibold text-lg text-gray-900 mb-1 text-center">Who can use the room?</div>
              <div className="text-gray-700 text-sm text-center">
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

          {/* More info section
          <div
            ref={moreRef}
            className={`max-w-2xl w-full text-center text-gray-800 text-base md:text-lg font-roboto transition-opacity duration-1000 ease-out mx-auto ${moreVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{ margin: '0 auto 4rem auto' }}
          >
            <h2 className="text-2xl font-black-ops-one text-red-600 mb-4">More Information</h2>
            <pre className="whitespace-pre-line text-gray-700 text-left md:text-center mx-auto" style={{ fontFamily: 'Roboto, sans-serif', background: 'transparent' }}>{moreInfo}</pre>
          </div> */}

          {/* New Section with Black Background */}
          <div className="mt-10 bg-white text-black py-12 px-6 rounded-2xl">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-roboto font-semibold text-2xl mb-4">Need to check out equipment for an event?</h2>
              <p className="text-black-300 mb-8">We have an equipment checkout system. Please only check out items for a maximum of 3 days. Sign in, then go to the equipment page to select what items you are checking out. When you are done with the equipment don't forget to go back to the equipment page and return them.</p>

              <h2 className="font-roboto font-semibold text-2xl mb-4">Want to reserve the room?</h2>
              <p className="text-black-300 mb-8">You can! Now you don't have to worry about other bands practicing while you want to practice. Just go to the reserve tab for more info.</p>

              <h2 className="font-roboto font-semibold text-2xl mb-4">Equipment damaged or want to request new equipment?</h2>
              <p className="text-black-300">Go to the equipment page.</p>
            </div>
          </div>

          {/* Final Section with Contact Information */}
          <div className="mt-10 bg-white py-12 px-6 rounded-2xl">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-roboto font-semibold text-3xl mb-10">Meet your Jam Society Presidents</h2>
              <div className="flex justify-center gap-8">
                <div>
                  <img src="/src/assets/MaxC.jpeg" alt="Max Conine" className="w-90 h-130 object-cover rounded-lg mb-2" />
                  <div className="font-roboto font-semibold text-lg">Max Conine</div>
                  <div className="text-gray-700">mconine@hmc.edu</div>
                </div>
                <div>
                  <img src="/src/assets/MaxB.jpeg" alt="Max Buchanan" className="w-90 h-130 object-cover rounded-lg mb-2" />
                  <div className="font-roboto font-semibold text-lg">Max Buchanan</div>
                  <div className="text-gray-700">mabuchanan@hmc.edu</div>
                </div>
              </div>
              <p className="text-gray-700 mt-6">Hi, we're Max and Max and we're happy to be your 2025 -2026 Jam Society Presidents. We take care of the room, manage the equipment, and plan events. We're happy to talk about any ideas you have to improve the room or if there's any events you would like us to plan.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}