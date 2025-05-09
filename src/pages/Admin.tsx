import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

interface InventoryItem {
    name: string;
    description: string;
    quantity: number;
    category: string;
}

export default function Admin() {
    const [newItem, setNewItem] = useState<InventoryItem>({
        name: '',
        description: '',
        quantity: 0,
        category: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'inventory'), newItem);
            setNewItem({
                name: '',
                description: '',
                quantity: 0,
                category: ''
            });
            alert('Item added successfully!');
        } catch (error) {
            console.error('Error adding item:', error);
            alert('Error adding item. Please try again.');
        }
    };

    return (
        <div className="bg-white min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">Item Name:</label>
                    <input
                        type="text"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2">Description:</label>
                    <textarea
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2">Quantity:</label>
                    <input
                        type="number"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2">Category:</label>
                    <input
                        type="text"
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Add Item
                </button>
            </form>
        </div>
    );
} 