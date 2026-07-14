/**
 * @fileoverview Error boundary component for error handling
 * @module components/error-boundary
 */

"use client";

import React, { ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component to catch React errors
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center min-h-screen gap-6"
          style={{
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
          }}
        >
          <div className="text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--color-fifa-red)" }} />
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p style={{ color: "var(--text-secondary)" }} className="mb-4 max-w-md">
              {this.state.error?.message || "An unexpected error occurred. Please try again."}
            </p>

            <button
              onClick={this.reset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              style={{
                background: "var(--gradient-brand)",
                color: "white",
                boxShadow: "var(--shadow-glow-blue)",
              }}
              aria-label="Retry after error"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook for error handling in functional components
 */
export function useErrorHandler() {
  const handleError = (error: Error, context?: string) => {
    console.error(`Error${context ? ` in ${context}` : ""}:`, error);

    if (typeof window !== "undefined") {
      // You can emit to error tracking service here
      console.error("Stack trace:", error.stack);
    }
  };

  return { handleError };
}
