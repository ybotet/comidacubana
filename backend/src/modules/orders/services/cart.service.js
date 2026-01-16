const Cart = require('../models/Cart');
const Dish = require('../../dishes/models/Dish');
const Ingredient = require('../../dishes/models/Ingredient');
const logger = require('../../../shared/logging/logger');
const { Op } = require('sequelize');

class CartService {
    constructor() {
        this.Cart = Cart;
        this.Dish = Dish;
        this.Ingredient = Ingredient;
        this.logger = logger;
        this.Op = Op;
    }

    async getCart(userId, sessionId = null) {
        try {
            let cart;

            if (userId) {
                // Buscar carrito por usuario
                cart = await this.Cart.findOne({
                    where: { user_id: userId },
                    include: [{
                        model: require('../../auth/models/User'),
                        as: 'cartUser',
                        attributes: ['id', 'email', 'first_name', 'last_name']
                    }]
                });
            } else if (sessionId) {
                // Buscar carrito por sesión (usuarios no autenticados)
                cart = await this.Cart.findOne({
                    where: { session_id: sessionId }
                });
            }

            // Si no existe, crear uno nuevo
            if (!cart) {
                cart = await this.createCart(userId, sessionId);
            }

            // Calcular total si no está calculado
            if (cart.total_amount === 0 && cart.items && cart.items.length > 0) {
                await cart.calculateTotal();
                await cart.save();
            }

            return cart;
        } catch (error) {
            this.logger.error('Error obteniendo carrito:', error);
            throw error;
        }
    }

    async createCart(userId, sessionId = null) {
        try {
            const cartData = {
                items: [],
                total_amount: 0,
                expires_at: userId ? null : new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas para invitados
            };

            if (userId) cartData.user_id = userId;
            if (sessionId) cartData.session_id = sessionId;

            const cart = await this.Cart.create(cartData);
            this.logger.info(`Carrito creado: ${cart.id}`);

            return cart;
        } catch (error) {
            this.logger.error('Error creando carrito:', error);
            throw error;
        }
    }

