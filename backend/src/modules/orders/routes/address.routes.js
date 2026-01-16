const express = require('express');
const router = express.Router();
const addressController = require('../controllers/address.controller');
const { authenticate, validate } = require('../../auth/middleware/auth.middleware');
const { createAddressSchema, updateAddressSchema } = require('../validators/address.validator');

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/', addressController.getAddresses);
router.get('/:id', addressController.getAddress);
router.post('/', validate(createAddressSchema), addressController.createAddress);
router.put('/:id', validate(updateAddressSchema), addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);
router.patch('/:id/default', addressController.setDefaultAddress);

module.exports = router;
