import { addEquipment } from '../firebase/db';

const sampleEquipment = [
    {
        name: 'Fender Stratocaster',
        code: 'GTR001',
        type: 'Guitar',
        location: 'Music Room A',
        available: true,
        hasLabel: true,
        labelType: 'QR',
        condition: 'excellent' as const,
        price: 799.99,
        description: 'Electric guitar, sunburst finish'
    },
    {
        name: 'Pearl Export Drum Kit',
        code: 'DRM001',
        type: 'Drums',
        location: 'Music Room B',
        available: true,
        hasLabel: true,
        labelType: 'QR',
        condition: 'good' as const,
        price: 1299.99,
        description: '5-piece drum kit with cymbals'
    },
    {
        name: 'Shure SM58',
        code: 'MIC001',
        type: 'Microphone',
        location: 'Storage Room',
        available: true,
        hasLabel: true,
        labelType: 'QR',
        condition: 'good' as const,
        price: 99.99,
        description: 'Dynamic vocal microphone'
    },
    {
        name: 'Yamaha P-125',
        code: 'PNO001',
        type: 'Piano',
        location: 'Music Room A',
        available: true,
        hasLabel: true,
        labelType: 'QR',
        condition: 'excellent' as const,
        price: 699.99,
        description: 'Digital piano with weighted keys'
    },
    {
        name: 'Marshall MG50GFX',
        code: 'AMP001',
        type: 'Amplifier',
        location: 'Storage Room',
        available: true,
        hasLabel: true,
        labelType: 'QR',
        condition: 'good' as const,
        price: 299.99,
        description: '50W guitar amplifier with effects'
    }
];

async function addSampleEquipment() {
    try {
        for (const equipment of sampleEquipment) {
            const id = await addEquipment(equipment);
            console.log(`Added equipment: ${equipment.name} (ID: ${id})`);
        }
        console.log('All sample equipment added successfully!');
    } catch (error) {
        console.error('Error adding sample equipment:', error);
    }
}

// Run the script
addSampleEquipment(); 