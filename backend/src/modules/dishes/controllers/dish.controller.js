const dishService = require('../services/dish.service');
const logger = require('../../../shared/logging/logger');

class DishController {
    async getAll(req, res, next) {
        try {
            const lang = req.query.lang || 'es';

            // Construir filtros desde query params
            const filters = {
                category_id: req.query.category_id,
                is_featured: req.query.is_featured,
                search: req.query.search,
                min_price: req.query.min_price,
                max_price: req.query.max_price,
                ingredient_id: req.query.ingredient_id,
                sort_by: req.query.sort_by,
                limit: req.query.limit,
                offset: req.query.offset
            };

            // Filtrar valores undefined
            Object.keys(filters).forEach(key => {
                if (filters[key] === undefined) {
                    delete filters[key];
                }
            });

            const dishes = await dishService.getAllDishes(lang, filters);

            res.json({
                success: true,
                data: dishes,
                meta: {
                    count: dishes.length,
                    lang: lang,
                    filters: filters
                }
            });
        } catch (error) {
            logger.error('Error obteniendo platos:', error);
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const lang = req.query.lang || 'es';

            const dish = await dishService.getDishById(id, lang);

            res.json({
                success: true,
                data: dish
            });
        } catch (error) {
            logger.error('Error obteniendo plato:', error);
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const userId = req.user?.id;
            const dish = await dishService.createDish(req.body, userId);

            res.status(201).json({
                success: true,
                message: 'Plato creado exitosamente',
                data: dish
            });
        } catch (error) {
            logger.error('Error creando plato:', error);
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const dish = await dishService.updateDish(id, req.body);

            res.json({
                success: true,
                message: 'Plato actualizado exitosamente',
                data: dish
            });
        } catch (error) {
            logger.error('Error actualizando plato:', error);
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await dishService.deleteDish(id);

            res.json(result);
        } catch (error) {
            logger.error('Error eliminando plato:', error);
            next(error);
        }
    }

    async toggleStatus(req, res, next) {
        try {
            const { id } = req.params;
            const result = await dishService.toggleDishStatus(id);

            res.json(result);
        } catch (error) {
            logger.error('Error cambiando estado del plato:', error);
            next(error);
        }
    }

    async toggleFeatured(req, res, next) {
        try {
            const { id } = req.params;
            const result = await dishService.toggleFeaturedStatus(id);

            res.json(result);
        } catch (error) {
            logger.error('Error cambiando estado destacado del plato:', error);
            next(error);
        }
    }

    async getPopular(req, res, next) {
        try {
            const lang = req.query.lang || 'es';
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;

            const dishes = await dishService.getPopularDishes(limit, lang);

            res.json({
                success: true,
                data: dishes,
                meta: {
                    count: dishes.length,
                    lang: lang,
                    limit: limit
                }
            });
        } catch (error) {
            logger.error('Error obteniendo platos populares:', error);
            next(error);
        }
    }

    async getByCategory(req, res, next) {
        try {
            const { categoryId } = req.params;
            const lang = req.query.lang || 'es';

            const dishes = await dishService.getDishesByCategory(categoryId, lang);

            res.json({
                success: true,
                data: dishes,
                meta: {
                    category_id: categoryId,
                    count: dishes.length,
                    lang: lang
                }
            });
        } catch (error) {
            logger.error('Error obteniendo platos por categoría:', error);
            next(error);
        }
    }

    async search(req, res, next) {
        try {
            const { query } = req.params;
            const lang = req.query.lang || 'es';
            const limit = req.query.limit ? parseInt(req.query.limit) : 20;

            const dishes = await dishService.searchDishes(query, lang, limit);

            res.json({
                success: true,
                data: dishes,
                meta: {
                    query: query,
                    count: dishes.length,
                    lang: lang,
                    limit: limit
                }
            });
        } catch (error) {
            logger.error('Error buscando platos:', error);
            next(error);
        }
    }

    async customize(req, res, next) {
        try {
            const { id } = req.params;
            const lang = req.query.lang || 'es';
            const customization = req.body;

            const result = await dishService.customizeDish(id, customization, lang);

            res.json({
                success: true,
                message: 'Plato personalizado exitosamente',
                data: result
            });
        } catch (error) {
            logger.error('Error personalizando plato:', error);
            next(error);
        }
    }
}

module.exports = new DishController();
