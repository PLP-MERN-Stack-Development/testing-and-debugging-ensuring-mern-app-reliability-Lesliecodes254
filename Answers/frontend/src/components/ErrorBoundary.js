import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error Info:', errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
    
    // You can also log to an error reporting service here
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <h1 style={styles.title}>😵 Oops! Something went wrong</h1>
            <p style={styles.message}>
              We're sorry, but something unexpected happened. 
              The error has been logged and we'll look into it.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>Error Details (Development Only)</summary>
                <pre style={styles.errorText}>
                  {this.state.error.toString()}
                </pre>
                <pre style={styles.stackTrace}>
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <button 
              onClick={this.handleReset}
              style={styles.button}
            >
              Try Again
            </button>
            
            <button 
              onClick={() => window.location.href = '/'}
              style={styles.buttonSecondary}
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7fafc',
    padding: '1rem'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    maxWidth: '600px',
    width: '100%'
  },
  title: {
    color: '#e53e3e',
    fontSize: '1.875rem',
    fontWeight: 'bold',
    marginBottom: '1rem'
  },
  message: {
    color: '#4a5568',
    marginBottom: '1.5rem',
    lineHeight: '1.5'
  },
  details: {
    backgroundColor: '#f7fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    padding: '1rem',
    marginBottom: '1.5rem',
    maxHeight: '300px',
    overflow: 'auto'
  },
  summary: {
    cursor: 'pointer',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#2d3748'
  },
  errorText: {
    color: '#e53e3e',
    fontSize: '0.875rem',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  },
  stackTrace: {
    color: '#718096',
    fontSize: '0.75rem',
    marginTop: '1rem',
    whiteSpace: 'pre-wrap'
  },
  button: {
    backgroundColor: '#3182ce',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    marginRight: '0.5rem',
    fontWeight: '500'
  },
  buttonSecondary: {
    backgroundColor: '#cbd5e0',
    color: '#2d3748',
    border: 'none',
    borderRadius: '4px',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '500'
  }
};

export default ErrorBoundary;
