/**
 * Global Error Handling Middleware
 * Provides a consistent JSON response for all application errors
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  // Log the error for the developer (in a real app, use a logger like Winston)
  console.error(`[ERROR] ${req.method} ${req.path} >> ${err.message}`);

  res.status(statusCode).json({
    status,
    message: err.message,
    // Include stack trace only in development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
