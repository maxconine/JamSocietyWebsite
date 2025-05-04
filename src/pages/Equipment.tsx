import React from 'react';
import EquipmentTable from '../components/EquipmentTable';

const Equipment: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black-ops-one text-center mb-8">Equipment</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <EquipmentTable />
        </div>
      </div>
    </div>
  );
};

export default Equipment;