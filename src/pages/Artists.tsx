import { useState, useEffect } from 'react';
import ArtistDropdown from '../components/ArtistDropdown';
import AddArtistModal from '../components/AddArtistModal';
import { Artist, addArtist, subscribeToArtists } from '../firebase/db';
import { useAuth } from '../contexts/AuthContext';

export default function Artists() {
  const [isAddArtistModalOpen, setIsAddArtistModalOpen] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isAdmin } = useAuth();
  const schoolId = localStorage.getItem('schoolId');

  useEffect(() => {
    let mounted = true;

    const unsubscribe = subscribeToArtists((data) => {
      if (mounted) {
        setArtists(data);
        setError(null);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const handleAddArtist = async (artistData: { name: string; bio: string; contact: string; photoUrl?: string }) => {
    if (!isAuthenticated || !schoolId) {
      setError('Please log in to add an artist.');
      return;
    }

    try {
      const artistToAdd = {
        ...artistData,
        createdBy: schoolId,
        photoUrl: artistData.photoUrl || null
      };

      await addArtist(artistToAdd);
      setIsAddArtistModalOpen(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add artist. Please try again.');
      console.error('Error adding artist:', err);
    }
  };

  return (
    <div className="min-h-screen font-roboto">
      {/* Hero Section */}
      <section
        style={{
          width: '100vw',
          height: '400px',
          backgroundImage: 'url(/discoverNewArtists.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          zIndex: 1,
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          marginTop: -32,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            zIndex: 2,
          }}
        >
          <h1 style={{ color: 'white', fontSize: 40 }}>Discover Student Artists</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="p-16 sm:p-4">
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 font-normal">
              {error}
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 sm:gap-0">
            <h2 className="font-medium text-[35px]">Featured Artists</h2>
            {isAuthenticated ? (
              <button
                onClick={() => setIsAddArtistModalOpen(true)}
                className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors font-medium"
              >
                Add an Artist
              </button>
            ) : (
              <p className="text-gray-600 font-normal">Please log in to add an artist</p>
            )}
          </div>
          <div className="overflow-x-auto pb-4 -mx-2 sm:mx-0">
            <div className="flex flex-row gap-4 min-w-[300px]">
              <ArtistDropdown 
                artists={artists} 
                isAdmin={isAdmin} 
                currentUserId={schoolId || ''} 
              />
            </div>
          </div>
        </div>
      </section>

      <AddArtistModal
        isOpen={isAddArtistModalOpen}
        onClose={() => setIsAddArtistModalOpen(false)}
        onSubmit={handleAddArtist}
      />
    </div>
  );
}