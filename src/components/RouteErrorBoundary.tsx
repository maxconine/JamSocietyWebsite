import React from 'react';
import ErrorBoundary from './ErrorBoundary';

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
  routeName: string;
}

const RouteErrorBoundary: React.FC<RouteErrorBoundaryProps> = ({ children, routeName }) => {
  const fallback = (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Error Loading {routeName}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We're having trouble loading this section. Please try refreshing the page.
          </p>
          <div className="mt-6 space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Refresh Page
            </button>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
};

export default RouteErrorBoundary; 