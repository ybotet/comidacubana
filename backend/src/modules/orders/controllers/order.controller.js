const orderService = require('../services/order.service');
const logger = require('../../../shared/logging/logger');

class OrderController {
    async createOrder(req, res, next) {
        try {
            const userId = req.user.id;
            const orderData = req.body;

            const order = await orderService.createOrderFromCart(userId, orderData);
            const orderDetails = await order.getPublicData(req.query.lang || 'es');

            res.status(201).json({
                success: true,
                message: 'Pedido creado exitosamente',
                data: orderDetails
            });
        } catch (error) {
            logger.error('Error creando pedido:', error);
            next(error);
        }
    }

    async getOrder(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const role = req.user.role;

            const order = await orderService.getOrderById(id, userId, role);
            const orderDetails = await order.getPublicData(req.query.lang || 'es');

            res.json({
                success: true,
                data: orderDetails
            });
        } catch (error) {
            logger.error('Error obteniendo pedido:', error);
            next(error);
        }
    }

    async getOrders(req, res, next) {
        try {
            const userId = req.user.id;
            const role = req.user.role;

            // Construir filtros según el rol
            const filters = {
                ...req.query,
                user_id: role === 'customer' ? userId : undefined,
                provider_id: role === 'provider' ? userId : undefined
            };

            // Filtrar valores undefined
            Object.keys(filters).forEach(key => {
                if (filters[key] === undefined) {
                    delete filters[key];
                }
            });

            const result = await orderService.getOrders(filters);

            // Convertir a datos públicos
            const ordersWithData = await Promise.all(
                result.orders.map(async order => await order.getPublicData(req.query.lang || 'es'))
            );

            res.json({
                success: true,
                data: ordersWithData,
                meta: result.meta
            });
        } catch (error) {
            logger.error('Error obteniendo pedidos:', error);
            next(error);
        }
    }

    async updateOrderStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status, reason } = req.body;
            const userId = req.user.id;
            const role = req.user.role;

            if (!status) {
                return res.status(400).json({
                    success: false,
                    error: 'El estado es requerido'
                });
            }

            const order = await orderService.updateOrderStatus(id, status, userId, role, reason);
            const orderDetails = await order.getPublicData(req.query.lang || 'es');

            res.json({
                success: true,
                message: `Estado del pedido actualizado a ${status}`,
                data: orderDetails
            });
        } catch (error) {
            logger.error('Error actualizando estado del pedido:', error);
            next(error);
        }
    }

    async acceptOrder(req, res, next) {
        try {
            const { id } = req.params;
            const providerId = req.user.id;

            const order = await orderService.acceptOrder(id, providerId);
            const orderDetails = await order.getPublicData(req.query.lang || 'es');

            res.json({
                success: true,
                message: 'Pedido aceptado exitosamente',
                data: orderDetails
            });
        } catch (error) {
            logger.error('Error aceptando pedido:', error);
            next(error);
        }
    }

    async rejectOrder(req, res, next) {
        try {
            const { id } = req.params;
            const { reason } = req.body;
            const providerId = req.user.id;

            if (!reason) {
                return res.status(400).json({
                    success: false,
                    error: 'La razón del rechazo es requerida'
                });
            }

            const order = await orderService.rejectOrder(id, providerId, reason);
            const orderDetails = await order.getPublicData(req.query.lang || 'es');

            res.json({
                success: true,
                message: 'Pedido rechazado',
                data: orderDetails
            });
        } catch (error) {
            logger.error('Error rechazando pedido:', error);
            next(error);
        }
    }

    async cancelOrder(req, res, next) {
        try {
            const { id } = req.params;
            const { reason } = req.body;
            const userId = req.user.id;
            const role = req.user.role;

            const order = await orderService.cancelOrder(id, userId, role, reason);
            const orderDetails = await order.getPublicData(req.query.lang || 'es');

            res.json({
                success: true,
                message: 'Pedido cancelado exitosamente',
                data: orderDetails
            });
        } catch (error) {
            logger.error('Error cancelando pedido:', error);
            next(error);
        }
    }

    async getOrderStatistics(req, res, next) {
        try {
            const userId = req.user.id;
            const role = req.user.role;

            const filters = {
                ...req.query,
                provider_id: role === 'provider' ? userId : undefined
            };

            // Filtrar valores undefined
            Object.keys(filters).forEach(key => {
                if (filters[key] === undefined) {
                    delete filters[key];
                }
            });

            const statistics = await orderService.getOrderStatistics(filters);

            res.json({
                success: true,
                data: statistics
            });
        } catch (error) {
            logger.error('Error obteniendo estadísticas:', error);
            next(error);
        }
    }

    async getActiveOrders(req, res, next) {
        try {
            const userId = req.user.id;
            const role = req.user.role;

            const filters = {
                ...req.query,
                user_id: role === 'customer' ? userId : undefined,
                provider_id: role === 'provider' ? userId : undefined,
                status: ['pending', 'accepted', 'preparing', 'ready', 'on_delivery']
            };

            const result = await orderService.getOrders(filters);

            const ordersWithData = await Promise.all(
                result.orders.map(async order => await order.getPublicData(req.query.lang || 'es'))
            );

            res.json({
                success: true,
                data: ordersWithData,
                meta: result.meta
            });
        } catch (error) {
            logger.error('Error obteniendo pedidos activos:', error);
            next(error);
        }
    }
}

module.exports = new OrderController();
