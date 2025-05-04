import { db } from './config';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';

// Equipment Collection
export const equipmentCollection = collection(db, 'equipment');

export interface Equipment {
    id?: string;
    name: string;
    code: string;
    type: string;
    location: string;
    available: boolean;
    lastCheckedOut?: string;
    checkedOutBy?: string;
    description?: string;
}

export const addEquipment = async (equipment: Omit<Equipment, 'id'>) => {
    return await addDoc(equipmentCollection, equipment);
};

export const getEquipment = async () => {
    const snapshot = await getDocs(equipmentCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Equipment[];
};

export const updateEquipment = async (id: string, data: Partial<Equipment>) => {
    const equipmentDoc = doc(db, 'equipment', id);
    return await updateDoc(equipmentDoc, data);
};

export const deleteEquipment = async (id: string) => {
    const equipmentDoc = doc(db, 'equipment', id);
    return await deleteDoc(equipmentDoc);
};

// Reservations Collection
export const reservationsCollection = collection(db, 'reservations');

export interface Reservation {
    id?: string;
    equipmentIds: string[];
    userId: string;
    startTime: string;
    endTime: string;
    status: 'pending' | 'approved' | 'rejected';
}

export const createReservation = async (reservation: Omit<Reservation, 'id'>) => {
    return await addDoc(reservationsCollection, reservation);
};

export const getReservations = async () => {
    const snapshot = await getDocs(reservationsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Reservation[];
};

// Users Collection
export const usersCollection = collection(db, 'users');

export interface User {
    id?: string;
    schoolId: string;
    name: string;
    email: string;
    isAdmin: boolean;
}

export const createUser = async (user: Omit<User, 'id'>) => {
    return await addDoc(usersCollection, user);
};

export const getUserBySchoolId = async (schoolId: string) => {
    const q = query(usersCollection, where('schoolId', '==', schoolId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0] as User | undefined;
}; 