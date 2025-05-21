import React from 'react';
import EquipmentTable from '../components/EquipmentTable';
// import { addSampleEquipment } from '../firebase/db';

const Equipment: React.FC = () => {

  return (
    <div className="min-h-screen font-roboto">
      {/* Hero Section */}
      <section
        style={{
          width: '100vw',
          height: '400px',
          backgroundImage: 'url(/Equipment.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          zIndex: 1,
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          marginTop: -32,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            zIndex: 2,
          }}
        >
          <h1
            className="text-white text-3xl sm:text-4xl md:text-5xl font-bold text-center px-2"
          >
            Equipment
          </h1>
        </div>
      </section>

      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-roboto font-light text-gray-700 mt-12 mb-6">
            This is where you can check equipment in and out of the room. If you want to borrow equipment from the room, you must check it out by selecting the equipment you are checking out and pressing the check out button. When returning equipment, please note the condition and mark it as broken if there are any issues. We will fix it promptly.
          </p>
          <p className="font-roboto font-light text-gray-700 mt-6 mb-6">
            If you need help using pieces of equipment, please refer to the guides page for help. A lot of equipment in this room is expensive and if you are using it improperly it can get damaged easily. Please understand how to use the equipment before attempting to use it.
          </p>
          <p className="font-roboto font-light text-gray-700 mt-6 mb-6">
            Below are some commonly checked out eqipment. You can press on them and it will automatically select the items for you.
          </p>
          <div className="bg-white shadow rounded-lg p-6">
            <EquipmentTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Equipment;