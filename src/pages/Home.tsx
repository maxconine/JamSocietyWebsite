import VirtualTour from '../components/VirtualTour';
import { useRef, useEffect, useState } from 'react';

const images = [
  { src: '/images/room1.jpg', alt: 'Recording Booth' },
  { src: '/images/room2.jpg', alt: 'Mixing Console' },
  { src: '/images/room3.jpg', alt: 'Guitar Area' },
  { src: '/images/room4.jpg', alt: 'Drum Kit' },
  { src: '/images/room5.jpg', alt: 'Lounge Space' },
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
  const scrollThreshold = 400; // Increased from 200 to make it require more scrolling

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
      setScrollProgress(progress);

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

          // Set initial progress for the new section
          if (nextSection === 0) {
            setScrollProgress(0);
          } else {
            setScrollProgress(100);
          }

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
          }, 1500); // Increased from 1000 to 1500ms
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
          minHeight: '100vh',
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always'
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
          className="max-w-2xl w-full text-center text-gray-300 text-lg md:text-2xl font-roboto"
          style={{
            ...descStyle,
            marginTop: '2rem',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
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
          width: '150%',
          padding: '4rem 0'
        }}
      >
        <div className="max-w-6xl mx-auto px-4">
          {/* More info section */}
          <div
            ref={moreRef}
            className={`max-w-2xl w-full text-center text-gray-800 text-base md:text-lg font-roboto transition-opacity duration-1000 ease-out mx-auto ${moreVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{ margin: '0 auto 4rem auto' }}
          >
            <h2 className="text-2xl font-black-ops-one text-red-600 mb-4">More Information</h2>
            <pre className="whitespace-pre-line text-gray-700 text-left md:text-center mx-auto" style={{ fontFamily: 'Roboto, sans-serif', background: 'transparent' }}>{moreInfo}</pre>
          </div>

          {/* Rest of the content */}
          <section className="mb-12">
            <h1 className="font-black-ops-one text-[35px] text-gray-900">Welcome to the Jam Room</h1>
            <p className="text-gray-700">Contact: Max Conine (<a href="mailto:mconine@hmc.edu" className="text-red-600">mconine@hmc.edu</a>) and Max Buchanan (<a href="mailto:mabuchanan@hmc.edu" className="text-red-600">mabuchanan@hmc.edu</a>)</p>
            <div className="flex space-x-8 mt-6">
              <div>
                <h2 className="font-semibold text-gray-900">Location</h2>
                <p className="text-gray-700">Basement of Platt east of the Facilities and Maintenance Office</p>
                <p className="text-gray-700">340 Foothill Blvd, Claremont, CA 91711</p>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Hours</h2>
                <p className="text-gray-700">After 5:00 pm Monday-Friday</p>
                <p className="text-gray-700">All day Saturday-Sunday</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Overview</h2>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Home: general info</li>
              <li>Artists: current artists</li>
              <li>Equipment: inventory & checkout</li>
              <li>Checkout/Return: procedures</li>
              <li>Reserve: calendar & reservations</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Join</h2>
            <p className="text-gray-700">Fill out this guide & quiz to join.</p>
            <a href="/quiz" className="text-red-600 underline">Take the quiz →</a>
          </section>

          <section className="mb-12">
            <VirtualTour images={images} />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Featured Artists</h2>
            <a href="/artists" className="text-red-600 underline">View Artists →</a>
            <div className="mt-4">
              <a href="https://forms.gle/submitBand" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">Submit Your Band</a>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}