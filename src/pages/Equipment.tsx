import React from 'react';
import EquipmentTable from '../components/EquipmentTable';
import { addSampleEquipment } from '../firebase/db';

const Equipment: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleAddSample = async () => {
    setLoading(true);
    setError(null);
    try {
      await addSampleEquipment();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black-ops-one">Equipment</h1>
          <button
            onClick={handleAddSample}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Adding...' : 'Add Sample Equipment'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error: {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <EquipmentTable />
        </div>
      </div>
    </div>
  );
};

export default Equipment;