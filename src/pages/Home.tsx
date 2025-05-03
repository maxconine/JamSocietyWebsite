import VirtualTour from '../components/VirtualTour';
const images = [
  { src: '/images/room1.jpg', alt: 'Recording Booth' },
  { src: '/images/room2.jpg', alt: 'Mixing Console' },
  { src: '/images/room3.jpg', alt: 'Guitar Area' },
  { src: '/images/room4.jpg', alt: 'Drum Kit' },
  { src: '/images/room5.jpg', alt: 'Lounge Space' },
];
export default function Home() {
  return (
    <div>
      <section className="mb-8">
        <h1 className="font-black-ops-one text-[35px]">Welcome to the Jam Room</h1>
        <p>Contact: President A, President B</p>
        <div className="flex space-x-4 mt-4">
          <div>
            <h2 className="font-semibold">Location</h2>
            <p>123 Music Ave</p>
          </div>
          <div>
            <h2 className="font-semibold">Hours</h2>
            <p>Mon-Fri 9am-9pm</p>
          </div>
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <ul className="list-disc pl-5">
          <li>Home: general info</li>
          <li>Artists: current artists</li>
          <li>Equipment: inventory & checkout</li>
          <li>Checkout/Return: procedures</li>
          <li>Reserve: calendar & reservations</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Join</h2>
        <p>Fill out this guide & quiz to join.</p>
        <a href="/quiz" className="text-red-500 underline">Take the quiz →</a>
      </section>
      <section className="mb-8">
        <VirtualTour images={images} />
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Featured Artists</h2>
        <a href="/artists" className="text-red-500 underline">View Artists →</a>
        <div className="mt-4">
          <a href="https://forms.gle/submitBand" className="bg-red-500 text-black px-4 py-2 rounded">Submit Your Band</a>
        </div>
      </section>
    </div>
  );
}