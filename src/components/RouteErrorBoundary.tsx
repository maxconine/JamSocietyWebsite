import React from 'react';
import ErrorBoundary from './ErrorBoundary';

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
  routeName: string;
}

const RouteErrorBoundary: React.FC<RouteErrorBoundaryProps> = ({ children, routeName }) => {
  const fallback = (
    <div className="min-h-[60vh] flex items-center justify-center bg-mist font-roboto">
      <div className="max-w-md w-full space-y-8 p-8 bg-white border border-hairline">
        <div className="text-center">
          <h2 className="mt-6 font-display text-3xl text-navy">
            Error Loading {routeName}
          </h2>
          <p className="mt-2 text-sm text-muted">
            We're having trouble loading this section. Please try refreshing the page.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="jam-btn jam-btn-primary"
            >
              Refresh Page
            </button>
            <button
              onClick={() => window.history.back()}
              className="jam-btn jam-btn-secondary"
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