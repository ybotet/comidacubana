const { Order, OrderItem, Cart, Address, Notification } = require('../models');
const { Dish } = require('../../dishes/models');
const User = require('../../auth/models/User');
const logger = require('../../../shared/logging/logger');
const { Op } = require('sequelize');

class OrderService {
    constructor() {
        this.Order = Order;
        this.OrderItem = OrderItem;
        this.Cart = Cart;
        this.Dish = Dish;
        this.Address = Address;
        this.Notification = Notification;
        this.User = User;
        this.logger = logger;
        this.Op = Op;
    }

    async createOrderFromCart(userId, orderData) {
        try {
            // 1. Obtener carrito del usuario
            const cart = await this.Cart.findOne({
                where: { user_id: userId }
            });

            if (!cart || !cart.items || cart.items.length === 0) {
                throw new Error('El carrito está vacío');
            }

            // 2. Validar dirección si es delivery
            let deliveryAddress = null;
            if (orderData.delivery_type === 'delivery') {
                if (orderData.address_id) {
                    const address = await this.Address.findOne({
                        where: {
                            id: orderData.address_id,
                            user_id: userId
                        }
                    });

                    if (!address) {
                        throw new Error('Dirección no encontrada o no pertenece al usuario');
                    }

                    deliveryAddress = {
                        id: address.id,
                        formatted_address: address.getFormattedAddress(),
                        instructions: address.instructions,
                        latitude: address.latitude,
                        longitude: address.longitude
                    };
                } else if (orderData.delivery_address) {
                    deliveryAddress = orderData.delivery_address;
                } else {
                    throw new Error('Se requiere dirección para delivery');
                }
            }

            // 3. Calcular total y preparar items
            const orderItems = [];
            let totalAmount = 0;
            let itemsCount = 0;

            for (const cartItem of cart.items) {
                let dishData = null;
                let customDishData = null;
                let unitPrice = 0;

                if (cartItem.dish_id) {
                    // Plato estándar
                    const dish = await this.Dish.findByPk(cartItem.dish_id, {
                        include: [{
                            model: require('../../dishes/models/Category'),
                            as: 'category'
                        }]
                    });

                    if (!dish || !dish.is_active) {
                        throw new Error(`Plato ${cartItem.dish_id} no disponible`);
                    }

                    // Tomar snapshot del plato
                    dishData = {
                        id: dish.id,
                        name_es: dish.name_es,
                        name_ru: dish.name_ru,
                        description_es: dish.description_es,
                        description_ru: dish.description_ru,
                        base_price: dish.base_price,
                        image_url: dish.image_url,
                        category: dish.category ? {
                            id: dish.category.id,
                            name_es: dish.category.name_es,
                            name_ru: dish.category.name_ru
                        } : null
                    };

                    unitPrice = parseFloat(dish.base_price);

                    // Calcular personalizaciones
                    if (cartItem.customization) {
                        let customizationPrice = 0;
                        const customizationDetails = {
                            add: [],
                            extra: []
                        };

                        if (cartItem.customization.add && Array.isArray(cartItem.customization.add)) {
                            for (const ingredientId of cartItem.customization.add) {
                                const ingredient = await require('../../dishes/models/Ingredient').findByPk(ingredientId);
                                if (ingredient && ingredient.is_available) {
                                    customizationPrice += parseFloat(ingredient.price_extra);
                                    customizationDetails.add.push({
                                        id: ingredient.id,
                                        name_es: ingredient.name_es,
                                        name_ru: ingredient.name_ru,
                                        price_extra: ingredient.price_extra
                                    });
                                }
                            }
                        }

                        if (cartItem.customization.extra && Array.isArray(cartItem.customization.extra)) {
                            for (const extra of cartItem.customization.extra) {
                                const ingredient = await require('../../dishes/models/Ingredient').findByPk(extra.id);
                                if (ingredient && ingredient.is_available) {
                                    const extraCost = parseFloat(ingredient.price_extra) * (extra.quantity || 1);
                                    customizationPrice += extraCost;
                                    customizationDetails.extra.push({
                                        id: ingredient.id,
                                        name_es: ingredient.name_es,
                                        name_ru: ingredient.name_ru,
                                        price_extra: ingredient.price_extra,
                                        quantity: extra.quantity || 1,
                                        total_extra: extraCost
                                    });
                                }
                            }
                        }

                        unitPrice += customizationPrice;
                        cartItem.customization = {
                            ...cartItem.customization,
                            details: customizationDetails,
                            customization_price: customizationPrice
                        };
                    }
                } else if (cartItem.custom_dish) {
                    // Plato personalizado
                    customDishData = cartItem.custom_dish;
                    unitPrice = parseFloat(cartItem.custom_dish.total_price) || 0;
                }

                const quantity = cartItem.quantity || 1;
                const itemTotal = unitPrice * quantity;

                orderItems.push({
                    dish_id: cartItem.dish_id || null,
                    dish_data: dishData,
                    custom_dish_data: customDishData,
                    quantity: quantity,
                    unit_price: unitPrice,
                    total_price: itemTotal,
                    customization: cartItem.customization,
                    notes: cartItem.notes
                });

                totalAmount += itemTotal;
                itemsCount += quantity;
            }

            // 4. Calcular tiempo estimado de preparación
            const preparationTime = await this.calculatePreparationTime(cart.items);

            // 5. Crear el pedido
            const order = await this.Order.create({
                user_id: userId,
                total_amount: totalAmount,
                delivery_type: orderData.delivery_type || 'delivery',
                address_id: orderData.address_id || null,
                delivery_address: deliveryAddress,
                scheduled_for: orderData.scheduled_for || null,
                special_instructions: orderData.special_instructions,
                payment_method: orderData.payment_method || 'cash',
                preparation_time: preparationTime,
                items_count: itemsCount,
                estimated_delivery_time: orderData.scheduled_for ||
                    new Date(Date.now() + preparationTime * 60000) // minutos a milisegundos
            });

            // 6. Crear items del pedido
            for (const itemData of orderItems) {
                await this.OrderItem.create({
                    order_id: order.id,
                    ...itemData
                });
            }

            // 7. Vaciar carrito
            await cart.clear();
            await cart.save();

            // 8. Notificar a proveedores disponibles (no bloquear creación por errores de notificación)
            try {
                await this.notifyProviders(order.id);
            } catch (notifErr) {
                this.logger.error('Error notificando a proveedores (no bloqueante):', notifErr);
            }

            // 9. Notificar al cliente (sanitize payload and don't block order creation)
            try {
                const safeOrderNumber = order.order_number ? String(order.order_number) : null;
                await this.Notification.createOrderNotification(
                    userId,
                    order.id,
                    'order_created',
                    { order_number: safeOrderNumber }
                );
            } catch (notifErr) {
                this.logger.error('Error creando notificación para cliente (no bloqueante). Payload:', {
                    userId,
                    orderId: order.id,
                    order_number: order.order_number,
                    err: notifErr && notifErr.message
                });
            }

            this.logger.info(`Pedido creado: ${order.order_number} por usuario ${userId}`);

            return order;
        } catch (error) {
            this.logger.error('Error creando pedido:', error);
            throw error;
        }
    }

