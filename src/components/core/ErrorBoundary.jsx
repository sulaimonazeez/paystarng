import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("UI Crash:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-8 text-center backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              Something went wrong 😢
            </h2>

            <p className="text-gray-300 mb-6">
              Don't worry — our engineers have been notified.
            </p>

            <button
              onClick={this.handleReload}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-2 rounded-xl font-bold"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;