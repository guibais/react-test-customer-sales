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

      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-blue-50 p-4">
          <div className={`w-full mx-4 ${isDevelopment ? 'max-w-4xl' : 'max-w-md'}`}>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-sky-200 shadow-lg p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-2xl">⚠️</span>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-slate-800 mb-2 text-center">
                {isDevelopment ? 'Erro de Desenvolvimento' : 'Algo deu errado'}
              </h2>
              
              <p className="text-slate-600 mb-4 text-center">
                {isDevelopment 
                  ? 'Detalhes do erro para debugging:' 
                  : 'Ocorreu um erro inesperado. Tente recarregar a página.'
                }
              </p>

              {isDevelopment && this.state.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">Mensagem do Erro:</h3>
                  <p className="text-red-700 font-mono text-sm mb-3">
                    {this.state.error.message}
                  </p>
                  
                  {this.state.error.stack && (
                    <>
                      <h3 className="font-semibold text-red-800 mb-2">Stack Trace:</h3>
                      <pre className="text-red-700 font-mono text-xs bg-red-100 p-3 rounded overflow-auto max-h-64">
                        {this.state.error.stack}
                      </pre>
                    </>
                  )}
                </div>
              )}
              
              <div className="flex justify-center gap-3">
                <button
                  onClick={this.resetError}
                  className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-200"
                >
                  Tentar novamente
                </button>
                
                {isDevelopment && (
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200"
                  >
                    Recarregar página
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}