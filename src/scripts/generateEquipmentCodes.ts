import { db } from '../firebase/config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

interface Equipment {
    id: string;
    type: string;
    code?: string;
}

const generateCode = (type: string, existingCodes: string[]): string => {
    const prefix = type.substring(0, 3).toUpperCase();
    let code: string;
    let counter = 1;

    do {
        code = `${prefix}${counter.toString().padStart(3, '0')}`;
        counter++;
    } while (existingCodes.includes(code));

    return code;
};

const updateEquipmentCodes = async () => {
    try {
        const equipmentCollection = collection(db, 'equipment');
        const snapshot = await getDocs(equipmentCollection);
        const allDocs: Equipment[] = [];

        // First pass: collect all existing codes
        snapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data() as Equipment;
            allDocs.push({ id: docSnapshot.id, type: data.type, code: data.code });
        });

        // Second pass: update documents without codes
        for (const equipment of allDocs) {
            if (!equipment.code) {
                const existingCodes = allDocs
                    .filter((d) => d.code)
                    .map((d) => d.code as string);

                const newCode = generateCode(equipment.type, existingCodes);
                const docRef = doc(db, 'equipment', equipment.id);
                await updateDoc(docRef, { code: newCode });
                console.log(`Updated ${equipment.id} with code ${newCode}`);
            }
        }

        console.log('Equipment codes updated successfully');
    } catch (error) {
        console.error('Error updating equipment codes:', error);
    }
};

updateEquipmentCodes(); 