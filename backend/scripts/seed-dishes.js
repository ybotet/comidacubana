const { sequelize } = require('../src/shared/database/config');
const Category = require('../src/modules/dishes/models/Category');
const Ingredient = require('../src/modules/dishes/models/Ingredient');
const Dish = require('../src/modules/dishes/models/Dish');
const DishIngredient = require('../src/modules/dishes/models/DishIngredient');
const logger = require('../src/shared/logging/logger');

async function seedSimple() {
    try {
        logger.info('Iniciando seed simplificado...');

        // Sincronizar modelos (sin forzar)
        await sequelize.sync();
        logger.info('✅ Modelos sincronizados');

        // 1. Crear categorías simples
        logger.info('Creando categorías...');
        const categories = await Category.bulkCreate([
            {
                name_es: 'Entrantes',
                name_ru: 'Закуски',
                icon: '🥗',
                color: '#4CAF50',
                order: 1
            },
            {
                name_es: 'Platos Principales',
                name_ru: 'Основные блюда',
                icon: '🍖',
                color: '#F44336',
                order: 2
            },
            {
                name_es: 'Postres',
                name_ru: 'Десерты',
                icon: '🍰',
                color: '#FF9800',
                order: 3
            },
            {
                name_es: 'Bebidas',
                name_ru: 'Напитки',
                icon: '🥤',
                color: '#2196F3',
                order: 4
            }
        ], { ignoreDuplicates: true });

        logger.info(`✅ ${categories.length} categorías creadas/actualizadas`);

        // 2. Crear ingredientes simples
        logger.info('Creando ingredientes...');
        const ingredients = await Ingredient.bulkCreate([
            // Proteínas
            {
                name_es: 'Pollo',
                name_ru: 'Курица',
                price_extra: 2.50,
                category: 'protein'
            },
            {
                name_es: 'Carne de Res',
                name_ru: 'Говядина',
                price_extra: 3.50,
                category: 'protein'
            },
            {
                name_es: 'Tofu',
                name_ru: 'Тофу',
                price_extra: 2.00,
                category: 'protein'
            },
            // Vegetales
            {
                name_es: 'Lechuga',
                name_ru: 'Салат',
                price_extra: 0.50,
                category: 'vegetable'
            },
            {
                name_es: 'Tomate',
                name_ru: 'Помидор',
                price_extra: 0.75,
                category: 'vegetable'
            },
            {
                name_es: 'Cebolla',
                name_ru: 'Лук',
                price_extra: 0.50,
                category: 'vegetable'
            },
            // Quesos
            {
                name_es: 'Queso Cheddar',
                name_ru: 'Сыр Чеддер',
                price_extra: 1.75,
                category: 'cheese'
            },
            {
                name_es: 'Queso Mozzarella',
                name_ru: 'Сыр Моцарелла',
                price_extra: 1.50,
                category: 'cheese'
            }
        ], { ignoreDuplicates: true });

        logger.info(`✅ ${ingredients.length} ingredientes creados/actualizados`);

        // 3. Crear platos simples
        logger.info('Creando platos...');
        const dishes = await Dish.bulkCreate([
            {
                name_es: 'Ensalada César',
                name_ru: 'Салат Цезарь',
                description_es: 'Ensalada fresca con pollo, lechuga y aderezo césar',
                description_ru: 'Свежий салат с курицей, салатом и соусом цезарь',
                base_price: 8.99,
                category_id: categories[0].id,
                preparation_time: 10,
                is_featured: true,
                tags: ['ensalada', 'fresco', 'pollo']
            },
            {
                name_es: 'Hamburguesa Clásica',
                name_ru: 'Классический бургер',
                description_es: 'Hamburguesa de res con queso, lechuga y tomate',
                description_ru: 'Говяжья котлета с сыром, салатом и помидорами',
                base_price: 12.50,
                category_id: categories[1].id,
                preparation_time: 15,
                is_featured: true,
                tags: ['hamburguesa', 'carne', 'queso']
            },
            {
                name_es: 'Pizza Margarita',
                name_ru: 'Пицца Маргарита',
                description_es: 'Pizza clásica con salsa de tomate y mozzarella',
                description_ru: 'Классическая пицца с томатным соусом и моцареллой',
                base_price: 10.99,
                category_id: categories[1].id,
                preparation_time: 20,
                tags: ['pizza', 'italiana', 'queso']
            }
        ], { ignoreDuplicates: true });

        logger.info(`✅ ${dishes.length} platos creados/actualizados`);

        // 4. Crear relaciones plato-ingrediente
        logger.info('Creando relaciones plato-ingrediente...');

        // Ensalada César
        await DishIngredient.bulkCreate([
            { dish_id: dishes[0].id, ingredient_id: ingredients[0].id, quantity: 1, is_removable: false }, // Pollo
            { dish_id: dishes[0].id, ingredient_id: ingredients[3].id, quantity: 1, is_removable: true }, // Lechuga
            { dish_id: dishes[0].id, ingredient_id: ingredients[6].id, quantity: 1, is_removable: true } // Queso Cheddar
        ], { ignoreDuplicates: true });

        // Hamburguesa Clásica
        await DishIngredient.bulkCreate([
            { dish_id: dishes[1].id, ingredient_id: ingredients[1].id, quantity: 1, is_removable: false }, // Carne
            { dish_id: dishes[1].id, ingredient_id: ingredients[6].id, quantity: 1, is_removable: true }, // Queso Cheddar
            { dish_id: dishes[1].id, ingredient_id: ingredients[3].id, quantity: 1, is_removable: true }, // Lechuga
            { dish_id: dishes[1].id, ingredient_id: ingredients[4].id, quantity: 2, is_removable: true } // Tomate
        ], { ignoreDuplicates: true });

        // Pizza Margarita
        await DishIngredient.bulkCreate([
            { dish_id: dishes[2].id, ingredient_id: ingredients[7].id, quantity: 2, is_removable: false }, // Mozzarella
            { dish_id: dishes[2].id, ingredient_id: ingredients[4].id, quantity: 3, is_removable: true } // Tomate
        ], { ignoreDuplicates: true });

        logger.info('✅ Relaciones creadas exitosamente');

        // 5. Mostrar resumen
        logger.info('\n📊 RESUMEN DEL SEED:');
        logger.info(`🍽️  Categorías: ${categories.length}`);
        logger.info(`🥗 Ingredientes: ${ingredients.length}`);
        logger.info(`🍔 Platos: ${dishes.length}`);

        // Mostrar IDs para pruebas
        logger.info('\n🔍 IDs para pruebas:');
        logger.info(`Categoría "Platos Principales": ${categories[1].id}`);
        logger.info(`Ingrediente "Pollo": ${ingredients[0].id}`);
        logger.info(`Plato "Hamburguesa Clásica": ${dishes[1].id}`);

        logger.info('\n✅ Seed completado exitosamente!');

    } catch (error) {
        logger.error('❌ Error en seed:', error);
        console.error('Stack:', error.stack);
    } finally {
        await sequelize.close();
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    seedSimple();
}

module.exports = seedSimple;
