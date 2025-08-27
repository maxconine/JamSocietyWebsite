import { useState, useEffect } from 'react';
import { Artist, deleteArtist, updateArtist } from '../firebase/db';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';
import { v4 as uuidv4 } from 'uuid';
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';

interface ArtistDropdownProps {
  artists: Artist[];
  isAdmin: boolean;
  currentUserId: string;
  defaultArtist?: string;
}

// Maximum file size: 2MB
const MAX_FILE_SIZE = 2 * 1024 * 1024;
// Allowed file types
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

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
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
    setPhotoPreview(artist.photoUrl || null);
    setIsEditing(true);
    setError(null);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setError('Please upload a JPG or PNG image file');
        setPhotoFile(null);
        setPhotoPreview(null);
        return;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setError('Photo size must be less than 2MB');
        setPhotoFile(null);
        setPhotoPreview(null);
        return;
      }

      setError(null);
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (file: File): Promise<string> => {
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const photoRef = ref(storage, `artist-photos/${uniqueFileName}`);
    
    try {
      const uploadTask = uploadBytesResumable(photoRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            reject(new Error(`Failed to upload photo: ${error.message}`));
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              reject(new Error('Failed to get photo URL. Please try again.'));
            }
          }
        );
      });
    } catch (err) {
      throw new Error('Failed to upload photo. Please try again.');
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedArtist?.id) return;

    try {
      setIsUploading(true);
      let photoUrl: string | null = selectedArtist.photoUrl ?? null;

      if (photoFile) {
        try {
          photoUrl = await uploadPhoto(photoFile);
        } catch (uploadError) {
          setError(uploadError instanceof Error ? uploadError.message : 'Failed to upload photo. Please try again.');
          setIsUploading(false);
          return;
        }
      }

      const normalizedPhotoUrl: string | null = photoUrl === undefined ? null : photoUrl;
      const updatedArtist: Artist = {
        ...selectedArtist,
        ...editForm,
        photoUrl: normalizedPhotoUrl
      };

      await updateArtist(selectedArtist.id, {
        name: editForm.name || '',
        bio: editForm.bio || '',
        contact: editForm.contact || '',
        photoUrl: normalizedPhotoUrl,
        socialMedia: editForm.socialMedia || '',
        music: editForm.music || ''
      });
      setSelectedArtist(updatedArtist);
      setIsEditing(false);
      setError(null);
      setPhotoFile(null);
      setPhotoPreview(null);
      setUploadProgress(0);
    } catch (err) {
      setError('Failed to update artist. Please try again.');
      console.error('Error updating artist:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (artistId: string) => {
    if (!window.confirm('Are you sure you want to delete this artist?')) return;

    try {
      await deleteArtist(artistId);
      if (selectedArtist?.id === artistId) {
        setSelectedArtist(null);
        setIsEditing(false);
        setPhotoFile(null);
        setPhotoPreview(null);
        setUploadProgress(0);
      }
      setError(null);
    } catch (err) {
      setError('Failed to delete artist. Please try again.');
      console.error('Error deleting artist:', err);
    }
  };

  const canEdit = (artist: Artist) => isAdmin || artist.createdBy === currentUserId;

  return (
    <div className="space-y-4 w-full -mx-2 sm:mx-0 overflow-x-auto">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded font-normal">
          {error}
        </div>
      )}
      <div className="w-full max-w-xs mx-auto md:max-w-full lg:max-w-full">
        <Listbox value={selectedArtist} onChange={artist => { setSelectedArtist(artist); setIsEditing(false); }}>
          {() => (
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white/90 backdrop-blur-sm py-2 pl-3 pr-10 text-left shadow focus:border-gray-400 focus:outline-none focus:ring-0 font-normal">
                <span className="block truncate">{selectedArtist ? selectedArtist.name : 'Select an artist'}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white/80 backdrop-blur-sm py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <Listbox.Option
                  key="placeholder"
                  value={null}
                  disabled
                  className={() =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 text-gray-400`
                  }
                >
                  Select an artist
                </Listbox.Option>
                {artists.map((artist) => (
                  <Listbox.Option
                    key={artist.id}
                    value={artist}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-900'
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{artist.name}</span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-red-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          )}
        </Listbox>
      </div>

      {selectedArtist && (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-6xl mx-auto overflow-x-auto">
          {isEditing ? (
            <div className="space-y-6 w-full">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo
                  </label>
                  <div className="space-y-2">
                    {(photoPreview || selectedArtist.photoUrl) && (
                      <img
                        src={(photoPreview || selectedArtist.photoUrl) ?? undefined}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-md"
                      />
                    )}
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handlePhotoChange}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                    />
                    <p className="text-sm text-gray-500">
                      Accepted formats: JPG, PNG. Maximum size: 2MB
                    </p>
                    {isUploading && uploadProgress > 0 && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-red-600 h-2.5 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Uploading: {Math.round(uploadProgress)}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full md:w-2/3 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-normal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact
                    </label>
                    <input
                      type="text"
                      value={editForm.contact}
                      onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-normal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-normal"
                      rows={6}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Social Media
                    </label>
                    <input
                      type="text"
                      value={editForm.socialMedia}
                      onChange={(e) => setEditForm({ ...editForm, socialMedia: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-normal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Music Links
                    </label>
                    <input
                      type="text"
                      value={editForm.music}
                      onChange={(e) => setEditForm({ ...editForm, music: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-normal"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none font-medium"
                >
                  Cancel
                </button>
                {selectedArtist.id && (
                  <button
                    onClick={() => selectedArtist.id && handleDelete(selectedArtist.id)}
                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none font-medium"
                  >
                    Delete Artist
                  </button>
                )}
                <button
                  onClick={handleSaveEdit}
                  disabled={isUploading}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 w-full">
              <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                {selectedArtist.photoUrl && (
                  <img
                    src={selectedArtist.photoUrl}
                    alt={selectedArtist.name}
                    className="w-full md:w-1/3 h-64 object-cover rounded-md cursor-pointer hover:opacity-80 transition"
                    onClick={() => {
                      setModalImageUrl(selectedArtist.photoUrl || null);
                      setShowImageModal(true);
                    }}
                  />
                )}
                <div className="flex-1 w-full">
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
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none font-medium"
                  >
                    Edit
                  </button>
                  {isAdmin && selectedArtist.id && (
                    <button
                      onClick={() => selectedArtist.id && handleDelete(selectedArtist.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none font-medium"
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