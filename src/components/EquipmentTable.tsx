import { useState, useEffect } from 'react';
import { getEquipment, updateEquipment, Equipment } from '../firebase/db';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function EquipmentTable() {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set up real-time listener for equipment collection
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

    // Cleanup subscription on unmount
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
    try {
      // Update each selected item's status in the database
      await Promise.all(selectedIds.map(id =>
        updateEquipment(id, {
          available: false,
          lastCheckedOut: new Date().toISOString(),
          // TODO: Add actual user ID here when authentication is implemented
          checkedOutBy: 'current-user'
        })
      ));
      setSelectedIds([]);
    } catch (err) {
      console.error('Error checking out equipment:', err);
      alert('Failed to check out equipment. Please try again.');
    }
  };

  const handleReserve = async () => {
    // TODO: Implement reservation logic with the database
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
      <input
        type="text"
        placeholder="Search equipment..."
        className="p-2 mb-4 w-full bg-gray-800 text-gray-200 rounded"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <table className="w-full table-auto">
        <thead>
          <tr className="text-left">
            <th className="w-8"></th>
            <th>Name</th>
            <th>Type</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(eq => (
            <tr key={eq.id} className="border-b border-gray-700">
              <td className="px-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(eq.id!)}
                  onChange={() => toggleSelect(eq.id!)}
                  disabled={!eq.available}
                />
              </td>
              <td className="px-2 py-1">{eq.name}</td>
              <td className="px-2 py-1">{eq.type}</td>
              <td className="px-2 py-1">{eq.location}</td>
              <td className="px-2 py-1">
                <span className={`px-2 py-1 rounded ${eq.available ? 'bg-green-500' : 'bg-red-500'}`}>
                  {eq.available ? 'Available' : 'Checked Out'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex space-x-4">
        <button
          className="bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-2 rounded disabled:opacity-50"
          onClick={handleCheckout}
          disabled={selectedIds.length === 0}
        >
          Check Out
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-black font-semibold px-4 py-2 rounded disabled:opacity-50"
          onClick={handleReserve}
          disabled={selectedIds.length === 0}
        >
          Reserve
        </button>
      </div>
    </div>
  );
}
