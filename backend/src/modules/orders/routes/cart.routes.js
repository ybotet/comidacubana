const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { authenticate, validate } = require('../../auth/middleware/auth.middleware');
const { cartItemSchema, updateQuantitySchema } = require('../validators/cart.validator');

// Rutas públicas (para usuarios no autenticados con sesión)
router.get('/', cartController.getCart);
router.post('/items', validate(cartItemSchema), cartController.addToCart);
router.delete('/items/:index', cartController.removeFromCart);
router.put('/items/:index/quantity', validate(updateQuantitySchema), cartController.updateItemQuantity);
router.delete('/', cartController.clearCart);

// Ruta para fusionar carritos (requiere autenticación)
router.post('/merge', authenticate, cartController.mergeCarts);

module.exports = router;
