import { useState, useEffect } from 'react';
import { Artist, deleteArtist, updateArtist } from '../firebase/db';

interface ArtistDropdownProps {
  artists: Artist[];
  isAdmin: boolean;
  currentUserId: string;
  defaultArtist?: string;
}

export default function ArtistDropdown({ artists, isAdmin, currentUserId, defaultArtist }: ArtistDropdownProps) {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    contact: '',
    socialMedia: '',
    music: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (defaultArtist) {
      const artist = artists.find(a => a.id === defaultArtist);
      setSelectedArtist(artist || null);
    }
  }, [defaultArtist, artists]);

  const handleEdit = (artist: Artist) => {
    setSelectedArtist(artist);
    setEditForm({
      name: artist.name || '',
      bio: artist.bio || '',
      contact: artist.contact || '',
      socialMedia: artist.socialMedia || '',
      music: artist.music || ''
    });
    setIsEditing(true);
    setError(null);
  };

  const handleSaveEdit = async () => {
    if (!selectedArtist?.id) return;

    try {
      await updateArtist(selectedArtist.id, {
        name: editForm.name || '',
        bio: editForm.bio || '',
        contact: editForm.contact || '',
        photoUrl: selectedArtist.photoUrl || '',
        socialMedia: editForm.socialMedia || '',
        music: editForm.music || ''
      });
      setSelectedArtist({ ...selectedArtist, ...editForm });
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError('Failed to update artist. Please try again.');
      console.error('Error updating artist:', err);
    }
  };

  const handleDelete = async (artistId: string) => {
    if (!window.confirm('Are you sure you want to delete this artist?')) return;

    try {
      await deleteArtist(artistId);
      if (selectedArtist?.id === artistId) {
        setSelectedArtist(null);
      }
      setError(null);
    } catch (err) {
      setError('Failed to delete artist. Please try again.');
      console.error('Error deleting artist:', err);
    }
  };

  const canEdit = (artist: Artist) => isAdmin || artist.createdBy === currentUserId;

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded font-normal">
          {error}
        </div>
      )}
      <select
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-normal"
        onChange={(e) => {
          const artist = artists.find(a => a.id === e.target.value);
          setSelectedArtist(artist || null);
          setIsEditing(false);
        }}
        value={selectedArtist?.id || ''}
      >
        <option value="">Select an artist</option>
        {artists.map((artist) => (
          <option key={artist.id || ''} value={artist.id || ''}>
            {artist.name}
          </option>
        ))}
      </select>

      {selectedArtist && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-normal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-normal"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact
                </label>
                <input
                  type="text"
                  value={editForm.contact}
                  onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-normal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Social Media
                </label>
                <input
                  type="text"
                  value={editForm.socialMedia}
                  onChange={(e) => setEditForm({ ...editForm, socialMedia: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-normal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Music Links
                </label>
                <input
                  type="text"
                  value={editForm.music}
                  onChange={(e) => setEditForm({ ...editForm, music: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-normal"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                {selectedArtist.photoUrl && (
                  <img
                    src={selectedArtist.photoUrl}
                    alt={selectedArtist.name}
                    className="w-full sm:w-32 h-32 object-cover rounded-md cursor-pointer hover:opacity-80 transition"
                    onClick={() => {
                      setModalImageUrl(selectedArtist.photoUrl || null);
                      setShowImageModal(true);
                    }}
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-gray-900">{selectedArtist.name}</h3>
                  <p className="text-gray-600 font-normal mt-2">{selectedArtist.bio}</p>
                  <p className="text-gray-600 font-normal mt-2">
                    <span className="font-medium">Contact:</span> {selectedArtist.contact}
                  </p>
                  {selectedArtist.socialMedia && (
                    <p className="text-gray-600 font-normal mt-2">
                      <span className="font-medium">Social Media:</span> {selectedArtist.socialMedia}
                    </p>
                  )}
                  {selectedArtist.music && (
                    <p className="text-gray-600 font-normal mt-2">
                      <span className="font-medium">Music:</span> {selectedArtist.music}
                    </p>
                  )}
                </div>
              </div>
              {canEdit(selectedArtist) && (
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(selectedArtist)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium"
                  >
                    Edit
                  </button>
                  {isAdmin && selectedArtist.id && (
                    <button
                      onClick={() => selectedArtist.id && handleDelete(selectedArtist.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && modalImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setShowImageModal(false)}
        >
          <img
            src={modalImageUrl}
            alt="Artist Fullscreen"
            className="max-w-full max-h-full rounded shadow-lg"
            onClick={e => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white text-3xl font-bold bg-black bg-opacity-60 rounded-full px-3 py-1 hover:bg-opacity-90 focus:outline-none"
            onClick={() => setShowImageModal(false)}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}