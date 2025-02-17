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
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
    // Optionally, you can send this data to an error tracking service like Sentry
    // logErrorToMyService(error, errorInfo);
  }

  handleRetry = () => {
    // Reset the error state to allow children components to try again
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="error-boundary">
          <h1>Something went wrong.</h1>
          <p>We are working to fix the issue. Please try again later.</p>
          <button onClick={this.handleRetry} className="retry-button">
            Retry
          </button>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;