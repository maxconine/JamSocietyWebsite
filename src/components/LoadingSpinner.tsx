import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <h1 className="text-2xl mt-4">{message}</h1>
                <p className="text-gray-600">Please wait while we load your content.</p>
            </div>
        </div>
    );
};

export default LoadingSpinner; 