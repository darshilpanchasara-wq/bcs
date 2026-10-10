import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
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

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="max-w-md mx-auto my-16 p-8 text-center bg-surface-container-low rounded-3xl border border-outline-variant shadow-confectionery-1">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error-container/40 flex items-center justify-center text-error">
            <span className="material-symbols-outlined text-[32px]">bakery_dining</span>
          </div>
          <h2 className="font-headline text-2xl font-bold text-on-surface">Oops! Recipe Hiccup</h2>
          <p className="text-sm text-secondary mt-2">
            {this.props.fallbackMessage || 'Something went wrong while rendering this cake. Please browse our other delicious creations.'}
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-full border border-outline-variant text-on-surface hover:bg-surface-container font-semibold text-sm transition-all"
            >
              Try Again
            </button>
            <Link
              to="/shop"
              className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-white font-semibold text-sm transition-all"
            >
              Back to Catalog
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
