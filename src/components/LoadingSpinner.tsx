import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white font-roboto">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jam-blue mx-auto"></div>
                <h1 className="font-display text-2xl mt-4 text-navy">{message}</h1>
                <p className="text-muted">Please wait while we load your content.</p>
            </div>
        </div>
    );
};

export default LoadingSpinner; 