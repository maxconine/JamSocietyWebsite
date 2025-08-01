import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getEquipmentByType } from '../firebase/db';

const CATEGORY_OPTIONS = [
  { value: 'AMP', label: 'AMP (amps and speakers)' },
  { value: 'AUD', label: 'AUD (mixers, effect pedals)' },
  { value: 'CBL', label: 'CBL (microphone cables, instrument cables, speakon cables, etc.)' },
  { value: 'DRM', label: 'DRM (drums, drum stands, kick pedals, cowbells, drum accessories)' },
  { value: 'INS', label: 'INS (instruments besides drums)' },
  { value: 'MIC', label: 'MIC (microphones)' },
  { value: 'PWR', label: 'PWR (power cords, power strips, extension cords)' },
  { value: 'STN', label: 'STN (microphone stands, keyboard stands, etc.)' },
];

const CONDITION_OPTIONS = [
  'broken', 'poor', 'fair', 'good', 'excellent'
];

const LABEL_TYPE_OPTIONS = [
  'Sticker', 'Tag', 'Written', 'Unlabeled'
];

interface AddEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    category: string;
    name: string;
    condition: string;
    value?: string;
    description?: string;
    code?: string;
    owner?: string;
    labelType?: string;
  }) => void | Promise<void>;
  error?: string | null;
}

export default function AddEquipmentModal({ isOpen, onClose, onSubmit, error: externalError }: AddEquipmentModalProps) {
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [condition, setCondition] = useState('good');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [owner, setOwner] = useState('Jam Society');
  const [labelType, setLabelType] = useState('Unlabeled');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!category || !name || !condition) {
      setError('Please fill out all required fields.');
      return;
    }
    setLoading(true);
    let finalCode = code;
    if (!finalCode) {
      // Auto-generate code
      try {
        const items = await getEquipmentByType(category);
        // Find highest number in codes like AMP01, AMP32
        let maxNum = 0;
        items.forEach(item => {
          const match = item.code.match(/^(\w+)(\d+)$/i);
          if (match && match[1].toUpperCase() === category.toUpperCase()) {
            const num = parseInt(match[2], 10);
            if (num > maxNum) maxNum = num;
          }
        });
        const nextNum = maxNum + 1;
        const paddedNum = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
        finalCode = `${category}${paddedNum}`;
      } catch (err) {
        setError('Failed to generate code.');
        setLoading(false);
        return;
      }
    }
    await onSubmit({
      category,
      name,
      condition,
      value,
      description,
      code: finalCode,
      owner: owner || undefined,
      labelType: labelType || 'N/A',
    });
    setCategory('');
    setName('');
    setCondition('good');
    setValue('');
    setDescription('');
    setCode('');
    setOwner('Jam Society');
    setLabelType('Unlabeled');
    setLoading(false);
    onClose();
  };

  const handleClose = () => {
    setCategory('');
    setName('');
    setCondition('good');
    setValue('');
    setDescription('');
    setCode('');
    setOwner('Jam Society');
    setLabelType('Unlabeled');
    setError(null);
    setLoading(false);
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
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={handleClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-2xl font-medium leading-6 text-gray-900 mb-4">
                      Add New Equipment
                    </Dialog.Title>
                    { (error || externalError) && (
                      <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded font-normal">
                        {error || externalError}
                      </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                          Item Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="category"
                          name="category"
                          required
                          value={category}
                          onChange={e => setCategory(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-normal"
                        >
                          <option value="">Select a category</option>
                          {CATEGORY_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-normal"
                          placeholder="e.g. Fender Deluxe Amp"
                        />
                      </div>
                      <div>
                        <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                          Condition <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="condition"
                          name="condition"
                          required
                          value={condition}
                          onChange={e => setCondition(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-normal"
                        >
                          {CONDITION_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                          Value (optional please integer only)
                        </label>
                        <input
                          type="text"
                          id="value"
                          name="value"
                          value={value}
                          onChange={e => setValue(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-normal"
                          placeholder="e.g. 100"
                        />
                      </div>
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Description (optional)
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          rows={2}
                          value={description}
                          onChange={e => setDescription(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-normal"
                        />
                      </div>
                      <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                          Code (optional)
                        </label>
                        <input
                          type="text"
                          id="code"
                          name="code"
                          value={code}
                          onChange={e => setCode(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-normal"
                          placeholder="Leave blank to auto-generate"
                        />
                      </div>
                      <div>
                        <label htmlFor="owner" className="block text-sm font-medium text-gray-700">
                          Owner
                        </label>
                        <input
                          type="text"
                          id="owner"
                          name="owner"
                          value={owner}
                          onChange={e => setOwner(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-normal"
                          placeholder="e.g. Your Name"
                        />
                      </div>
                      <div>
                        <label htmlFor="labelType" className="block text-sm font-medium text-gray-700">
                          Label Type
                        </label>
                        <select
                          id="labelType"
                          name="labelType"
                          value={labelType}
                          onChange={e => setLabelType(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-normal"
                        >
                          {LABEL_TYPE_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={loading}
                          className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Adding...' : 'Add Equipment'}
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
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