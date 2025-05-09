import ArtistDropdown from '../components/ArtistDropdown';
export default function Artists() {
  return (
    <section className="min-h-screen p-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-black-ops-one text-[35px] mb-4">Artists</h1>
        <ArtistDropdown />
      </div>
    </section>
  );
}