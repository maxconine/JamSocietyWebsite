import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ReservationFormProps {
    onSuccess: () => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ onSuccess }) => {
    const { isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        endTime: '',
        reason: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            setError('Please log in to make a reservation');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            // Format the date and time for Google Calendar
            const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
            const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

            // Create the event object
            const event = {
                summary: `Jam Room Reservation: ${formData.reason}`,
                start: {
                    dateTime: startDateTime.toISOString(),
                    timeZone: 'America/Los_Angeles'
                },
                end: {
                    dateTime: endDateTime.toISOString(),
                    timeZone: 'America/Los_Angeles'
                },
                description: `Reservation made by user`
            };

            // TODO: Replace with your actual Google Calendar API endpoint
            const response = await fetch('/api/calendar/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event)
            });

            if (!response.ok) {
                throw new Error('Failed to create reservation');
            }

            onSuccess();
            setFormData({
                date: '',
                startTime: '',
                endTime: '',
                reason: ''
            });
        } catch (err) {
            setError('Failed to create reservation. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Make a Reservation</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Date
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                            Start Time
                        </label>
                        <input
                            type="time"
                            id="startTime"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                            End Time
                        </label>
                        <input
                            type="time"
                            id="endTime"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                        Reason for Reservation
                    </label>
                    <textarea
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Please describe what you'll be using the room for"
                    />
                </div>

                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {isLoading ? 'Creating Reservation...' : 'Create Reservation'}
                </button>
            </form>
        </div>
    );
};

export default ReservationForm; 