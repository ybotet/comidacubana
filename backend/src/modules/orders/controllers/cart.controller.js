const cartService = require('../services/cart.service');
const logger = require('../../../shared/logging/logger');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../../../config');

class CartController {
    async getCart(req, res, next) {
        try {
            // Detectar userId también desde Authorization (ruta pública acepta ambos)
            let userId = req.user?.id;
            if (!userId && req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
                try {
                    const token = req.headers.authorization.split(' ')[1];
                    const decoded = jwt.verify(token, config.jwt.secret);
                    userId = decoded?.id;
                } catch (err) {
                    // token inválido -> tratar como invitado
                    logger.warn('Token inválido al intentar leer carrito público');
                }
            }

            let sessionId = req.cookies?.session_id || req.headers['x-session-id'];

            // Si no hay user ni session, generar session para invitado y fijar cookie
            if (!userId && !sessionId) {
                sessionId = crypto.randomUUID();
                res.cookie('session_id', sessionId, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            }

            const cart = await cartService.getCart(userId, sessionId);
            const summary = await cartService.getCartSummary(cart.id, req.query.lang || 'es');

            res.json({
                success: true,
                data: summary
            });
        } catch (error) {
            logger.error('Error obteniendo carrito:', error);
            next(error);
        }
    }

    async addToCart(req, res, next) {
        try {
            const userId = req.user?.id;
            let sessionId = req.cookies?.session_id || req.headers['x-session-id'];

            if (!userId && !sessionId) {
                sessionId = crypto.randomUUID();
                res.cookie('session_id', sessionId, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            }

            // Obtener carrito
            const cart = await cartService.getCart(userId, sessionId);

            // Agregar item
            const updatedCart = await cartService.addToCart(cart.id, req.body);
            const summary = await cartService.getCartSummary(updatedCart.id, req.query.lang || 'es');

            res.json({
                success: true,
                message: 'Item agregado al carrito',
                data: summary
            });
        } catch (error) {
            logger.error('Error agregando al carrito:', error);
            next(error);
        }
    }

    async removeFromCart(req, res, next) {
        try {
            const { index } = req.params;
            const userId = req.user?.id;
            let sessionId = req.cookies?.session_id || req.headers['x-session-id'];

            if (!userId && !sessionId) {
                sessionId = crypto.randomUUID();
                res.cookie('session_id', sessionId, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            }

            // Obtener carrito
            const cart = await cartService.getCart(userId, sessionId);

            // Remover item
            const updatedCart = await cartService.removeFromCart(cart.id, parseInt(index));
            const summary = await cartService.getCartSummary(updatedCart.id, req.query.lang || 'es');

            res.json({
                success: true,
                message: 'Item removido del carrito',
                data: summary
            });
        } catch (error) {
            logger.error('Error removiendo del carrito:', error);
            next(error);
        }
    }

    async updateItemQuantity(req, res, next) {
        try {
            const { index } = req.params;
            const { quantity } = req.body;
            const userId = req.user?.id;
            let sessionId = req.cookies?.session_id || req.headers['x-session-id'];

            if (!quantity || quantity < 1) {
                return res.status(400).json({
                    success: false,
                    error: 'La cantidad debe ser al menos 1'
                });
            }

            if (!userId && !sessionId) {
                sessionId = crypto.randomUUID();
                res.cookie('session_id', sessionId, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            }

            // Obtener carrito
            const cart = await cartService.getCart(userId, sessionId);

            // Actualizar cantidad
            const updatedCart = await cartService.updateItemQuantity(cart.id, parseInt(index), quantity);
            const summary = await cartService.getCartSummary(updatedCart.id, req.query.lang || 'es');

            res.json({
                success: true,
                message: 'Cantidad actualizada',
                data: summary
            });
        } catch (error) {
            logger.error('Error actualizando cantidad:', error);
            next(error);
        }
    }

    async clearCart(req, res, next) {
        try {
            const userId = req.user?.id;
            let sessionId = req.cookies?.session_id || req.headers['x-session-id'];

            if (!userId && !sessionId) {
                sessionId = crypto.randomUUID();
                res.cookie('session_id', sessionId, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            }

            // Obtener carrito
            const cart = await cartService.getCart(userId, sessionId);

            // Vaciar carrito
            const updatedCart = await cartService.clearCart(cart.id);
            const summary = await cartService.getCartSummary(updatedCart.id, req.query.lang || 'es');

            res.json({
                success: true,
                message: 'Carrito vaciado',
                data: summary
            });
        } catch (error) {
            logger.error('Error vaciando carrito:', error);
            next(error);
        }
    }

    async mergeCarts(req, res, next) {
        try {
            const userId = req.user.id;
            const sessionId = req.cookies?.session_id || req.headers['x-session-id'];

            if (!sessionId) {
                return res.status(400).json({
                    success: false,
                    error: 'Se requiere session_id para fusionar carritos'
                });
            }
            // Fusionar carrito de sesión en carrito del usuario
            const mergedCart = await cartService.mergeSessionToUser(sessionId, userId);
            const summary = await cartService.getCartSummary(mergedCart.id, req.query.lang || 'es');

            // Limpiar cookie de sesión
            res.clearCookie('session_id');

            res.json({
                success: true,
                message: 'Carritos fusionados exitosamente',
                data: summary
            });
        } catch (error) {
            logger.error('Error fusionando carritos:', error);
            next(error);
        }
    }
}

module.exports = new CartController();
