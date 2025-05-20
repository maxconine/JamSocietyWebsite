import { useState } from 'react';
import { Artist, deleteArtist, updateArtist } from '../firebase/db';

interface ArtistDropdownProps {
  artists: Artist[];
  isAdmin: boolean;
  currentUserId: string;
}

export default function ArtistDropdown({ artists, isAdmin, currentUserId }: ArtistDropdownProps) {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    contact: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (artist: Artist) => {
    setSelectedArtist(artist);
    setEditForm({
      name: artist.name || '',
      bio: artist.bio || '',
      contact: artist.contact || ''
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
        photoUrl: selectedArtist.photoUrl || ''
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
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-normal"
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
              <div className="flex items-start space-x-4">
                {selectedArtist.photoUrl && (
                  <img
                    src={selectedArtist.photoUrl}
                    alt={selectedArtist.name}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-gray-900">{selectedArtist.name}</h3>
                  <p className="text-gray-600 font-normal mt-2">{selectedArtist.bio}</p>
                  <p className="text-gray-600 font-normal mt-2">
                    <span className="font-medium">Contact:</span> {selectedArtist.contact}
                  </p>
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
    </div>
  );
}