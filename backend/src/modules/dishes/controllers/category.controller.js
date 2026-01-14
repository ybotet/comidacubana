const categoryService = require('../services/category.service');
const logger = require('../../../shared/logging/logger');

class CategoryController {
    async getAll(req, res, next) {
        try {
            const lang = req.query.lang || 'es';
            const includeInactive = req.query.include_inactive === 'true';

            const categories = await categoryService.getAllCategories(lang, includeInactive);

            res.json({
                success: true,
                data: categories,
                meta: {
                    count: categories.length,
                    lang: lang
                }
            });
        } catch (error) {
            logger.error('Error obteniendo categorías:', error);
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const lang = req.query.lang || 'es';

            const category = await categoryService.getCategoryById(id, lang);

            res.json({
                success: true,
                data: category
            });
        } catch (error) {
            logger.error('Error obteniendo categoría:', error);
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const category = await categoryService.createCategory(req.body);

            res.status(201).json({
                success: true,
                message: 'Categoría creada exitosamente',
                data: category
            });
        } catch (error) {
            logger.error('Error creando categoría:', error);
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const category = await categoryService.updateCategory(id, req.body);

            res.json({
                success: true,
                message: 'Categoría actualizada exitosamente',
                data: category
            });
        } catch (error) {
            logger.error('Error actualizando categoría:', error);
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await categoryService.deleteCategory(id);

            res.json(result);
        } catch (error) {
            logger.error('Error eliminando categoría:', error);
            next(error);
        }
    }

    async toggleStatus(req, res, next) {
        try {
            const { id } = req.params;
            const result = await categoryService.toggleCategoryStatus(id);

            res.json(result);
        } catch (error) {
            logger.error('Error cambiando estado de categoría:', error);
            next(error);
        }
    }
}

module.exports = new CategoryController();