    async calculatePreparationTime(cartItems) {
        let maxTime = 15; // Tiempo mínimo

        for (const item of cartItems) {
            if (item.dish_id) {
                const dish = await this.Dish.findByPk(item.dish_id);
                if (dish && dish.preparation_time > maxTime) {
                    maxTime = dish.preparation_time;
                }
            }
        }

        // Añadir tiempo por cantidad de items
        const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
        if (itemCount > 3) {
            maxTime += Math.floor(itemCount / 3) * 5; // 5 minutos extra por cada 3 items adicionales
        }

        return maxTime;
    }

    async notifyProviders(orderId) {
        try {
            const order = await this.Order.findByPk(orderId, {
                include: [{
                    model: this.User,
                    as: 'customer',
                    attributes: ['id', 'first_name', 'last_name']
                }]
            });

            if (!order) {
                throw new Error('Pedido no encontrado');
            }

            // Buscar proveedores activos
            const providers = await this.User.findAll({
                where: {
                    role: 'provider',
                    is_active: true
                },
                attributes: ['id', 'email', 'first_name', 'last_name']
            });

            // Crear notificaciones para cada proveedor
            for (const provider of providers) {
                console.log(`Notificando al proveedor ${provider.id} sobre el pedido ${order.order_number}`);
                console.log(`Detalles del pedido: Total - ${order.total_amount}, Cliente - ${order.customer.first_name} ${order.customer.last_name}`);
                console.log(`Datos de notificacion : {
                    order_id: ${order.id},
                    order_number: ${order.order_number},
                    customer_name: ${order.customer.first_name} ${order.customer.last_name},  
                    total_amount: ${order.total_amount},
                    items_count: ${order.items_count}
                }
                `);
                await this.Notification.create({
                    user_id: provider.id,
                    type: 1,
                    title: 'Nuevo pedido disponible',
                    message: `Tienes un nuevo pedido #${order.order_number} pendiente de aceptación`,
                    data: {
                        order_id: order.id,
                        order_number: order.order_number,
                        customer_name: `${order.customer.first_name} ${order.customer.last_name}`,
                        total_amount: order.total_amount,
                        items_count: order.items_count
                    },
                    priority: 'high'
                });

                // Aquí se integraría con Socket.io para notificaciones en tiempo real
                this.logger.info(`Notificación enviada a proveedor ${provider.id} para pedido ${order.order_number}`);
            }

            return providers.length;
        } catch (error) {
            this.logger.error('Error notificando a proveedores:', error);
            throw error;
        }
    }

