import React from 'react';

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-blue-50">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-sky-200 shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">⚠️</span>
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                Algo deu errado
              </h2>
              <p className="text-slate-600 mb-4">
                Ocorreu um erro inesperado. Tente recarregar a página.
              </p>
              <button
                onClick={this.resetError}
                className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-200"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}