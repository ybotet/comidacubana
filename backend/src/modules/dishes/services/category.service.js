const Category = require('../models/Category');
const logger = require('../../../shared/logging/logger');

class CategoryService {
  constructor() {
    this.Category = Category;
  }

  async getAllCategories(lang = 'es', includeInactive = false) {
    try {
      const whereCondition = includeInactive ? {} : { is_active: true };
      
      const categories = await this.Category.findAll({
        where: whereCondition,
        order: [['order', 'ASC'], ['name_es', 'ASC']]
      });

      return categories.map(category => ({
        id: category.id,
        name: category.getName(lang),
        description: category.getDescription(lang),
        icon: category.icon,
        color: category.color,
        order: category.order,
        is_active: category.is_active,
        created_at: category.created_at,
        updated_at: category.updated_at
      }));
    } catch (error) {
      logger.error('Error obteniendo categorías:', error);
      throw error;
    }
  }

  async getCategoryById(id, lang = 'es') {
    try {
      const category = await this.Category.findByPk(id);
      
      if (!category) {
        throw new Error('Categoría no encontrada');
      }

      return {
        id: category.id,
        name: category.getName(lang),
        description: category.getDescription(lang),
        icon: category.icon,
        color: category.color,
        order: category.order,
        is_active: category.is_active,
        created_at: category.created_at,
        updated_at: category.updated_at
      };
    } catch (error) {
      logger.error('Error obteniendo categoría por ID:', error);
      throw error;
    }
  }

  async createCategory(categoryData) {
    try {
      // Validar que no exista categoría con mismo nombre
      const existingCategory = await this.Category.findOne({
        where: {
          name_es: categoryData.name_es
        }
      });

      if (existingCategory) {
        throw new Error('Ya existe una categoría con este nombre en español');
      }

      const category = await this.Category.create(categoryData);
      logger.info(`Categoría creada: ${category.name_es}`);

      return category;
    } catch (error) {
      logger.error('Error creando categoría:', error);
      throw error;
    }
  }

  async updateCategory(id, updateData) {
    try {
      const category = await this.Category.findByPk(id);
      
      if (!category) {
        throw new Error('Categoría no encontrada');
      }

      // Validar unicidad si se cambia el nombre
      if (updateData.name_es && updateData.name_es !== category.name_es) {
        const existingCategory = await this.Category.findOne({
          where: {
            name_es: updateData.name_es,
            id: { [this.Category.sequelize.Op.ne]: id }
          }
        });

        if (existingCategory) {
          throw new Error('Ya existe otra categoría con este nombre en español');
        }
      }

      await category.update(updateData);
      logger.info(`Categoría actualizada: ${category.name_es}`);

      return category;
    } catch (error) {
      logger.error('Error actualizando categoría:', error);
      throw error;
    }
  }

  async deleteCategory(id) {
    try {
      const category = await this.Category.findByPk(id);
      
      if (!category) {
        throw new Error('Categoría no encontrada');
      }

      // Verificar si tiene platos asociados
      const dishCount = await category.countDishes();
      if (dishCount > 0) {
        throw new Error(`No se puede eliminar la categoría porque tiene ${dishCount} plato(s) asociado(s)`);
      }

      await category.destroy();
      logger.info(`Categoría eliminada: ${category.name_es}`);

      return { success: true, message: 'Categoría eliminada correctamente' };
    } catch (error) {
      logger.error('Error eliminando categoría:', error);
      throw error;
    }
  }

  async toggleCategoryStatus(id) {
    try {
      const category = await this.Category.findByPk(id);
      
      if (!category) {
        throw new Error('Categoría no encontrada');
      }

      await category.update({ is_active: !category.is_active });
      const status = category.is_active ? 'activada' : 'desactivada';
      
      logger.info(`Categoría ${status}: ${category.name_es}`);

      return {
        success: true,
        message: `Categoría ${status} correctamente`,
        is_active: category.is_active
      };
    } catch (error) {
      logger.error('Error cambiando estado de categoría:', error);
      throw error;
    }
  }
}

module.exports = new CategoryService();
