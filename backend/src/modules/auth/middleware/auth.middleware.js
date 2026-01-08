const jwt = require('jsonwebtoken');
const config = require('../../../config');
const logger = require('../../../shared/logging/logger');

/**
 * Middleware para verificar token JWT
 */
const authenticate = (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token de autenticación requerido'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Agregar usuario al request
    req.user = decoded;
    
    next();
  } catch (error) {
    logger.error('Error de autenticación:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expirado'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Token inválido'
      });
    }
    
    return res.status(401).json({
      success: false,
      error: 'Error de autenticación'
    });
  }
};

/**
 * Middleware para verificar roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Intento de acceso no autorizado: ${req.user.email} (${req.user.role}) intentó acceder a ruta que requiere roles: ${roles.join(', ')}`);
      
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para acceder a este recurso'
      });
    }

    next();
  };
};

/**
 * Middleware para validar datos de entrada
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: false
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Error de validación',
        details: errors
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
  validate
};
