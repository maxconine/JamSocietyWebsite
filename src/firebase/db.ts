import { db } from './config';
import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    where
} from 'firebase/firestore';

// Types
export interface Equipment {
    id?: string;
    name: string;
    code: string;
    type: string;
    location: string;
    available: boolean;
    hasLabel: boolean;
    labelType?: string;
    condition?: 'excellent' | 'good' | 'fair' | 'poor' | 'broken';
    price?: number;
    description?: string;
    lastCheckedOut?: string;
    checkedOutBy?: string;
    expectedReturn?: string;
    reason?: string;
    reservedBy?: string;
    reservedUntil?: string;
    image?: string;
    notes?: string;
}

export interface Reservation {
    id?: string;
    equipmentIds: string[];
    userId: string;
    startTime: string;
    endTime: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface User {
    id?: string;
    schoolId: string;
    name: string;
    email: string;
    isAdmin: boolean;
}

export interface Artist {
    id?: string;
    name: string;
    bio: string;
    image?: string;
    contact: string;
    createdBy: string; // School ID of the creator
    photoUrl?: string | null;
    socialMedia?: string;
    music?: string;
}

// Collection References
const equipmentCollection = collection(db, 'equipment');
const reservationsCollection = collection(db, 'reservations');
const usersCollection = collection(db, 'users');
const artistsCollection = collection(db, 'artists');

// Equipment Operations
export const getEquipment = async (): Promise<Equipment[]> => {
    const querySnapshot = await getDocs(equipmentCollection);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Equipment[];
};

export const subscribeToEquipment = (callback: (data: Equipment[]) => void) => {
    return onSnapshot(equipmentCollection, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Equipment[];
        callback(data);
    });
};

export const addEquipment = async (equipment: Omit<Equipment, 'id'>): Promise<string> => {
    const docRef = await addDoc(equipmentCollection, equipment);
    return docRef.id;
};

export const updateEquipment = async (id: string, updates: Partial<Equipment>): Promise<void> => {
    const docRef = doc(db, 'equipment', id);
    await updateDoc(docRef, updates);
};

export const deleteEquipment = async (id: string): Promise<void> => {
    const docRef = doc(db, 'equipment', id);
    await deleteDoc(docRef);
};

export const getEquipmentByType = async (type: string): Promise<Equipment[]> => {
    const q = query(equipmentCollection, where('type', '==', type));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Equipment[];
};

export const getAvailableEquipment = async (): Promise<Equipment[]> => {
    const q = query(equipmentCollection, where('available', '==', true));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Equipment[];
};

export const getCheckedOutEquipment = async (userId: string): Promise<Equipment[]> => {
    const q = query(equipmentCollection, where('checkedOutBy', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Equipment[];
};

// Reservation Operations
export const createReservation = async (reservation: Omit<Reservation, 'id'>): Promise<string> => {
    const docRef = await addDoc(reservationsCollection, reservation);
    return docRef.id;
};

export const getReservations = async (): Promise<Reservation[]> => {
    const snapshot = await getDocs(reservationsCollection);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Reservation[];
};

// User Operations
export const createUser = async (user: Omit<User, 'id'>): Promise<string> => {
    const docRef = await addDoc(usersCollection, user);
    return docRef.id;
};

export const getUserBySchoolId = async (schoolId: string): Promise<User | undefined> => {
    const snapshot = await getDocs(query(usersCollection, where('schoolId', '==', schoolId)));
    const userDoc = snapshot.docs[0];
    return userDoc ? { id: userDoc.id, ...userDoc.data() } as User : undefined;
};

// Artist Operations
export const getArtists = async (): Promise<Artist[]> => {
    const querySnapshot = await getDocs(artistsCollection);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Artist[];
};

export const subscribeToArtists = (callback: (data: Artist[]) => void) => {
    return onSnapshot(artistsCollection, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Artist[];
        callback(data);
    });
};

export const addArtist = async (artist: Omit<Artist, 'id'>): Promise<string> => {
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

export const updateArtist = async (id: string, updates: Partial<Artist>): Promise<void> => {
    const docRef = doc(db, 'artists', id);
    await updateDoc(docRef, updates);
};

export const deleteArtist = async (id: string): Promise<void> => {
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
            available: true,
            hasLabel: true,
            labelType: 'QR',
            condition: 'excellent' as const,
            price: 799.99,
            description: 'Electric guitar, sunburst finish'
        },
        {
            id: 'drum1',
            name: 'Pearl Export Kit',
            code: 'DRM001',
            type: 'drums',
            location: 'Storage Room B',
            available: true,
            hasLabel: true,
            labelType: 'QR',
            condition: 'good' as const,
            price: 1299.99,
            description: '5-piece drum kit with cymbals'
        },
        {
            id: 'mic1',
            name: 'Shure SM58',
            code: 'MIC001',
            type: 'microphone',
            location: 'Music Room A',
            available: false,
            hasLabel: true,
            labelType: 'QR',
            condition: 'good' as const,
            price: 99.99,
            description: 'Dynamic vocal microphone',
            lastCheckedOut: '2024-03-20',
            checkedOutBy: 'user123'
        }
    ];

    try {
        for (const equipment of sampleEquipment) {
            const { id, ...equipmentData } = equipment;
            await addEquipment(equipmentData as Omit<Equipment, 'id'>);
            console.log(`Added equipment: ${equipment.name}`);
        }
        console.log('All sample equipment added successfully');
        return true;
    } catch (error) {
        console.error('Error adding sample equipment:', error);
        return false;
    }
}; 