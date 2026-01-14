const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredient.controller');
const { authenticate, authorize, validate } = require('../../auth/middleware/auth.middleware');
const { createIngredientSchema, updateIngredientSchema } = require('../validators/ingredient.validator');

// Rutas públicas
router.get('/', ingredientController.getAll);
router.get('/category/:category', ingredientController.getByCategory);
router.get('/search/:query', ingredientController.search);
router.get('/:id', ingredientController.getById);

// Rutas protegidas (solo admin/proveedor)
router.post('/',
    authenticate,
    authorize('admin', 'provider'),
    validate(createIngredientSchema),
    ingredientController.create
);

router.put('/:id',
    authenticate,
    authorize('admin', 'provider'),
    validate(updateIngredientSchema),
    ingredientController.update
);

router.delete('/:id',
    authenticate,
    authorize('admin'),
    ingredientController.delete
);

router.patch('/:id/toggle-availability',
    authenticate,
    authorize('admin', 'provider'),
    ingredientController.toggleAvailability
);

module.exports = router;
