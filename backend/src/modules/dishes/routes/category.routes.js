const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticate, authorize, validate } = require('../../auth/middleware/auth.middleware');
const { createCategorySchema, updateCategorySchema } = require('../validators/category.validator');

// Rutas públicas
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);

// Rutas protegidas (solo admin/proveedor)
router.post('/',
    authenticate,
    authorize('admin', 'provider'),
    validate(createCategorySchema),
    categoryController.create
);

router.put('/:id',
    authenticate,
    authorize('admin', 'provider'),
    validate(updateCategorySchema),
    categoryController.update
);

router.delete('/:id',
    authenticate,
    authorize('admin'),
    categoryController.delete
);

router.patch('/:id/toggle-status',
    authenticate,
    authorize('admin', 'provider'),
    categoryController.toggleStatus
);

module.exports = router;
