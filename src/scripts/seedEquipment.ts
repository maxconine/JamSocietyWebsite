const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json'); // Update this path if needed

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seedEquipment() {
    const equipment = [
        {
            code: 'DRM01',
            name: 'Sonar Force 3003 22" Kick',
            type: 'Drum',
            location: 'Underneath keyboard north side',
            description: 'Green kick drum',
            available: true
        },
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

    for (const item of equipment) {
        await db.collection('equipment').add(item);
        console.log(`Added equipment: ${item.code ? item.code : item.name}`);
    }
    console.log('Seeding complete!');
}

seedEquipment().catch(console.error); 