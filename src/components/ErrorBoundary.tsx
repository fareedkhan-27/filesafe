import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // TODO: Log to error reporting service (e.g., Sentry) in production
    // Errors still visible in React DevTools for development
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/home';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
          <div className="max-w-lg w-full">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 text-center">
              {/* Icon */}
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="text-red-600 dark:text-red-400" size={40} />
              </div>
              
              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Oops! Something went wrong
              </h1>
              
              {/* Description */}
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Don't worry, your data is safe. Try refreshing the app or going back to home.
              </p>
              
              {/* Error Details (Collapsible) */}
              {this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 font-medium mb-2">
                    📋 Show technical details
                  </summary>
                  <div className="mt-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-mono text-red-600 dark:text-red-400 mb-2">
                      {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-40">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={this.handleReload}
                  className="w-full flex items-center justify-center gap-3 btn-primary text-lg"
                >
                  <RefreshCw size={20} />
                  Refresh App
                </button>
                
                <button
                  onClick={this.handleReset}
                  className="w-full flex items-center justify-center gap-3 btn-secondary text-lg"
                >
                  <Home size={20} />
                  Go to Home
                </button>
              </div>

              {/* Help Text */}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
                If this problem persists, try clearing your browser data or using a different browser.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