    async addToCart(cartId, item) {
        try {
            const cart = await this.Cart.findByPk(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            // Validar el item
            await this.validateCartItem(item);

            // Agregar al carrito
            await cart.addItem(item);
            await cart.save();

            this.logger.info(`Item agregado al carrito ${cartId}: ${item.dish_id || 'custom dish'}`);

            return cart;
        } catch (error) {
            this.logger.error('Error agregando al carrito:', error);
            throw error;
        }
    }

    async validateCartItem(item) {
        // Validar estructura básica
        if (!item.dish_id && !item.custom_dish) {
            throw new Error('El item debe tener dish_id o custom_dish');
        }

        if (!item.quantity || item.quantity < 1) {
            throw new Error('Cantidad inválida');
        }

        // Validar plato si es estándar
        if (item.dish_id) {
            const dish = await this.Dish.findByPk(item.dish_id);

            if (!dish) {
                throw new Error('Plato no encontrado');
            }

            if (!dish.is_active) {
                throw new Error('Este plato no está disponible');
            }

            // Validar personalizaciones si existen
            if (item.customization) {
                if (item.customization.add && Array.isArray(item.customization.add)) {
                    for (const ingredientId of item.customization.add) {
                        const ingredient = await this.Ingredient.findByPk(ingredientId);
                        if (!ingredient || !ingredient.is_available) {
                            throw new Error(`Ingrediente ${ingredientId} no disponible`);
                        }
                    }
                }

                if (item.customization.extra && Array.isArray(item.customization.extra)) {
                    for (const extra of item.customization.extra) {
                        if (!extra.id || !extra.quantity || extra.quantity < 1) {
                            throw new Error('Datos de extra inválidos');
                        }

                        const ingredient = await this.Ingredient.findByPk(extra.id);
                        if (!ingredient || !ingredient.is_available) {
                            throw new Error(`Ingrediente ${extra.id} no disponible`);
                        }
                    }
                }
            }
        }

        // Validar plato personalizado
        if (item.custom_dish) {
            if (!item.custom_dish.total_price || item.custom_dish.total_price < 0) {
                throw new Error('Precio de plato personalizado inválido');
            }
        }

        return true;
    }

    async removeFromCart(cartId, itemIndex) {
        try {
            const cart = await this.Cart.findByPk(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            if (!cart.items || !cart.items[itemIndex]) {
                throw new Error('Item no encontrado en el carrito');
            }

            await cart.removeItem(itemIndex);
            await cart.save();

            this.logger.info(`Item removido del carrito ${cartId}: índice ${itemIndex}`);

            return cart;
        } catch (error) {
            this.logger.error('Error removiendo del carrito:', error);
            throw error;
        }
    }

    async updateItemQuantity(cartId, itemIndex, quantity) {
        try {
            const cart = await this.Cart.findByPk(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            if (!cart.items || !cart.items[itemIndex]) {
                throw new Error('Item no encontrado en el carrito');
            }

            if (quantity < 1) {
                throw new Error('La cantidad debe ser al menos 1');
            }

            await cart.updateItemQuantity(itemIndex, quantity);
            await cart.save();

            this.logger.info(`Cantidad actualizada en carrito ${cartId}: índice ${itemIndex} -> ${quantity}`);

            return cart;
        } catch (error) {
            this.logger.error('Error actualizando cantidad:', error);
            throw error;
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await this.Cart.findByPk(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            await cart.clear();
            await cart.save();

            this.logger.info(`Carrito ${cartId} vaciado`);

            return cart;
        } catch (error) {
            this.logger.error('Error vaciando carrito:', error);
            throw error;
        }
    }

    async mergeCarts(userCartId, sessionCartId) {
        try {
            const userCart = await this.Cart.findByPk(userCartId);
            const sessionCart = await this.Cart.findByPk(sessionCartId);

            if (!userCart || !sessionCart) {
                throw new Error('Carritos no encontrados');
            }

            // Si el carrito de sesión tiene items, agregarlos al carrito de usuario
            if (sessionCart.items && sessionCart.items.length > 0) {
                for (const item of sessionCart.items) {
                    await userCart.addItem(item);
                }

                await userCart.save();
                await sessionCart.destroy(); // Eliminar carrito de sesión

                this.logger.info(`Carritos fusionados: ${sessionCartId} -> ${userCartId}`);
            }

            return userCart;
        } catch (error) {
            this.logger.error('Error fusionando carritos:', error);
            throw error;
        }
    }

    // Fusionar carrito de sesión en carrito del usuario. Asegura que el carrito queda asociado al user_id.
    async mergeSessionToUser(sessionId, userId) {
        try {
            if (!sessionId || !userId) {
                throw new Error('sessionId y userId son requeridos para fusionar carritos');
            }

            const userCart = await this.Cart.findOne({ where: { user_id: userId } });
            const sessionCart = await this.Cart.findOne({ where: { session_id: sessionId } });

            // Si no hay carrito de sesión, nada que fusionar; si no hay carrito de usuario, asignar sesión al usuario
            if (!sessionCart) {
                if (userCart) return userCart;
                // Crear carrito vacío para el usuario
                const newCart = await this.createCart(userId, null);
                return newCart;
            }

            if (!userCart) {
                // Asociar el carrito de sesión al usuario
                sessionCart.user_id = userId;
                sessionCart.session_id = null;
                await sessionCart.save();
                return sessionCart;
            }

            // Ambos existen: mover items de sessionCart a userCart
            if (sessionCart.items && sessionCart.items.length > 0) {
                for (const item of sessionCart.items) {
                    await userCart.addItem(item);
                }

                await userCart.save();
            }

            // Eliminar carrito de sesión
            await sessionCart.destroy();

            // Asegurar que userCart.user_id está establecido
            if (!userCart.user_id) {
                userCart.user_id = userId;
                await userCart.save();
            }

            return userCart;
        } catch (error) {
            this.logger.error('Error fusionando sesión en usuario:', error);
            throw error;
        }
    }

    async getCartSummary(cartId, lang = 'es') {
        try {
            const cart = await this.Cart.findByPk(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const itemsSummary = await cart.getItemsSummary(lang);
            const itemCount = cart.getItemCount();

            return {
                cart_id: cart.id,
                user_id: cart.user_id,
                session_id: cart.session_id,
                items: itemsSummary,
                summary: {
                    item_count: itemCount,
                    unique_items: cart.items ? cart.items.length : 0,
                    total_amount: parseFloat(cart.total_amount) || 0,
                    formatted_total: `${(parseFloat(cart.total_amount) || 0).toFixed(2)}€`
                },
                expires_at: cart.expires_at,
                created_at: cart.created_at,
                updated_at: cart.updated_at
            };
        } catch (error) {
            this.logger.error('Error obteniendo resumen del carrito:', error);
            throw error;
        }
    }

    async cleanupExpiredCarts() {
        try {
            const result = await this.Cart.destroy({
                where: {
                    user_id: null,
                    expires_at: {
                        [this.Op.lt]: new Date()
                    }
                }
            });

            if (result > 0) {
                this.logger.info(`${result} carritos expirados eliminados`);
            }

            return result;
        } catch (error) {
            this.logger.error('Error limpiando carritos expirados:', error);
            throw error;
        }
    }
}

module.exports = new CartService();
