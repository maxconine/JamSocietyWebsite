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

  const handleAddArtist = async (artistData: { name: string; bio: string; contact: string }) => {
    if (!isAuthenticated || !schoolId) {
      setError('Please log in to add an artist.');
      return;
    }

    try {
      await addArtist({
        ...artistData,
        createdBy: schoolId
      });
      setIsAddArtistModalOpen(false);
    } catch (err) {
      setError('Failed to add artist. Please try again.');
      console.error('Error adding artist:', err);
    }
  };

  return (
    <div className="min-h-screen font-roboto">
      {/* Hero Section */}
      <div 
        className="relative h-[400px] bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/Artists.mamak.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="font-medium text-5xl text-white">Discover Student Artists</h1>
        </div>
      </div>

      {/* Main Content */}
      <section className="p-16">
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 font-normal">
              {error}
            </div>
          )}
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-medium text-[35px]">Featured Artists</h2>
            {isAuthenticated ? (
              <button
                onClick={() => setIsAddArtistModalOpen(true)}
                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-medium"
              >
                Add an Artist
              </button>
            ) : (
              <p className="text-gray-600 font-normal">Please log in to add an artist</p>
            )}
          </div>
          <ArtistDropdown 
            artists={artists} 
            isAdmin={isAdmin} 
            currentUserId={schoolId || ''} 
          />
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