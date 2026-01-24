import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-red-50 rounded-lg border border-red-200 m-4">
          <h2 className="text-xl font-bold text-red-800 mb-2">
            Module Error
          </h2>
          <p className="text-red-600 mb-4">
            This module could not be loaded. Please verify the connection or try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Reload Page
          </button>
          {import.meta.env.DEV && (
             <pre className="mt-4 text-left text-xs text-red-800 overflow-auto bg-red-100 p-2 rounded">
               {this.state.error?.toString()}
             </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
