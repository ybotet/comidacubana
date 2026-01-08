const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate, authorize, validate } = require('../middleware/auth.middleware');
const { 
  registerSchema, 
  loginSchema, 
  updateProfileSchema,
  refreshTokenSchema 
} = require('../validators/auth.validator');

// Rutas públicas
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', validate(refreshTokenSchema, 'body'), authController.refreshToken);
router.post('/verify', authController.verify);

// Rutas protegidas (requieren autenticación)
router.get('/profile', authenticate, authController.profile);
router.put('/profile', authenticate, validate(updateProfileSchema), authController.updateProfile);

// Rutas de administración (requieren rol admin)
router.get('/admin/users', authenticate, authorize('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Acceso de administrador permitido'
  });
});

module.exports = router;
