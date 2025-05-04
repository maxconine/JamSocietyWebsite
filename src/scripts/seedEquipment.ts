import { addEquipment } from '../firebase/db';

const seedEquipment = async () => {
    const equipment = [
        {
            name: 'Electric Guitar',
            type: 'String',
            location: 'Guitar Room',
            available: true,
        },
        {
            name: 'Bass Guitar',
            type: 'String',
            location: 'Guitar Room',
            available: true,
        },
        {
            name: 'Drum Kit',
            type: 'Percussion',
            location: 'Drum Room',
            available: true,
        },
        {
            name: 'Microphone',
            type: 'Audio',
            location: 'Recording Booth',
            available: true,
        },
        {
            name: 'Keyboard',
            type: 'Keys',
            location: 'Main Room',
            available: true,
        }
    ];

    try {
        for (const item of equipment) {
            await addEquipment(item);
            console.log(`Added ${item.name}`);
        }
        console.log('Seeding complete!');
    } catch (error) {
        console.error('Error seeding equipment:', error);
    }
};

seedEquipment(); 