    async getOrderById(orderId, userId = null, role = 'customer') {
        try {
            const whereCondition = { id: orderId };

            // Si es cliente, solo puede ver sus propios pedidos
            if (role === 'customer' && userId) {
                whereCondition.user_id = userId;
            }
            // Si es proveedor, solo puede ver pedidos asignados a él
            else if (role === 'provider' && userId) {
                whereCondition.provider_id = userId;
            }

            const order = await this.Order.findOne({
                where: whereCondition,
                include: [
                    {
                        model: this.User,
                        as: 'customer',
                        attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
                    },
                    {
                        model: this.User,
                        as: 'provider',
                        attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
                    },
                    {
                        model: this.Address,
                        as: 'address',
                        attributes: { exclude: ['user_id', 'created_at', 'updated_at'] }
                    },
                    {
                        model: this.OrderItem,
                        as: 'items',
                        include: [{
                            model: this.Dish,
                            as: 'dish',
                            attributes: ['id', 'name_es', 'name_ru', 'image_url']
                        }]
                    }
                ]
            });

            if (!order) {
                throw new Error('Pedido no encontrado');
            }

            return order;
        } catch (error) {
            this.logger.error('Error obteniendo pedido:', error);
            throw error;
        }
    }

    async getOrders(filters = {}) {
        try {
            const whereCondition = {};
            const include = [];

            // Aplicar filtros
            if (filters.user_id) {
                whereCondition.user_id = filters.user_id;
            }

            if (filters.provider_id) {
                whereCondition.provider_id = filters.provider_id;
            }

            if (filters.status) {
                whereCondition.status = filters.status;
            }

            if (filters.delivery_type) {
                whereCondition.delivery_type = filters.delivery_type;
            }

            if (filters.start_date && filters.end_date) {
                whereCondition.created_at = {
                    [this.Op.between]: [new Date(filters.start_date), new Date(filters.end_date)]
                };
            } else if (filters.start_date) {
                whereCondition.created_at = {
                    [this.Op.gte]: new Date(filters.start_date)
                };
            } else if (filters.end_date) {
                whereCondition.created_at = {
                    [this.Op.lte]: new Date(filters.end_date)
                };
            }

            // Incluir relaciones básicas
            include.push({
                model: this.User,
                as: 'customer',
                attributes: ['id', 'first_name', 'last_name', 'email']
            });

            if (filters.include_provider) {
                include.push({
                    model: this.User,
                    as: 'provider',
                    attributes: ['id', 'first_name', 'last_name', 'email']
                });
            }

            if (filters.include_items) {
                include.push({
                    model: this.OrderItem,
                    as: 'items',
                    attributes: ['id', 'quantity', 'unit_price', 'total_price']
                });
            }

            // Ordenamiento
            const order = [['created_at', filters.sort_order || 'DESC']];

            // Paginación
            const limit = filters.limit ? parseInt(filters.limit) : 50;
            const offset = filters.offset ? parseInt(filters.offset) : 0;

            const orders = await this.Order.findAll({
                where: whereCondition,
                include: include,
                order: order,
                limit: limit,
                offset: offset
            });

            const total = await this.Order.count({ where: whereCondition });

            return {
                orders,
                meta: {
                    total,
                    limit,
                    offset,
                    has_more: offset + orders.length < total
                }
            };
        } catch (error) {
            this.logger.error('Error obteniendo pedidos:', error);
            throw error;
        }
    }

