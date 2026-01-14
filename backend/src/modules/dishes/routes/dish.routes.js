const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dish.controller');
const { authenticate, authorize, validate } = require('../../auth/middleware/auth.middleware');
const {
    createDishSchema,
    updateDishSchema,
    customizeDishSchema,
    dishFiltersSchema
} = require('../validators/dish.validator');

// Rutas públicas
router.get('/', validate(dishFiltersSchema, 'query'), dishController.getAll);
router.get('/popular', dishController.getPopular);
router.get('/category/:categoryId', dishController.getByCategory);
router.get('/search/:query', dishController.search);
router.get('/:id', dishController.getById);

// Personalización de plato (público, no requiere autenticación)
router.post('/:id/customize',
    validate(customizeDishSchema),
    dishController.customize
);

// Rutas protegidas (solo admin/proveedor)
router.post('/',
    authenticate,
    authorize('admin', 'provider'),
    validate(createDishSchema),
    dishController.create
);

router.put('/:id',
    authenticate,
    authorize('admin', 'provider'),
    validate(updateDishSchema),
    dishController.update
);

router.delete('/:id',
    authenticate,
    authorize('admin', 'provider'),
    dishController.delete
);

router.patch('/:id/toggle-status',
    authenticate,
    authorize('admin', 'provider'),
    dishController.toggleStatus
);

router.patch('/:id/toggle-featured',
    authenticate,
    authorize('admin', 'provider'),
    dishController.toggleFeatured
);

module.exports = router;
