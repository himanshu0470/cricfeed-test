'use client';

import { Component, ReactNode } from 'react';
import { toast } from 'react-toastify';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ClientErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Client Error Boundary Caught:', error, errorInfo);
    toast.error(`Something went wrong: ${error.message}`);
  }

  // THIS IS THE KEY ADDITION - Reset function
  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Return functional UI instead of static text
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-2">
          <div className="text-red-800">
            <h3 className="font-medium">Something went wrong</h3>
            <p className="text-sm mt-1">This section encountered an error, but the app is still working.</p>
            <div className="mt-3 space-x-2">
              <button
                onClick={this.handleRetry}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}