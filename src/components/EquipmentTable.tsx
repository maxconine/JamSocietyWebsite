import { useState } from 'react';
import equipmentData from '../data/equipment';

interface Equipment {
  id: string;
  name: string;
  type: string;
  location: string;
}

export default function EquipmentTable() {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = equipmentData.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.type.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleCheckout = () => {
    // TODO: integrate checkout logic
    console.log('Checking out:', selectedIds);
  };

  const handleReserve = () => {
    // TODO: integrate reservation logic
    console.log('Reserving:', selectedIds);
  };

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
          </tr>
        </thead>
        <tbody>
          {filtered.map(eq => (
            <tr key={eq.id} className="border-b border-gray-700">
              <td className="px-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(eq.id)}
                  onChange={() => toggleSelect(eq.id)}
                />
              </td>
              <td className="px-2 py-1">{eq.name}</td>
              <td className="px-2 py-1">{eq.type}</td>
              <td className="px-2 py-1">{eq.location}</td>
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
