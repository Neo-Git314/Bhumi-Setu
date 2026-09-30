export function errorHandler(err, req, res, next) {
  console.error('[BhumiSetu Error Handler]:', err);

  const statusCode = err.statusCode || 500;
  const errorType = err.name || 'InternalServerError';

  res.status(statusCode).json({
    success: false,
    error: errorType,
    message: err.message || 'An unexpected operational error occurred on the land governance server.',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
}
