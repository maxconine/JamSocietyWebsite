import React, { useState } from 'react';
import EquipmentTable from '../components/EquipmentTable';
import AddEquipmentModal from '../components/AddEquipmentModal';
import { addEquipment } from '../firebase/db';
// import { addSampleEquipment } from '../firebase/db';

//Note: to add new equipment images, you need to add them to the public/equipment-images folder and run the process-images script. by typing npm run process-images

const Equipment: React.FC = () => {
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const handleAddEquipment = async (data: {
    category: string;
    name: string;
    condition: string;
    value?: string;
    description?: string;
    code?: string;
    owner?: string;
    labelType?: string;
  }) => {
    setAddError(null);
    try {
      console.log('Adding equipment:', data);
      const categoryTypeMap: Record<string, string> = {
        AMP: 'Amp',
        AUD: 'Audio equipment',
        CBL: 'Cable',
        DRM: 'Drum',
        INS: 'Instrument',
        MIC: 'Microphone',
        PWR: 'Power',
        STN: 'Stand',
      };
      const equipmentData = {
        checkoutDescription: '',
        code: data.code!,
        condition: (data.condition as 'excellent' | 'good' | 'fair' | 'poor' | 'broken') || 'N/A',
        description: data.description || '',
        image: '',
        labelType: data.labelType || 'Unlabeled',
        lastCheckedOutByEmail: '',
        lastCheckedOutByName: '',
        lastCheckedOutDate: '',
        lastReturnedDate: '',
        lastReturnedNotes: '',
        location: '',
        name: data.name || '',
        notes: '',
        owner: data.owner || 'Jam Society',
        price: data.value ? Number(data.value) : 0,
        reason: '',
        status: 'Available' as 'Available',
        type: categoryTypeMap[data.category] || data.category || '',
      };
      await addEquipment(equipmentData);
    } catch (err: any) {
      setAddError(err?.message || 'Failed to add equipment.');
      console.error('Add equipment error:', err);
      throw err;
    }
  };

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
            <u>Please email us</u> at <a href="mailto:jamsociety-leadership-l@g.hmc.edu" className="text-blue-600 underline">jamsociety-leadership-l@g.hmc.edu</a> if you would like to check out the <u>QSC K12.2</u> speakers or the <u>drum kit</u> from the room as those items are more expensive and harder to transport.
          </p>
          <p className="font-roboto font-light text-gray-700 mt-6 mb-6">
            Please <u>do not</u> take any equipment out of the room that doesn't have a Jam Society label on it.
            <br />
            <br />
            Note: Currently, only Mudd students are allowed to check out equipment from the Jam Room.
          </p>
          {/* <p className="font-roboto font-light text-gray-700 mt-6 mb-6">
            Below are some commonly checked out eqipment. You can press on them and it will automatically select the items for you.
          </p> */}

          {/* Quick Select Buttons
          <div className="mb-6">
            <div className="flex flex-col gap-2">
              <span className="font-roboto font-medium text-gray-700">Quick Select:</span>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ludwig-drum-kit"
                  className="w-4 h-4 border-gray-300 rounded focus:ring-0"
                  onChange={(e) => {
                    if (e.target.checked) {
                      // Ludwig drum kit item codes
                      const ludwigDrumKitCodes = ['DRM06', 'DRM08', 'DRM10', 'DRM15', 'DRM25', 'DRM29', 'DRM30', 'DRM31', 'DRM44', 'DRM45', 'STN12', 'STN19'];
                      // This will be handled by the EquipmentTable component
                      window.dispatchEvent(new CustomEvent('selectLudwigDrumKit', { 
                        detail: { codes: ludwigDrumKitCodes } 
                      }));
                    } else {
                      // Clear selection
                      window.dispatchEvent(new CustomEvent('clearSelection'));
                    }
                  }}
                />
                <label htmlFor="ludwig-drum-kit" className="font-roboto text-black cursor-pointer">
                  Select Ludwig Drum Kit
                </label>
              </div>
            </div>
          </div> */}

          <div className="bg-white shadow rounded-lg p-6">
            <EquipmentTable />
          </div>

          <div className="mt-12 mb-12">
            <h2 className="text-2xl font-bold mb-4">Item Code System</h2>
            <p className="font-roboto font-light text-gray-700 mb-6">
              All instruments and equipment in Jam Society are given an item code consisting of a 3 letter category and a 2 digit number. This item code can be found attached to the item with either a laminated tag or a sticker.
            </p>

            <h3 className="text-xl font-semibold mb-4">Item Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">AMP</p>
                <p className="text-gray-600">amps and speakers</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">AUD</p>
                <p className="text-gray-600">mixers, effect pedals</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">CBL</p>
                <p className="text-gray-600">microphone cables, instrument cables, speakon cables, etc.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">DRM</p>
                <p className="text-gray-600">drums, drum stands, kick pedals, cowbells, drum accessories</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">INS</p>
                <p className="text-gray-600">instruments besides drums</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">MIC</p>
                <p className="text-gray-600">microphones</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">PWR</p>
                <p className="text-gray-600">power cords, power strips, extension cords</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">STN</p>
                <p className="text-gray-600">microphone stands, keyboard stands, etc.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Jam Society Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Want to support the Jam Society?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Donate Section */}
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Donate</h3>
              <p className="font-roboto font-light text-gray-700 mb-2">
                Reach out to <a href="mailto:jamsociety-leadership-l@g.hmc.edu" className="text-blue-600 underline">jamsociety-leadership-l@g.hmc.edu</a> if you are interested in supporting our club or reach out to the Office of Advancement at HMC.
              </p>
            </div>
            {/* Add New Equipment Section */}
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Add New Equipment</h3>
              <p className="font-roboto font-light text-gray-700 mb-4">
                If you have musical equipment you would like to donate to the Jam Society, click the add equipment button below and place the equipment in the room. If you have any questions, contact us at <a href="mailto:jamsociety-leadership-l@g.hmc.edu" className="text-blue-600 underline">jamsociety-leadership-l@g.hmc.edu</a>.
              </p>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors"
                onClick={() => setShowAddEquipmentModal(true)}
              >
                Add Equipment
              </button>
              <AddEquipmentModal
                isOpen={showAddEquipmentModal}
                onClose={() => setShowAddEquipmentModal(false)}
                onSubmit={async (data) => {
                  try {
                    await handleAddEquipment(data);
                    setShowAddEquipmentModal(false);
                  } catch { }
                }}
                error={addError}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Equipment;