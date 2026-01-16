const authService = require('../services/auth.service');
const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  refreshTokenSchema
} = require('../validators/auth.validator');
const { validate } = require('../middleware/auth.middleware');
const logger = require('../../../shared/logging/logger');
const cartService = require('../../orders/services/cart.service');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: result
      });
    } catch (error) {
      logger.error('Error en registro:', error);
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      // Si viene session_id (cookie o header), intentar fusionar carrito de sesión en el usuario
      try {
        const sessionId = req.cookies?.session_id || req.headers['x-session-id'];
        if (sessionId && result?.user?.id) {
          await cartService.mergeSessionToUser(sessionId, result.user.id);
          // Limpiar cookie de sesión
          try { res.clearCookie('session_id'); } catch (e) { /* ignore */ }
        }
      } catch (mergeErr) {
        logger.error('Error al fusionar carrito tras login:', mergeErr);
      }

      res.json({
        success: true,
        message: 'Login exitoso',
        data: result
      });
    } catch (error) {
      logger.error('Error en login:', error);
      next(error);
    }
  }

  async profile(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      logger.error('Error obteniendo perfil:', error);
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await authService.updateProfile(req.user.id, req.body);

      res.json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        data: user
      });
    } catch (error) {
      logger.error('Error actualizando perfil:', error);
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);

      res.json({
        success: true,
        message: 'Token refrescado exitosamente',
        data: result
      });
    } catch (error) {
      logger.error('Error refrescando token:', error);
      next(error);
    }
  }

  async verify(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(' ')[1];
      const user = await authService.verifyToken(token);

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      logger.error('Error verificando token:', error);
      next(error);
    }
  }
}

module.exports = new AuthController();
