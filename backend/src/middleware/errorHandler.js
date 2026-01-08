const logger = require('../shared/logging/logger');

/**
 * Middleware para manejo centralizado de errores
 */
const errorHandler = (err, req, res, next) => {
  // Log del error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id || 'anonymous',
  });

  // Errores de validación (Joi, etc.)
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Error de validación',
      details: err.details || err.message,
    });
  }

  // Error JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Token inválido',
    });
  }

  // Error de expiración JWT
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expirado',
    });
  }

  // Error de base de datos único (PostgreSQL)
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      error: 'Entrada duplicada',
      field: err.detail?.match(/Key \((.*)\)=/)?.[1],
    });
  }

  // Error por defecto
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Algo salió mal'
    : err.message;

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
