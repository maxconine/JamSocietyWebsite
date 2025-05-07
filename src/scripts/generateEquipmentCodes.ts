const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json'); // Update this path if needed

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

function generateCode(type, existingCodes) {
    const typeMap = {
        microphone: 'MIC',
        mic: 'MIC',
        power: 'PWR',
        stand: 'STN',
        instrument: 'INS',
        drum: 'DRM',
        cable: 'CBL',
        audio: 'AUD',
        amp: 'AMP'
    };

    let prefix = 'GEN';
    for (const [key, value] of Object.entries(typeMap)) {
        if (type && type.toLowerCase().includes(key)) {
            prefix = value;
            break;
        }
    }

    let maxNum = 0;
    existingCodes.forEach(code => {
        if (code.startsWith(prefix)) {
            const num = parseInt(code.slice(prefix.length), 10);
            if (!isNaN(num) && num > maxNum) maxNum = num;
        }
    });

    const nextNum = String(maxNum + 1).padStart(2, '0');
    return `${prefix}${nextNum}`;
}

async function addCodesToEquipment() {
    const snapshot = await db.collection('equipment').get();
    const allDocs = [];
    const existingCodes = [];

    snapshot.forEach(doc => {
        const data = doc.data();
        allDocs.push({ id: doc.id, ...data });
        if (data.code) existingCodes.push(data.code);
    });

    const updates = [];
    for (const doc of allDocs) {
        if (!doc.code) {
            const code = generateCode(doc.type || '', existingCodes);
            existingCodes.push(code);
            updates.push(
                db.collection('equipment').doc(doc.id).update({ code })
            );
            console.log(`Assigning code ${code} to ${doc.name}`);
        }
    }

    await Promise.all(updates);
    console.log('Custom codes assigned to all equipment!');
}

addCodesToEquipment().catch(console.error); 