import { useState, useEffect } from 'react';
import { getEquipment, updateEquipment, Equipment } from '../firebase/db';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

export default function EquipmentTable() {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isAdmin } = useAuth();
  const schoolId = localStorage.getItem('schoolId');

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
    e.type.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
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
        <input
          type="text"
          placeholder="Search equipment..."
          className="p-2 w-64 bg-gray-100 text-gray-800 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {isAdmin && (
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => {/* TODO: Add admin actions */ }}
          >
            Admin Actions
          </button>
        )}
      </div>

      <table className="w-full table-auto">
        <thead>
          <tr className="text-left bg-gray-100">
            <th className="w-8 p-2"></th>
            <th className="p-2">Name</th>
            <th className="p-2">Type</th>
            <th className="p-2">Location</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(eq => (
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
              <td className="p-2">{eq.type}</td>
              <td className="p-2">{eq.location}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded-full text-sm ${eq.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {eq.available ? 'Available' : 'Checked Out'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedIds.length > 0 && (
        <div className="mt-4 flex space-x-4">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded disabled:opacity-50"
            onClick={handleCheckout}
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
        </div>
      )}
    </div>
  );
}
