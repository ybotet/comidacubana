const ingredientService = require('../services/ingredient.service');
const logger = require('../../../shared/logging/logger');

class IngredientController {
    async getAll(req, res, next) {
        try {
            const lang = req.query.lang || 'es';
            const filters = {
                category: req.query.category,
                is_available: req.query.is_available,
                search: req.query.search
            };

            // Filtrar valores undefined
            Object.keys(filters).forEach(key => {
                if (filters[key] === undefined) {
                    delete filters[key];
                }
            });

            const ingredients = await ingredientService.getAllIngredients(lang, filters);

            res.json({
                success: true,
                data: ingredients,
                meta: {
                    count: ingredients.length,
                    lang: lang,
                    filters: filters
                }
            });
        } catch (error) {
            logger.error('Error obteniendo ingredientes:', error);
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const lang = req.query.lang || 'es';

            const ingredient = await ingredientService.getIngredientById(id, lang);

            res.json({
                success: true,
                data: ingredient
            });
        } catch (error) {
            logger.error('Error obteniendo ingrediente:', error);
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const ingredient = await ingredientService.createIngredient(req.body);

            res.status(201).json({
                success: true,
                message: 'Ingrediente creado exitosamente',
                data: ingredient
            });
        } catch (error) {
            logger.error('Error creando ingrediente:', error);
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const ingredient = await ingredientService.updateIngredient(id, req.body);

            res.json({
                success: true,
                message: 'Ingrediente actualizado exitosamente',
                data: ingredient
            });
        } catch (error) {
            logger.error('Error actualizando ingrediente:', error);
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await ingredientService.deleteIngredient(id);

            res.json(result);
        } catch (error) {
            logger.error('Error eliminando ingrediente:', error);
            next(error);
        }
    }

    async toggleAvailability(req, res, next) {
        try {
            const { id } = req.params;
            const result = await ingredientService.toggleIngredientAvailability(id);

            res.json(result);
        } catch (error) {
            logger.error('Error cambiando disponibilidad de ingrediente:', error);
            next(error);
        }
    }

    async getByCategory(req, res, next) {
        try {
            const { category } = req.params;
            const lang = req.query.lang || 'es';

            const ingredients = await ingredientService.getIngredientsByCategory(category, lang);

            res.json({
                success: true,
                data: ingredients,
                meta: {
                    category: category,
                    count: ingredients.length,
                    lang: lang
                }
            });
        } catch (error) {
            logger.error('Error obteniendo ingredientes por categoría:', error);
            next(error);
        }
    }

    async search(req, res, next) {
        try {
            const { query } = req.params;
            const lang = req.query.lang || 'es';

            const ingredients = await ingredientService.searchIngredients(query, lang);

            res.json({
                success: true,
                data: ingredients,
                meta: {
                    query: query,
                    count: ingredients.length,
                    lang: lang
                }
            });
        } catch (error) {
            logger.error('Error buscando ingredientes:', error);
            next(error);
        }
    }
}

module.exports = new IngredientController();