    async updateOrderStatus(orderId, newStatus, userId, role, reason = null) {
        try {
            const order = await this.Order.findByPk(orderId);

            if (!order) {
                throw new Error('Pedido no encontrado');
            }

            // Validar permisos y transiciones de estado
            await this.validateStatusTransition(order, newStatus, userId, role);

            // Actualizar estado
            const note = reason ? `Cambio de estado: ${reason}` : null;
            await order.updateStatus(newStatus, note);

            // Si se rechaza o cancela, agregar razón
            if (newStatus === 'rejected' && reason) {
                await order.update({ rejection_reason: reason });
            } else if (newStatus === 'cancelled' && reason) {
                await order.update({ cancellation_reason: reason });
            }

            // Si se acepta, asignar al proveedor
            if (newStatus === 'accepted' && role === 'provider') {
                await order.update({ provider_id: userId });
            }

            // Notificar al cliente
            await this.Notification.createOrderNotification(
                order.user_id,
                order.id,
                `order_${newStatus}`,
                {
                    order_number: order.order_number,
                    provider_id: userId,
                    reason: reason
                }
            );

            this.logger.info(`Estado de pedido ${order.order_number} actualizado: ${order.status} -> ${newStatus}`);

            return order;
        } catch (error) {
            this.logger.error('Error actualizando estado del pedido:', error);
            throw error;
        }
    }

    async validateStatusTransition(order, newStatus, userId, role) {
        const validTransitions = {
            customer: {
                pending: ['cancelled'],
                accepted: ['cancelled'],
                preparing: ['cancelled'],
                ready: [], // Cliente no puede cambiar estado
                on_delivery: [], // Cliente no puede cambiar estado
                delivered: [], // Cliente no puede cambiar estado
                cancelled: [],
                rejected: []
            },
            provider: {
                pending: ['accepted', 'rejected'],
                accepted: ['preparing'],
                preparing: ['ready'],
                ready: ['on_delivery'],
                on_delivery: ['delivered'],
                delivered: [],
                cancelled: [],
                rejected: []
            },
            admin: {
                pending: ['accepted', 'rejected', 'cancelled'],
                accepted: ['preparing', 'cancelled'],
                preparing: ['ready', 'cancelled'],
                ready: ['on_delivery', 'cancelled'],
                on_delivery: ['delivered', 'cancelled'],
                delivered: ['cancelled'],
                cancelled: [],
                rejected: []
            }
        };

        const allowedTransitions = validTransitions[role]?.[order.status] || [];

        if (!allowedTransitions.includes(newStatus)) {
            throw new Error(`Transición de estado no permitida: ${order.status} -> ${newStatus} para rol ${role}`);
        }

        // Validaciones específicas
        if (newStatus === 'cancelled' && !order.canBeCancelled()) {
            throw new Error('El pedido no puede ser cancelado en su estado actual');
        }

        if (newStatus === 'accepted' && !order.canBeAccepted()) {
            throw new Error('El pedido no puede ser aceptado');
        }

        if (newStatus === 'rejected' && !order.canBeRejected()) {
            throw new Error('El pedido no puede ser rechazado');
        }

        return true;
    }

