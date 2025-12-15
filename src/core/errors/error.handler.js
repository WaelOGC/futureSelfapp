// Global error handling and error response formatting

/**
 * Application error class with status code and error code
 */
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'APP_ERROR', details = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Convert unknown errors to AppError
 * @param {Error|unknown} err - Error to convert
 * @returns {AppError} AppError instance
 */
function toAppError(err) {
  if (err instanceof AppError) {
    return err;
  }

  if (err instanceof Error) {
    return new AppError(
      err.message || 'An unexpected error occurred',
      500,
      'UNKNOWN_ERROR',
      { originalError: err.name }
    );
  }

  if (typeof err === 'string') {
    return new AppError(err, 500, 'STRING_ERROR');
  }

  return new AppError(
    'An unexpected error occurred',
    500,
    'UNKNOWN_ERROR',
    { originalError: String(err) }
  );
}

module.exports = {
  AppError,
  toAppError
};
