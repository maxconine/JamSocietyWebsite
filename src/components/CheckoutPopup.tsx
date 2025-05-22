import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateEquipment, Equipment } from '../firebase/db';

interface CheckoutPopupProps {
    selectedIds: string[];
    selectedEquipment: Equipment[];
    onClose: () => void;
    onSuccess: () => void;
}

const CheckoutPopup: React.FC<CheckoutPopupProps> = ({ selectedIds, selectedEquipment, onClose, onSuccess }) => {
    const { isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expectedReturn, setExpectedReturn] = useState('');
    const [reason, setReason] = useState('');
    const schoolId = localStorage.getItem('schoolId');

    const handleCheckout = async () => {
        if (!isAuthenticated || !schoolId) {
            setError('Please log in to check out equipment.');
            return;
        }
        if (!expectedReturn) {
            setError('Please enter an expected return date.');
            return;
        }
        if (!reason) {
            setError('Please enter a reason for checkout.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await Promise.all(selectedIds.map(id =>
                updateEquipment(id, {
                    lastCheckedOut: new Date().toISOString(),
                    checkedOutBy: schoolId,
                    expectedReturn,
                    reason,
                    status: 'Checked Out'
                })
            ));
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error checking out equipment:', err);
            setError('Failed to check out equipment. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Check Out Equipment</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p className="mb-2 text-gray-600">
                    You are about to check out {selectedIds.length} item{selectedIds.length !== 1 ? 's' : ''}.
                </p>
                <div className="mb-4">
                    <span className="font-semibold text-gray-700">Item Codes:</span>
                    <ul className="list-disc pl-6 text-gray-700 text-sm mt-1">
                        {selectedEquipment.map(eq => (
                            <li key={eq.id}>{eq.code} - {eq.name}</li>
                        ))}
                    </ul>
                </div>
                <form onSubmit={e => { e.preventDefault(); handleCheckout(); }} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expected Return Date</label>
                        <input
                            type="date"
                            value={expectedReturn}
                            onChange={e => setExpectedReturn(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Checkout</label>
                        <textarea
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {error && (
                        <p className="text-red-500 text-sm mb-2">{error}</p>
                    )}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                            {isLoading ? 'Checking Out...' : 'Confirm Checkout'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPopup; 