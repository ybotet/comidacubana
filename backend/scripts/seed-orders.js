const { sequelize } = require('../src/shared/database/config');
const User = require('../src/modules/auth/models/User');
const { Address, Order, OrderItem } = require('../src/modules/orders/models');
const { Dish } = require('../src/modules/dishes/models');
const logger = require('../src/shared/logging/logger');

async function seedOrders() {
    try {
        logger.info('Iniciando seed de pedidos...');

        // Primero asegurarse de que las relaciones están establecidas
        require('../src/shared/database/models');

        // Sincronizar modelos
        await sequelize.sync({ alter: true });
        logger.info('✅ Modelos sincronizados');

        // Buscar usuarios existentes
        const customer = await User.findOne({ where: { email: 'cliente@ejemplo.com' } });
        const provider = await User.findOne({ where: { email: 'proveedor@restaurante.com' } });

        if (!customer) {
            logger.warn('⚠️  Usuario cliente no encontrado. Creando uno...');
            await require('./seed-data.js')();
            // Re-buscar después de crear
            const customer = await User.findOne({ where: { email: 'cliente@ejemplo.com' } });
        }

        if (!provider) {
            logger.warn('⚠️  Usuario proveedor no encontrado. Creando uno...');
            await require('./seed-data.js')();
            // Re-buscar después de crear
            const provider = await User.findOne({ where: { email: 'proveedor@restaurante.com' } });
        }

        // Crear dirección para el cliente
        logger.info('Creando dirección de prueba...');
        const address = await Address.create({
            user_id: customer.id,
            alias: 'Casa',
            street: 'Calle Principal',
            number: '123',
            city: 'Madrid',
            postal_code: '28001',
            country: 'España',
            is_default: true
        });

        logger.info(`✅ Dirección creada: ${address.getFormattedAddress()}`);

        // Buscar platos existentes
        const dishes = await Dish.findAll({ limit: 3 });

        if (dishes.length === 0) {
            logger.warn('⚠️  No hay platos. Ejecutando seed de platos...');
            await require('./seed-dishes.js')();
            // Re-buscar después de crear
            const dishes = await Dish.findAll({ limit: 3 });
        }

        // Crear pedidos de prueba
        logger.info('Creando pedidos de prueba...');

        const orders = [
            {
                user_id: customer.id,
                provider_id: provider.id,
                status: 'delivered',
                total_amount: 25.48,
                delivery_type: 'delivery',
                address_id: address.id,
                special_instructions: 'Por favor, llamar antes de llegar',
                payment_method: 'cash',
                payment_status: 'paid',
                items_count: 2,
                estimated_delivery_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
                actual_delivery_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000) // 30 minutos después
            },
            {
                user_id: customer.id,
                provider_id: provider.id,
                status: 'preparing',
                total_amount: 18.99,
                delivery_type: 'pickup',
                special_instructions: 'Sin cebolla, por favor',
                payment_method: 'cash',
                payment_status: 'pending',
                items_count: 1,
                estimated_delivery_time: new Date(Date.now() + 45 * 60 * 1000) // 45 minutos desde ahora
            },
            {
                user_id: customer.id,
                status: 'pending',
                total_amount: 32.97,
                delivery_type: 'delivery',
                address_id: address.id,
                payment_method: 'card',
                payment_status: 'pending',
                items_count: 3
            }
        ];

        const createdOrders = [];
        for (const orderData of orders) {
            const order = await Order.create(orderData);
            createdOrders.push(order);
            logger.info(`✅ Pedido creado: ${order.order_number} (${order.status})`);

            // Crear items para el pedido
            const orderItems = [];

            if (order.order_number.includes('delivered')) {
                // Pedido entregado - 2 items
                orderItems.push(
                    {
                        order_id: order.id,
                        dish_id: dishes[0].id,
                        dish_data: {
                            id: dishes[0].id,
                            name_es: dishes[0].name_es,
                            name_ru: dishes[0].name_ru,
                            base_price: dishes[0].base_price
                        },
                        quantity: 1,
                        unit_price: dishes[0].base_price,
                        total_price: dishes[0].base_price,
                        preparation_status: 'served'
                    },
                    {
                        order_id: order.id,
                        dish_id: dishes[1].id,
                        dish_data: {
                            id: dishes[1].id,
                            name_es: dishes[1].name_es,
                            name_ru: dishes[1].name_ru,
                            base_price: dishes[1].base_price
                        },
                        quantity: 2,
                        unit_price: dishes[1].base_price,
                        total_price: dishes[1].base_price * 2,
                        preparation_status: 'served'
                    }
                );
            } else if (order.order_number.includes('preparing')) {
                // Pedido en preparación - 1 item
                orderItems.push({
                    order_id: order.id,
                    dish_id: dishes[2].id,
                    dish_data: {
                        id: dishes[2].id,
                        name_es: dishes[2].name_es,
                        name_ru: dishes[2].name_ru,
                        base_price: dishes[2].base_price
                    },
                    quantity: 1,
                    unit_price: dishes[2].base_price,
                    total_price: dishes[2].base_price,
                    customization: {
                        remove: ['ingredient_id_de_cebolla'],
                        note: 'Sin cebolla'
                    },
                    preparation_status: 'preparing'
                });
            } else {
                // Pedido pendiente - 3 items
                orderItems.push(
                    {
                        order_id: order.id,
                        dish_id: dishes[0].id,
                        dish_data: {
                            id: dishes[0].id,
                            name_es: dishes[0].name_es,
                            name_ru: dishes[0].name_ru,
                            base_price: dishes[0].base_price
                        },
                        quantity: 1,
                        unit_price: dishes[0].base_price,
                        total_price: dishes[0].base_price
                    },
                    {
                        order_id: order.id,
                        dish_id: dishes[1].id,
                        dish_data: {
                            id: dishes[1].id,
                            name_es: dishes[1].name_es,
                            name_ru: dishes[1].name_ru,
                            base_price: dishes[1].base_price
                        },
                        quantity: 1,
                        unit_price: dishes[1].base_price,
                        total_price: dishes[1].base_price
                    },
                    {
                        order_id: order.id,
                        dish_id: dishes[2].id,
                        dish_data: {
                            id: dishes[2].id,
                            name_es: dishes[2].name_es,
                            name_ru: dishes[2].name_ru,
                            base_price: dishes[2].base_price
                        },
                        quantity: 1,
                        unit_price: dishes[2].base_price,
                        total_price: dishes[2].base_price
                    }
                );
            }

            await OrderItem.bulkCreate(orderItems);
            logger.info(`✅ ${orderItems.length} items creados para pedido ${order.order_number}`);
        }

        logger.info('\n📊 RESUMEN DEL SEED DE PEDIDOS:');
        logger.info(`👤 Cliente: ${customer.email}`);
        logger.info(`🏪 Proveedor: ${provider.email}`);
        logger.info(`🏠 Direcciones: 1 creada`);
        logger.info(`📦 Pedidos: ${createdOrders.length} creados`);

        // Mostrar IDs para pruebas
        logger.info('\n🔍 IDs para pruebas:');
        logger.info(`Cliente ID: ${customer.id}`);
        logger.info(`Proveedor ID: ${provider.id}`);
        logger.info(`Dirección ID: ${address.id}`);
        createdOrders.forEach((order, index) => {
            logger.info(`Pedido ${index + 1}: ${order.order_number} (ID: ${order.id})`);
        });

        logger.info('\n✅ Seed de pedidos completado exitosamente!');

    } catch (error) {
        logger.error('❌ Error en seed de pedidos:', error);
        console.error('Stack:', error.stack);
    } finally {
        await sequelize.close();
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    seedOrders();
}

module.exports = seedOrders;
