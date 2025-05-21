import { useState, useEffect } from 'react';
import { updateEquipment, Equipment, addEquipment, deleteEquipment, subscribeToEquipment } from '../firebase/db';
import { useAuth } from '../contexts/AuthContext';
import React from 'react';
import { FaBoxOpen, FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';

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
  const [modalImage, setModalImage] = useState<string | null>(null);

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

  const toggleDescriptionExpand = (id: string) => {
    setExpandedDescriptions(prev => ({ ...prev, [id]: !prev[id] }));
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
    try {
      const reservedUntil = new Date();
      reservedUntil.setDate(reservedUntil.getDate() + 3); // Reserve for 3 days
      await Promise.all(selectedIds.map(id =>
        updateEquipment(id, {
          reservedBy: schoolId,
          reservedUntil: reservedUntil.toISOString(),
        })
      ));
      setSelectedIds([]);
    } catch (err) {
      console.error('Error reserving equipment:', err);
      alert('Failed to reserve equipment. Please try again.');
    }
  };

  const handleCancelReservation = async () => {
    if (!isAuthenticated || !schoolId) {
      alert('Please log in to cancel reservation.');
      return;
    }
    try {
      await Promise.all(selectedIds.map(id =>
        updateEquipment(id, {
          reservedBy: undefined,
          reservedUntil: undefined,
        })
      ));
      setSelectedIds([]);
    } catch (err) {
      console.error('Error cancelling reservation:', err);
      alert('Failed to cancel reservation. Please try again.');
    }
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
    <div className="bg-white rounded-2xl shadow-lg p-0 md:p-6">
      {/* Status Legend */}
      <div className="flex items-center justify-end gap-4 mb-2 pr-2">
        <span className="flex items-center gap-1 text-xs text-gray-600"><span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>Available</span>
        <span className="flex items-center gap-1 text-xs text-gray-600"><span className="inline-block w-3 h-3 rounded-full bg-yellow-400"></span>Reserved</span>
        <span className="flex items-center gap-1 text-xs text-gray-600"><span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>Checked Out</span>
      </div>
      {/* Search and Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border-b border-gray-100 sticky top-0 z-10 bg-white rounded-t-2xl">
        <input
          type="text"
          placeholder="Search equipment..."
          className="p-3 w-full md:w-96 bg-gray-100 text-gray-800 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-base"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-2 md:gap-3 mt-2 md:mt-0">
          <button
            className="px-4 py-2 rounded-full bg-black text-white font-roboto font-medium hover:bg-black transition disabled:opacity-50"
            onClick={handleCheckout}
            disabled={selectedIds.length === 0}
          >
            Check Out
          </button>
          <button
            className="px-4 py-2 rounded-full bg-black text-white font-roboto font-medium hover:bg-black transition disabled:opacity-50"
            onClick={handleReserve}
            disabled={selectedIds.length === 0}
          >
            Reserve
          </button>
          <button
            className="px-4 py-2 rounded-full bg-black text-white font-roboto font-medium hover:bg-black transition disabled:opacity-50"
            onClick={handleCancelReservation}
            disabled={selectedIds.length === 0 || !selectedIds.some(id => {
              const eq = equipment.find(e => e.id === id);
              return eq && eq.reservedBy === schoolId;
            })}
          >
            Cancel Reservation
          </button>
          <button
            className="px-4 py-2 rounded-full bg-black text-white font-roboto font-medium hover:bg-black transition disabled:opacity-50"
            onClick={handleReturn}
            disabled={selectedIds.length === 0}
          >
            Return
          </button>
          {isAdmin && (
            <>
              <button
                className="px-4 py-2 rounded-full bg-black text-white font-roboto font-medium hover:bg-black transition"
                onClick={() => setShowAddModal(true)}
              >
                Add Equipment
              </button>
              <button
                className="px-4 py-2 rounded-full bg-black text-white font-roboto font-medium hover:bg-black transition disabled:opacity-50"
                onClick={handleRemove}
                disabled={selectedIds.length === 0}
              >
                Remove Selected
              </button>
            </>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-gray-900 table-fixed">
          <thead className="hidden md:table-header-group">
            <tr className="bg-gray-50 sticky top-0 z-10 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100">
              <th className="w-1 p-0"></th>
              <th className="w-10 px-1 py-2 text-left"></th>
              <th className="w-8 px-1 py-2 text-left"></th>
              <th className="w-24 px-1 py-2 text-left font-semibold truncate">Name</th>
              <th className="w-16 px-1 py-2 text-left font-semibold truncate">Code</th>
              <th className="w-16 px-1 py-2 text-left font-semibold truncate">Type</th>
              <th className="w-16 px-1 py-2 text-left font-semibold truncate">Location</th>
              <th className="w-10 px-1 py-2 text-center font-semibold">Status</th>
              <th className="w-8 px-1 py-2 text-center font-semibold">Info</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => {
              // Status bar color
              let statusColor = item.available
                ? item.reservedBy
                  ? 'bg-yellow-400'
                  : 'bg-green-500'
                : 'bg-red-500';
              return (
                <React.Fragment key={item.id}>
                  <tr 
                    className="border-b last:border-b-0 hover:bg-gray-50 transition group text-xs relative cursor-pointer"
                    onClick={() => toggleDescriptionExpand(item.id!)}
                  >
                    <td className="p-0 w-1">
                      <div className={`h-8 w-1 rounded-l-xl ${statusColor}`}></div>
                    </td>
                    <td className="px-1 py-2 w-10">
                      {item.image ? (
                        <img
                          src={`/equipment-images/${item.image}`}
                          alt={item.name}
                          className="w-8 h-8 object-cover rounded-md cursor-pointer hover:opacity-80 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalImage(`/equipment-images/${item.image}`);
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md text-gray-400">
                          <FaBoxOpen size={16} />
                        </div>
                      )}
                    </td>
                    <td className="px-1 py-2 w-8">
                      <input
                        type="checkbox"
                        className="rounded-full w-4 h-4 border-gray-300 focus:ring-blue-500"
                        checked={selectedIds.includes(item.id!)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleSelect(item.id!);
                        }}
                      />
                    </td>
                    <td className="px-1 py-2 w-24 font-medium whitespace-nowrap truncate" title={item.name}>{item.name}</td>
                    <td className="px-1 py-2 w-16 whitespace-nowrap truncate hidden md:table-cell" title={item.code}>{item.code}</td>
                    <td className="px-1 py-2 w-16 whitespace-nowrap truncate hidden md:table-cell" title={item.type}>{item.type}</td>
                    <td className="px-1 py-2 w-16 whitespace-nowrap truncate hidden md:table-cell" title={item.location}>{item.location}</td>
                    <td className="px-1 py-2 w-10 text-center hidden md:table-cell">
                      {item.available ? (
                        item.reservedBy ? (
                          <span className="inline-block w-3 h-3 rounded-full bg-yellow-400"></span>
                        ) : (
                          <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                        )
                      ) : (
                        <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                      )}
                    </td>
                    <td className="px-1 py-2 w-8 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDescriptionExpand(item.id!);
                        }}
                        className="text-gray-400 hover:text-blue-600 focus:outline-none"
                        aria-label="Show description"
                      >
                        {expandedDescriptions[item.id!] ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </td>
                  </tr>
                  {expandedDescriptions[item.id!] && (
                    <tr className="bg-gray-50">
                      <td colSpan={9} className="px-8 py-3 text-xs text-gray-700">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                          <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-4">
                            <span><span className="font-semibold">Code:</span> {item.code}</span>
                            <span><span className="font-semibold">Type:</span> {item.type}</span>
                            <span><span className="font-semibold">Location:</span> {item.location}</span>
                            <span><span className="font-semibold">Status:</span>{' '}
                              {item.available
                                ? item.reservedBy
                                  ? 'Reserved'
                                  : 'Available'
                                : 'Checked Out'}
                            </span>
                            {item.description && (
                              <span><span className="font-semibold">Description:</span> {item.description}</span>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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

      {/* Image Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Equipment Fullscreen"
            className="max-w-full max-h-full rounded shadow-lg"
            onClick={e => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white text-3xl font-bold bg-black bg-opacity-60 rounded-full px-3 py-1 hover:bg-opacity-90 focus:outline-none"
            onClick={() => setModalImage(null)}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
}
