/**
 * @fileoverview Application error handling and logging
 * @module lib/error-handler
 */

/**
 * Custom application error class
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true,
    public context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "AppError";
    Object.setPrototypeOf(this, AppError.prototype);
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      context: this.context,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Handle API errors with proper logging
 */
export function handleAPIError(error: unknown): {
  statusCode: number;
  message: string;
  error: Record<string, unknown>;
} {
  console.error("API Error:", error);

  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
      error: error.toJSON(),
    };
  }

  if (error instanceof Error) {
    return {
      statusCode: 500,
      message: "Internal Server Error",
      error: {
        message: error.message,
        timestamp: new Date().toISOString(),
      },
    };
  }

  return {
    statusCode: 500,
    message: "Unknown Error",
    error: {
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Async error wrapper for API routes
 */
export function withAsyncErrorHandling(handler: Function) {
  return async (...args: unknown[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleAPIError(error);
    }
  };
}

/**
 * Validate required environment variables
 */
export function validateEnvVariables(requiredVars: string[]): void {
  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    throw new AppError(
      500,
      `Missing required environment variables: ${missing.join(", ")}`,
      false,
    );
  }
}

/**
 * Log with context
 */
export function logError(message: string, context?: Record<string, unknown>): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: "ERROR",
    message,
    context,
  };

  console.error(JSON.stringify(logEntry));
}

export function logWarn(message: string, context?: Record<string, unknown>): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: "WARN",
    message,
    context,
  };

  console.warn(JSON.stringify(logEntry));
}

export function logInfo(message: string, context?: Record<string, unknown>): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: "INFO",
    message,
    context,
  };

  console.log(JSON.stringify(logEntry));
}
