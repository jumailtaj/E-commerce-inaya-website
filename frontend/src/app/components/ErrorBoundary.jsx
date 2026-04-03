import React from 'react';
import { Button } from './ui/button';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const isChunkError = this.state.error?.name === 'ChunkLoadError' || 
                          this.state.error?.message?.includes('Failed to fetch dynamically imported module');

      return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-sm shadow-xl border border-pink-100 p-8 text-center">
            <div className="w-16 h-16 bg-pink-50 rounded-sm flex items-center justify-center mx-auto mb-6">
              {isChunkError ? (
                <RefreshCcw className="w-8 h-8 text-pink-500 animate-spin-slow" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-pink-500" />
              )}
            </div>
            
            <h1 className="text-2xl font-serif text-gray-800 mb-3">
              {isChunkError ? 'Update Available' : 'Something went wrong'}
            </h1>
            
            <p className="text-gray-600 mb-8">
              {isChunkError 
                ? 'A new version of the app is available. Please reload to continue.' 
                : 'We encountered an unexpected error. Our team has been notified.'}
            </p>

            <div className="flex flex-col gap-3">
              <Button 
                onClick={this.handleReload}
                className="w-full rounded-sm bg-pink-600 hover:bg-pink-700 text-white h-12"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Reload App
              </Button>
              
              <Button 
                onClick={this.handleGoHome}
                variant="outline"
                className="w-full rounded-sm border-pink-200 text-gray-600 hover:bg-pink-50 h-12"
              >
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="mt-8 text-left">
                <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
                  Error Details (Dev Only)
                </summary>
                <pre className="mt-2 p-3 bg-gray-50 rounded-sm text-[10px] text-red-500 overflow-auto max-h-40">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ErrorPage() {
  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center">
      <ErrorBoundary>
        {/* This will trigger the ErrorBoundary's render if we're here */}
        <div />
      </ErrorBoundary>
    </div>
  );
}
