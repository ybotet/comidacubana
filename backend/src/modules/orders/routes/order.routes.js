const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate, authorize, validate } = require('../../auth/middleware/auth.middleware');
const {
    createOrderSchema,
    updateOrderStatusSchema,
    orderFiltersSchema,
    orderStatisticsSchema
} = require('../validators/order.validator');

// Rutas para clientes
router.post('/',
    authenticate,
    authorize('customer'),
    validate(createOrderSchema),
    orderController.createOrder
);

router.get('/',
    authenticate,
    authorize('customer', 'provider', 'admin'),
    validate(orderFiltersSchema, 'query'),
    orderController.getOrders
);

router.get('/active',
    authenticate,
    authorize('customer', 'provider'),
    validate(orderFiltersSchema, 'query'),
    orderController.getActiveOrders
);

router.get('/:id',
    authenticate,
    authorize('customer', 'provider', 'admin'),
    orderController.getOrder
);

router.put('/:id/status',
    authenticate,
    authorize('customer', 'provider', 'admin'),
    validate(updateOrderStatusSchema),
    orderController.updateOrderStatus
);

router.post('/:id/cancel',
    authenticate,
    authorize('customer', 'provider', 'admin'),
    orderController.cancelOrder
);

// Rutas específicas para proveedores
router.post('/:id/accept',
    authenticate,
    authorize('provider'),
    orderController.acceptOrder
);

router.post('/:id/reject',
    authenticate,
    authorize('provider'),
    orderController.rejectOrder
);

// Estadísticas (admin y proveedores)
router.get('/statistics/orders',
    authenticate,
    authorize('provider', 'admin'),
    validate(orderStatisticsSchema, 'query'),
    orderController.getOrderStatistics
);

module.exports = router;
