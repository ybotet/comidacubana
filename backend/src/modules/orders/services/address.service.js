const Address = require('../models/Address');
const logger = require('../../../shared/logging/logger');

class AddressService {
    constructor() {
        this.Address = Address;
        this.logger = logger;
    }

    async getUserAddresses(userId) {
        try {
            const addresses = await this.Address.findAll({
                where: { user_id: userId },
                order: [
                    ['is_default', 'DESC'],
                    ['created_at', 'DESC']
                ]
            });

            return addresses.map(address => this.formatAddress(address));
        } catch (error) {
            this.logger.error('Error obteniendo direcciones:', error);
            throw error;
        }
    }

    async getAddressById(addressId, userId) {
        try {
            const address = await this.Address.findOne({
                where: {
                    id: addressId,
                    user_id: userId
                }
            });

            if (!address) {
                throw new Error('Dirección no encontrada');
            }

            return this.formatAddress(address);
        } catch (error) {
            this.logger.error('Error obteniendo dirección:', error);
            throw error;
        }
    }

    async createAddress(userId, addressData) {
        try {
            // Si se marca como default, asegurarse de que sea la única
            if (addressData.is_default) {
                await this.Address.update(
                    { is_default: false },
                    { where: { user_id: userId } }
                );
            }

            const address = await this.Address.create({
                user_id: userId,
                ...addressData
            });

            this.logger.info(`Dirección creada para usuario ${userId}: ${address.alias}`);

            return this.formatAddress(address);
        } catch (error) {
            this.logger.error('Error creando dirección:', error);
            throw error;
        }
    }

    async updateAddress(addressId, userId, updateData) {
        try {
            const address = await this.Address.findOne({
                where: {
                    id: addressId,
                    user_id: userId
                }
            });

            if (!address) {
                throw new Error('Dirección no encontrada');
            }

            // Si se cambia a default, actualizar las otras
            if (updateData.is_default && !address.is_default) {
                await this.Address.update(
                    { is_default: false },
                    { where: { user_id: userId } }
                );
            }

            await address.update(updateData);

            this.logger.info(`Dirección actualizada: ${address.alias}`);

            return this.formatAddress(address);
        } catch (error) {
            this.logger.error('Error actualizando dirección:', error);
            throw error;
        }
    }

    async deleteAddress(addressId, userId) {
        try {
            const address = await this.Address.findOne({
                where: {
                    id: addressId,
                    user_id: userId
                }
            });

            if (!address) {
                throw new Error('Dirección no encontrada');
            }

            // No permitir eliminar si es la única dirección
            const addressCount = await this.Address.count({
                where: { user_id: userId }
            });

            if (addressCount <= 1) {
                throw new Error('No puedes eliminar tu única dirección');
            }

            await address.destroy();

            this.logger.info(`Dirección eliminada: ${address.alias}`);

            return { success: true, message: 'Dirección eliminada correctamente' };
        } catch (error) {
            this.logger.error('Error eliminando dirección:', error);
            throw error;
        }
    }

    async setDefaultAddress(addressId, userId) {
        try {
            const address = await this.Address.findOne({
                where: {
                    id: addressId,
                    user_id: userId
                }
            });

            if (!address) {
                throw new Error('Dirección no encontrada');
            }

            // Marcar todas las otras como no default
            await this.Address.update(
                { is_default: false },
                { where: { user_id: userId } }
            );

            // Marcar esta como default
            await address.update({ is_default: true });

            this.logger.info(`Dirección marcada como default: ${address.alias}`);

            return this.formatAddress(address);
        } catch (error) {
            this.logger.error('Error estableciendo dirección por defecto:', error);
            throw error;
        }
    }

    formatAddress(address) {
        return {
            id: address.id,
            alias: address.alias,
            street: address.street,
            number: address.number,
            apartment: address.apartment,
            neighborhood: address.neighborhood,
            city: address.city,
            state: address.state,
            postal_code: address.postal_code,
            country: address.country,
            instructions: address.instructions,
            is_default: address.is_default,
            latitude: address.latitude,
            longitude: address.longitude,
            formatted_address: address.getFormattedAddress(),
            created_at: address.created_at,
            updated_at: address.updated_at
        };
    }

    async validateAddress(addressData) {
        const errors = [];

        if (!addressData.street || addressData.street.trim().length < 3) {
            errors.push('La calle debe tener al menos 3 caracteres');
        }

        if (!addressData.number || addressData.number.trim().length === 0) {
            errors.push('El número es requerido');
        }

        if (!addressData.city || addressData.city.trim().length < 2) {
            errors.push('La ciudad es requerida');
        }

        if (!addressData.postal_code || !/^\d{4,5}$/.test(addressData.postal_code)) {
            errors.push('Código postal inválido');
        }

        if (!addressData.country || addressData.country.trim().length < 2) {
            errors.push('El país es requerido');
        }

        if (errors.length > 0) {
            throw new Error(`Validación fallida: ${errors.join(', ')}`);
        }

        return true;
    }
}

module.exports = new AddressService();
