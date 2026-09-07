import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-mist font-roboto">
                    <div className="max-w-md w-full space-y-8 p-8 bg-white border border-hairline">
                        <div className="text-center">
                            <h2 className="mt-6 font-display text-3xl text-navy">
                                OFF KEY
                            </h2>
                            <p className="mt-2 text-sm text-muted">
                                {this.state.error?.message || 'An unexpected error occurred'}
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="jam-btn jam-btn-primary"
                                >
                                    Refresh Page
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 