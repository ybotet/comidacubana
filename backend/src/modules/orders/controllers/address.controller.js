const addressService = require('../services/address.service');
const logger = require('../../../shared/logging/logger');

class AddressController {
    async getAddresses(req, res, next) {
        try {
            const userId = req.user.id;
            const addresses = await addressService.getUserAddresses(userId);

            res.json({
                success: true,
                data: addresses
            });
        } catch (error) {
            logger.error('Error obteniendo direcciones:', error);
            next(error);
        }
    }

    async getAddress(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const address = await addressService.getAddressById(id, userId);

            res.json({
                success: true,
                data: address
            });
        } catch (error) {
            logger.error('Error obteniendo dirección:', error);
            next(error);
        }
    }

    async createAddress(req, res, next) {
        try {
            const userId = req.user.id;

            // Validar datos de dirección
            await addressService.validateAddress(req.body);

            const address = await addressService.createAddress(userId, req.body);

            res.status(201).json({
                success: true,
                message: 'Dirección creada exitosamente',
                data: address
            });
        } catch (error) {
            logger.error('Error creando dirección:', error);
            next(error);
        }
    }

    async updateAddress(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            // Validar datos de dirección si se proporcionan
            if (req.body.street || req.body.city || req.body.postal_code) {
                await addressService.validateAddress(req.body);
            }

            const address = await addressService.updateAddress(id, userId, req.body);

            res.json({
                success: true,
                message: 'Dirección actualizada exitosamente',
                data: address
            });
        } catch (error) {
            logger.error('Error actualizando dirección:', error);
            next(error);
        }
    }

    async deleteAddress(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const result = await addressService.deleteAddress(id, userId);

            res.json(result);
        } catch (error) {
            logger.error('Error eliminando dirección:', error);
            next(error);
        }
    }

    async setDefaultAddress(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const address = await addressService.setDefaultAddress(id, userId);

            res.json({
                success: true,
                message: 'Dirección establecida como predeterminada',
                data: address
            });
        } catch (error) {
            logger.error('Error estableciendo dirección por defecto:', error);
            next(error);
        }
    }
}

module.exports = new AddressController();
