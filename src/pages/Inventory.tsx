import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAdminAuth } from '../firebase/useAdminAuth';
import { Link } from 'react-router-dom';

interface InventoryItem {
    id: string;
    name: string;
    description: string;
    quantity: number;
    category: string;
}

export default function Inventory() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [schoolId, setSchoolId] = useState('');
    const isAdmin = useAdminAuth(schoolId);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'inventory'));
                const itemsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as InventoryItem[];
                setItems(itemsData);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Inventory</h1>

            <div className="mb-4">
                <label className="block mb-2">Enter School ID:</label>
                <input
                    type="text"
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    className="p-2 border rounded"
                    placeholder="Enter your school ID"
                />
            </div>

            {isAdmin && (
                <div className="mb-4">
                    <Link to="/admin" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                        Go to Admin Dashboard
                    </Link>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                    <div key={item.id} className="border p-4 rounded shadow">
                        <h2 className="text-xl font-semibold">{item.name}</h2>
                        <p className="text-gray-600">{item.description}</p>
                        <p className="mt-2">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-500">Category: {item.category}</p>
                    </div>
                ))}
            </div>
        </div>
    );
} 