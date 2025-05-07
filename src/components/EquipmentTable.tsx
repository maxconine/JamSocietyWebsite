import { useState, useEffect } from 'react';
import { getEquipment, updateEquipment, Equipment, addEquipment, deleteEquipment, subscribeToEquipment } from '../firebase/db';
import { useAuth } from '../contexts/AuthContext';
import CheckoutPopup from './CheckoutPopup';
import React from 'react';

interface AddFormData {
  name: string;
  code: string;
  type: string;
  location: string;
  description: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
}

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
  const [addForm, setAddForm] = useState<AddFormData>({
    name: '',
    code: '',
    type: '',
    location: '',
    description: '',
    condition: 'good'
  });
  const [addError, setAddError] = useState<string | null>(null);
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToEquipment((data) => {
      setEquipment(data);
      setLoading(false);
      setError(null);
    });

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
      const equipmentData: Omit<Equipment, 'id'> = {
        name: addForm.name,
        code: addForm.code,
        type: addForm.type,
        location: addForm.location,
        available: true,
        hasLabel: false
      };
      if (addForm.description) equipmentData.description = addForm.description;
      if (addForm.condition) equipmentData.condition = addForm.condition;
      await addEquipment(equipmentData);
      setShowAddModal(false);
      setAddForm({ name: '', code: '', type: '', location: '', description: '', condition: 'good' });
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
                Remove Selected
              </button>
            </>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            onClick={handleCheckout}
            disabled={selectedIds.length === 0}
          >
            Check Out
          </button>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
            onClick={handleReserve}
            disabled={selectedIds.length === 0}
          >
            Reserve
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            onClick={handleReturn}
            disabled={selectedIds.length === 0}
          >
            Return
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedIds(filtered.map(eq => eq.id!));
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                  checked={selectedIds.length === filtered.length}
                />
              </th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Code</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id!)}
                    onChange={() => toggleSelect(item.id!)}
                  />
                </td>
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.code}</td>
                <td className="px-4 py-2">{item.type}</td>
                <td className="px-4 py-2">{item.location}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded ${item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {item.available ? 'Available' : 'Checked Out'}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {item.description && (
                    <button
                      onClick={() => toggleDescription(item.id!)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {expandedDescriptions[item.id!] ? 'Hide' : 'Show'} Description
                    </button>
                  )}
                  {expandedDescriptions[item.id!] && item.description && (
                    <div className="mt-2 text-sm text-gray-600">
                      {item.description}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Equipment</h2>
            <form onSubmit={handleAddEquipment}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={e => setAddForm(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Code</label>
                <input
                  type="text"
                  value={addForm.code}
                  onChange={e => setAddForm(prev => ({ ...prev, code: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <input
                  type="text"
                  value={addForm.type}
                  onChange={e => setAddForm(prev => ({ ...prev, type: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={addForm.location}
                  onChange={e => setAddForm(prev => ({ ...prev, location: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={addForm.description}
                  onChange={e => setAddForm(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Condition</label>
                <select
                  value={addForm.condition}
                  onChange={e => setAddForm(prev => ({ ...prev, condition: e.target.value as 'excellent' | 'good' | 'fair' | 'poor' }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
              {addError && (
                <div className="text-red-500 mb-4">{addError}</div>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
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