    async getOrderStatistics(filters = {}) {
        try {
            const whereCondition = {};

            if (filters.start_date && filters.end_date) {
                whereCondition.created_at = {
                    [this.Op.between]: [new Date(filters.start_date), new Date(filters.end_date)]
                };
            }

            if (filters.provider_id) {
                whereCondition.provider_id = filters.provider_id;
            }

            // Estadísticas básicas
            const totalOrders = await this.Order.count({ where: whereCondition });
            const totalRevenue = await this.Order.sum('total_amount', { where: whereCondition });

            // Por estado
            const statusCounts = await this.Order.findAll({
                where: whereCondition,
                attributes: ['status', [this.Order.sequelize.fn('COUNT', this.Order.sequelize.col('id')), 'count']],
                group: ['status']
            });

            // Por día (últimos 7 días)
            const last7Days = new Date();
            last7Days.setDate(last7Days.getDate() - 7);

            const dailyStats = await this.Order.findAll({
                where: {
                    ...whereCondition,
                    created_at: { [this.Op.gte]: last7Days }
                },
                attributes: [
                    [this.Order.sequelize.fn('DATE', this.Order.sequelize.col('created_at')), 'date'],
                    [this.Order.sequelize.fn('COUNT', this.Order.sequelize.col('id')), 'order_count'],
                    [this.Order.sequelize.fn('SUM', this.Order.sequelize.col('total_amount')), 'daily_revenue']
                ],
                group: [this.Order.sequelize.fn('DATE', this.Order.sequelize.col('created_at'))],
                order: [[this.Order.sequelize.fn('DATE', this.Order.sequelize.col('created_at')), 'DESC']]
            });

            // Platos más populares
            const popularDishes = await this.OrderItem.findAll({
                attributes: [
                    'dish_id',
                    [this.OrderItem.sequelize.fn('COUNT', this.OrderItem.sequelize.col('id')), 'order_count'],
                    [this.OrderItem.sequelize.fn('SUM', this.OrderItem.sequelize.col('quantity')), 'total_quantity']
                ],
                where: {
                    dish_id: { [this.Op.not]: null }
                },
                include: [{
                    model: this.Order,
                    as: 'order',
                    where: whereCondition,
                    attributes: []
                }],
                group: ['dish_id'],
                order: [[this.OrderItem.sequelize.fn('SUM', this.OrderItem.sequelize.col('quantity')), 'DESC']],
                limit: 10
            });

            return {
                total_orders: totalOrders || 0,
                total_revenue: totalRevenue || 0,
                average_order_value: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0,
                status_distribution: statusCounts.reduce((acc, item) => {
                    acc[item.status] = parseInt(item.get('count'));
                    return acc;
                }, {}),
                daily_stats: dailyStats,
                popular_dishes: await Promise.all(popularDishes.map(async (item) => {
                    const dish = await this.Dish.findByPk(item.dish_id);
                    return {
                        dish_id: item.dish_id,
                        dish_name: dish ? dish.name_es : 'Plato no encontrado',
                        order_count: parseInt(item.get('order_count')),
                        total_quantity: parseInt(item.get('total_quantity'))
                    };
                }))
            };
        } catch (error) {
            this.logger.error('Error obteniendo estadísticas:', error);
            throw error;
        }
    }

    async cancelOrder(orderId, userId, role, reason) {
        return this.updateOrderStatus(orderId, 'cancelled', userId, role, reason);
    }

    async acceptOrder(orderId, providerId) {
        return this.updateOrderStatus(orderId, 'accepted', providerId, 'provider');
    }

    async rejectOrder(orderId, providerId, reason) {
        return this.updateOrderStatus(orderId, 'rejected', providerId, 'provider', reason);
    }
}

module.exports = new OrderService();
