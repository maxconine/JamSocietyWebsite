import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';
import { v4 as uuidv4 } from 'uuid';

interface AddArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; bio: string; contact: string; photoUrl?: string; socialMedia?: string; music?: string }) => void;
}

// Maximum file size: 2MB
const MAX_FILE_SIZE = 2 * 1024 * 1024;
// Allowed file types
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

export default function AddArtistModal({ isOpen, onClose, onSubmit }: AddArtistModalProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

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
    
    console.log('Starting upload for file:', uniqueFileName);
    
    try {
      const uploadTask = uploadBytesResumable(photoRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload progress: ${progress.toFixed(2)}%`);
            setUploadProgress(progress);
          },
          (error) => {
            console.error('Error during upload:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            reject(new Error(`Failed to upload photo: ${error.message}`));
          },
          async () => {
            console.log('Upload completed, getting download URL...');
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log('Download URL obtained successfully');
              resolve(downloadURL);
            } catch (error) {
              console.error('Error getting download URL:', error);
              reject(new Error('Failed to get photo URL. Please try again.'));
            }
          }
        );
      });
    } catch (err) {
      console.error('Error in uploadPhoto:', err);
      throw new Error('Failed to upload photo. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);
    console.log('Starting form submission...');

    try {
      const formData = new FormData(e.currentTarget);
      let photoUrl: string | undefined;

      // Upload photo first if one was selected
      if (photoFile) {
        console.log('Photo file selected, starting upload...');
        try {
          photoUrl = await uploadPhoto(photoFile);
          console.log('Photo upload completed successfully');
        } catch (uploadError) {
          console.error('Photo upload failed:', uploadError);
          setError(uploadError instanceof Error ? uploadError.message : 'Failed to upload photo. Please try again.');
          setIsUploading(false);
          return;
        }
      }

      console.log('Submitting artist data...');
      // Then submit the artist data
      await onSubmit({
        name: formData.get('name') as string,
        bio: formData.get('bio') as string,
        contact: formData.get('contact') as string,
        photoUrl,
        socialMedia: formData.get('socialMedia') as string,
        music: formData.get('music') as string
      });
      
      console.log('Artist data submitted successfully');
      // Reset form
      setPhotoFile(null);
      setPhotoPreview(null);
      setUploadProgress(0);
      onClose();
    } catch (err) {
      console.error('Error in form submission:', err);
      setError(err instanceof Error ? err.message : 'Failed to add artist. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setError(null);
    setUploadProgress(0);
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    onClick={handleClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-2xl font-medium leading-6 text-gray-900 mb-4">
                      Add New Artist
                    </Dialog.Title>
                    <p className="text-gray-600 mb-6 font-normal">
                      We want to know you and your music! Please add youself if you are an artist at Harvey Mudd. Let others find you easily and contact you by having yourself on our website.
                    </p>
                    {error && (
                      <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded font-normal">
                        {error}
                      </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm font-normal"
                        />
                      </div>
                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          id="bio"
                          rows={3}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm font-normal"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                          Contact Information
                        </label>
                        <input
                          type="text"
                          name="contact"
                          id="contact"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm font-normal"
                        />
                      </div>
                      <div>
                        <label htmlFor="socialMedia" className="block text-sm font-medium text-gray-700">
                          Social Media (Optional)
                        </label>
                        <input
                          type="text"
                          name="socialMedia"
                          id="socialMedia"
                          placeholder="Instagram, SoundCloud, etc."
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm font-normal"
                        />
                      </div>
                      <div>
                        <label htmlFor="music" className="block text-sm font-medium text-gray-700">
                          Music Links (Optional)
                        </label>
                        <input
                          type="text"
                          name="music"
                          id="music"
                          placeholder="Spotify, YouTube, etc."
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm font-normal"
                        />
                      </div>
                      <div>
                        <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                          Photo (Optional)
                        </label>
                        <p className="text-sm text-gray-500 mb-2">
                          Accepted formats: JPG, PNG. Maximum size: 2MB
                        </p>
                        <input
                          type="file"
                          name="photo"
                          id="photo"
                          accept=".jpg,.jpeg,.png"
                          onChange={handlePhotoChange}
                          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                        />
                        {photoPreview && (
                          <div className="mt-2">
                            <img
                              src={photoPreview}
                              alt="Preview"
                              className="h-32 w-32 object-cover rounded-md"
                            />
                          </div>
                        )}
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
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={isUploading}
                          className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUploading ? 'Adding...' : 'Add Artist'}
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                          onClick={handleClose}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 