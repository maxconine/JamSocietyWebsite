export interface Equipment {
    id?: string;
    name: string;
    code: string;
    type: string;
    location: string;
    status: 'Available' | 'Checked Out' | 'Missing';
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
    lastCheckedOutByName?: string;
    lastCheckedOutByEmail?: string;
    checkoutDescription?: string;
    lastCheckedOutDate?: string;
    lastReturnedDate?: string;
    lastReturnedBy?: string;
    lastReturnedByName?: string;
    lastReturnedByEmail?: string;
    lastReturnedIssues?: string;
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
    createdBy: string;
    photoUrl?: string | null;
    socialMedia?: string;
    music?: string;
}
interface EquipmentLog {
    equipmentId: string;
    equipmentName: string;
    action: 'checkout' | 'return';
    userId: string;
    userName: string;
    userEmail: string;
    description?: string;
    issues?: string;
    timestamp: string;
}
export declare const getEquipment: () => Promise<Equipment[]>;
export declare const subscribeToEquipment: (callback: (data: Equipment[]) => void) => import("@firebase/firestore").Unsubscribe;
export declare const addEquipment: (equipment: Omit<Equipment, "id">) => Promise<string>;
export declare const updateEquipment: (id: string, updates: Partial<Equipment>) => Promise<void>;
export declare const deleteEquipment: (id: string) => Promise<void>;
export declare const getEquipmentByType: (type: string) => Promise<Equipment[]>;
export declare const getAvailableEquipment: () => Promise<Equipment[]>;
export declare const getCheckedOutEquipment: (userId: string) => Promise<Equipment[]>;
export declare const createReservation: (reservation: Omit<Reservation, "id">) => Promise<string>;
export declare const getReservations: () => Promise<Reservation[]>;
export declare const createUser: (user: Omit<User, "id">) => Promise<string>;
export declare const getUserBySchoolId: (schoolId: string) => Promise<User | undefined>;
export declare const getArtists: () => Promise<Artist[]>;
export declare const subscribeToArtists: (callback: (data: Artist[]) => void) => import("@firebase/firestore").Unsubscribe;
export declare const addArtist: (artist: Omit<Artist, "id">) => Promise<string>;
export declare const updateArtist: (id: string, updates: Partial<Artist>) => Promise<void>;
export declare const deleteArtist: (id: string) => Promise<void>;
export declare const addSampleEquipment: () => Promise<boolean>;
export declare const addEquipmentLog: (log: EquipmentLog) => Promise<void>;
export {};
