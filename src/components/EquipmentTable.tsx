import { useState, useEffect } from 'react';
import { getEquipment, updateEquipment, Equipment, addEquipment, deleteEquipment } from '../firebase/db';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import CheckoutPopup from './CheckoutPopup';

export default function EquipmentTable() {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
  const [showCheckoutPopup, setShowCheckoutPopup] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();
  const schoolId = localStorage.getItem('schoolId');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    code: '',
    type: '',
    location: '',
    description: ''
  });
  const [addError, setAddError] = useState<string | null>(null);
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'equipment'),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Equipment[];
        setEquipment(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching equipment:', err);
        setError('Failed to load equipment. Please try again later.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filtered = equipment.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.type.toLowerCase().includes(search.toLowerCase()) ||
    e.code.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleDescription = (id: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCheckout = async () => {
    if (!isAuthenticated || !schoolId) {
      alert('Please log in to check out equipment.');
      return;
    }

    try {
      await Promise.all(selectedIds.map(id =>
        updateEquipment(id, {
          available: false,
          lastCheckedOut: new Date().toISOString(),
          checkedOutBy: schoolId
        })
      ));
      setSelectedIds([]);
    } catch (err) {
      console.error('Error checking out equipment:', err);
      alert('Failed to check out equipment. Please try again.');
    }
  };

  const handleReserve = async () => {
    if (!isAuthenticated || !schoolId) {
      alert('Please log in to reserve equipment.');
      return;
    }
    // TODO: Implement reservation logic
    console.log('Reserving:', selectedIds);
  };

  const handleReturn = async () => {
    if (!isAuthenticated || !schoolId) {
      alert('Please log in to return equipment.');
      return;
    }

    try {
      await Promise.all(selectedIds.map(id =>
        updateEquipment(id, {
          available: true,
          lastCheckedOut: undefined,
          checkedOutBy: undefined
        })
      ));
      setSelectedIds([]);
    } catch (err) {
      console.error('Error returning equipment:', err);
      alert('Failed to return equipment. Please try again.');
    }
  };

  const handleRemove = async () => {
    if (!isAdmin) return;
    try {
      await Promise.all(selectedIds.map(id => deleteEquipment(id)));
      setSelectedIds([]);
    } catch (err) {
      alert('Failed to remove equipment.');
    }
  };

  const handleAddEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    setAddLoading(true);
    try {
      await addEquipment({
        name: addForm.name,
        code: addForm.code,
        type: addForm.type,
        location: addForm.location,
        description: addForm.description,
        available: true
      });
      setShowAddModal(false);
      setAddForm({ name: '', code: '', type: '', location: '', description: '' });
    } catch (err) {
      setAddError('Failed to add equipment.');
    } finally {
      setAddLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2">Loading equipment...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search equipment..."
            className="p-2 w-64 bg-gray-100 text-gray-800 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {isAdmin && (
            <>
              <button
                className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                onClick={() => setShowAddModal(true)}
              >
                Add Equipment
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                onClick={handleRemove}
                disabled={selectedIds.length === 0}
              >
                Remove Equipment
              </button>
            </>
          )}
        </div>
        <div className="flex space-x-4">
          {selectedIds.length > 0 && (
            <>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded disabled:opacity-50"
                onClick={() => setShowCheckoutPopup(true)}
                disabled={!isAuthenticated}
              >
                Check Out
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded disabled:opacity-50"
                onClick={handleReserve}
                disabled={!isAuthenticated}
              >
                Reserve
              </button>
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded disabled:opacity-50"
                onClick={handleReturn}
                disabled={!isAuthenticated}
              >
                Return
              </button>
            </>
          )}
        </div>
      </div>

      <table className="w-full table-auto">
        <thead>
          <tr className="text-left bg-gray-100">
            <th className="w-8 p-2"></th>
            <th className="p-2">Name</th>
            <th className="p-2">Code</th>
            <th className="p-2">Type</th>
            <th className="p-2">Location</th>
            <th className="p-2">Status</th>
            <th className="w-8 p-2"></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(eq => (
            <>
              <tr key={eq.id} className="border-b border-gray-200">
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(eq.id!)}
                    onChange={() => toggleSelect(eq.id!)}
                    disabled={!eq.available}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">{eq.name}</td>
                <td className="p-2">{eq.code}</td>
                <td className="p-2">{eq.type}</td>
                <td className="p-2">{eq.location}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded-full text-sm ${eq.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {eq.available ? 'Available' : 'Checked Out'}
                  </span>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => toggleDescription(eq.id!)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <svg
                      className={`w-5 h-5 transform transition-transform ${expandedDescriptions[eq.id!] ? 'rotate-90' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </td>
              </tr>
              {expandedDescriptions[eq.id!] && (
                <tr className="border-b border-gray-200">
                  <td colSpan={7} className="p-4 bg-gray-50">
                    <div className="text-sm text-gray-700">
                      {eq.description || 'No description available'}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>

      {showCheckoutPopup && (
        <CheckoutPopup
          selectedIds={selectedIds}
          selectedEquipment={equipment.filter(eq => selectedIds.includes(eq.id!))}
          onClose={() => setShowCheckoutPopup(false)}
          onSuccess={() => setSelectedIds([])}
        />
      )}

      {/* Add Equipment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Add Equipment</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddEquipment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <input
                  type="text"
                  value={addForm.code}
                  onChange={e => setAddForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  pattern="(MIC|PWR|STN|INS|DRM|CBL|AUD|AMP)\\d{2}"
                  title="Code must match e.g. MIC01, PWR02, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <input
                  type="text"
                  value={addForm.type}
                  onChange={e => setAddForm(f => ({ ...f, type: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={addForm.location}
                  onChange={e => setAddForm(f => ({ ...f, location: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={addForm.description}
                  onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
              {addError && <p className="text-red-500 text-sm">{addError}</p>}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {addLoading ? 'Adding...' : 'Add Equipment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
