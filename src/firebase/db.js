import { db } from './config';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
// Collection References
const equipmentCollection = collection(db, 'equipment');
const reservationsCollection = collection(db, 'reservations');
const usersCollection = collection(db, 'users');
const artistsCollection = collection(db, 'artists');
// Equipment Operations
export const getEquipment = async () => {
    const querySnapshot = await getDocs(equipmentCollection);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};
export const subscribeToEquipment = (callback) => {
    return onSnapshot(equipmentCollection, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(data);
    });
};
export const addEquipment = async (equipment) => {
    const docRef = await addDoc(equipmentCollection, equipment);
    return docRef.id;
};
export const updateEquipment = async (id, updates) => {
    const docRef = doc(db, 'equipment', id);
    await updateDoc(docRef, updates);
};
export const deleteEquipment = async (id) => {
    const docRef = doc(db, 'equipment', id);
    await deleteDoc(docRef);
};
export const getEquipmentByType = async (type) => {
    const q = query(equipmentCollection, where('type', '==', type));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};
export const getAvailableEquipment = async () => {
    const q = query(equipmentCollection, where('status', '==', 'Available'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};
export const getCheckedOutEquipment = async (userId) => {
    const q = query(equipmentCollection, where('checkedOutBy', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};
// Reservation Operations
export const createReservation = async (reservation) => {
    const docRef = await addDoc(reservationsCollection, reservation);
    return docRef.id;
};
export const getReservations = async () => {
    const snapshot = await getDocs(reservationsCollection);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};
// User Operations
export const createUser = async (user) => {
    const docRef = await addDoc(usersCollection, user);
    return docRef.id;
};
export const getUserBySchoolId = async (schoolId) => {
    const snapshot = await getDocs(query(usersCollection, where('schoolId', '==', schoolId)));
    const userDoc = snapshot.docs[0];
    return userDoc ? { id: userDoc.id, ...userDoc.data() } : undefined;
};
// Artist Operations
export const getArtists = async () => {
    const querySnapshot = await getDocs(artistsCollection);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};
export const subscribeToArtists = (callback) => {
    return onSnapshot(artistsCollection, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(data);
    });
};
export const addArtist = async (artist) => {
    // Check for existing artist with the same name
    const q = query(artistsCollection, where('name', '==', artist.name));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        throw new Error('An artist with this name already exists');
    }
    // Convert undefined photoUrl to null
    const artistData = {
        ...artist,
        photoUrl: artist.photoUrl || null
    };
    const docRef = await addDoc(artistsCollection, artistData);
    return docRef.id;
};
export const updateArtist = async (id, updates) => {
    const docRef = doc(db, 'artists', id);
    await updateDoc(docRef, updates);
};
export const deleteArtist = async (id) => {
    const docRef = doc(db, 'artists', id);
    await deleteDoc(docRef);
};
// Test function to add sample equipment
export const addSampleEquipment = async () => {
    const sampleEquipment = [
        {
            id: 'guitar1',
            name: 'Fender Stratocaster',
            code: 'GTR001',
            type: 'guitar',
            location: 'Music Room A',
            status: 'Available',
            labelType: 'QR',
            condition: 'excellent',
            price: 799.99,
            description: 'Electric guitar, sunburst finish'
        },
        {
            id: 'drum1',
            name: 'Pearl Export Kit',
            code: 'DRM001',
            type: 'drums',
            location: 'Storage Room B',
            status: 'Available',
            labelType: 'QR',
            condition: 'good',
            price: 1299.99,
            description: '5-piece drum kit with cymbals'
        },
        {
            id: 'mic1',
            name: 'Shure SM58',
            code: 'MIC001',
            type: 'microphone',
            location: 'Music Room A',
            status: 'Checked Out',
            labelType: 'QR',
            condition: 'good',
            price: 99.99,
            description: 'Dynamic vocal microphone',
            lastCheckedOut: '2024-03-20',
            checkedOutBy: 'user123'
        }
    ];
    try {
        for (const equipment of sampleEquipment) {
            const { id, ...equipmentData } = equipment;
            await addEquipment(equipmentData);
            console.log(`Added equipment: ${equipment.name}`);
        }
        console.log('All sample equipment added successfully');
        return true;
    }
    catch (error) {
        console.error('Error adding sample equipment:', error);
        return false;
    }
};
export const addEquipmentLog = async (log) => {
    try {
        const logsRef = collection(db, 'equipment_logs');
        await addDoc(logsRef, log);
    }
    catch (error) {
        console.error('Error adding equipment log:', error);
        throw error;
    }
};
