const errorMiddleware = (err, req, res, next) => {
  console.error('[ERROR]', {
    message: err.message,
    statusCode: err.statusCode,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  const statusCode = err.statusCode || 500;
  let clientMessage = err.message;

  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    clientMessage = 'Error interno del servidor';
  }

  const response = {
    success: false,
    message: clientMessage
  };

  if (process.env.NODE_ENV === 'development') {
    response.error = {
      details: err.details || null,
      stack: err.stack
    };
  }

  res.status(statusCode).json(response);
};

module.exports = errorMiddleware;