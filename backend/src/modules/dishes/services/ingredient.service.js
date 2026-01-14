const Ingredient = require('../models/Ingredient');
const logger = require('../../../shared/logging/logger');

class IngredientService {
  constructor() {
    this.Ingredient = Ingredient;
  }

  async getAllIngredients(lang = 'es', filters = {}) {
    try {
      const whereCondition = {};
      
      // Aplicar filtros
      if (filters.category) {
        whereCondition.category = filters.category;
      }
      
      if (filters.is_available !== undefined) {
        whereCondition.is_available = filters.is_available;
      } else {
        whereCondition.is_available = true; // Por defecto solo disponibles
      }
      
      if (filters.search) {
        whereCondition[this.Ingredient.sequelize.Op.or] = [
          { name_es: { [this.Ingredient.sequelize.Op.iLike]: `%${filters.search}%` } },
          { name_ru: { [this.Ingredient.sequelize.Op.iLike]: `%${filters.search}%` } }
        ];
      }

      const ingredients = await this.Ingredient.findAll({
        where: whereCondition,
        order: [['category', 'ASC'], ['name_es', 'ASC']]
      });

      return ingredients.map(ingredient => ingredient.getPublicData(lang));
    } catch (error) {
      logger.error('Error obteniendo ingredientes:', error);
      throw error;
    }
  }

  async getIngredientById(id, lang = 'es') {
    try {
      const ingredient = await this.Ingredient.findByPk(id);
      
      if (!ingredient) {
        throw new Error('Ingrediente no encontrado');
      }

      return ingredient.getPublicData(lang);
    } catch (error) {
      logger.error('Error obteniendo ingrediente por ID:', error);
      throw error;
    }
  }

  async createIngredient(ingredientData) {
    try {
      // Validar que no exista ingrediente con mismo nombre
      const existingIngredient = await this.Ingredient.findOne({
        where: {
          name_es: ingredientData.name_es
        }
      });

      if (existingIngredient) {
        throw new Error('Ya existe un ingrediente con este nombre en español');
      }

      const ingredient = await this.Ingredient.create(ingredientData);
      logger.info(`Ingrediente creado: ${ingredient.name_es}`);

      return ingredient;
    } catch (error) {
      logger.error('Error creando ingrediente:', error);
      throw error;
    }
  }

  async updateIngredient(id, updateData) {
    try {
      const ingredient = await this.Ingredient.findByPk(id);
      
      if (!ingredient) {
        throw new Error('Ingrediente no encontrado');
      }

      // Validar unicidad si se cambia el nombre
      if (updateData.name_es && updateData.name_es !== ingredient.name_es) {
        const existingIngredient = await this.Ingredient.findOne({
          where: {
            name_es: updateData.name_es,
            id: { [this.Ingredient.sequelize.Op.ne]: id }
          }
        });

        if (existingIngredient) {
          throw new Error('Ya existe otro ingrediente con este nombre en español');
        }
      }

      await ingredient.update(updateData);
      logger.info(`Ingrediente actualizado: ${ingredient.name_es}`);

      return ingredient;
    } catch (error) {
      logger.error('Error actualizando ingrediente:', error);
      throw error;
    }
  }

  async deleteIngredient(id) {
    try {
      const ingredient = await this.Ingredient.findByPk(id);
      
      if (!ingredient) {
        throw new Error('Ingrediente no encontrado');
      }

      // Verificar si está en uso en algún plato
      const dishCount = await ingredient.countDishes();
      if (dishCount > 0) {
        throw new Error(`No se puede eliminar el ingrediente porque está en ${dishCount} plato(s)`);
      }

      await ingredient.destroy();
      logger.info(`Ingrediente eliminado: ${ingredient.name_es}`);

      return { success: true, message: 'Ingrediente eliminado correctamente' };
    } catch (error) {
      logger.error('Error eliminando ingrediente:', error);
      throw error;
    }
  }

  async toggleIngredientAvailability(id) {
    try {
      const ingredient = await this.Ingredient.findByPk(id);
      
      if (!ingredient) {
        throw new Error('Ingrediente no encontrado');
      }

      await ingredient.update({ is_available: !ingredient.is_available });
      const status = ingredient.is_available ? 'disponible' : 'no disponible';
      
      logger.info(`Ingrediente marcado como ${status}: ${ingredient.name_es}`);

      return {
        success: true,
        message: `Ingrediente marcado como ${status}`,
        is_available: ingredient.is_available
      };
    } catch (error) {
      logger.error('Error cambiando disponibilidad de ingrediente:', error);
      throw error;
    }
  }

  async getIngredientsByCategory(category, lang = 'es') {
    try {
      const ingredients = await this.Ingredient.findAll({
        where: {
          category: category,
          is_available: true
        },
        order: [['name_es', 'ASC']]
      });

      return ingredients.map(ingredient => ingredient.getPublicData(lang));
    } catch (error) {
      logger.error('Error obteniendo ingredientes por categoría:', error);
      throw error;
    }
  }

  async searchIngredients(query, lang = 'es') {
    try {
      const ingredients = await this.Ingredient.findAll({
        where: {
          [this.Ingredient.sequelize.Op.or]: [
            { name_es: { [this.Ingredient.sequelize.Op.iLike]: `%${query}%` } },
            { name_ru: { [this.Ingredient.sequelize.Op.iLike]: `%${query}%` } },
            { description_es: { [this.Ingredient.sequelize.Op.iLike]: `%${query}%` } },
            { description_ru: { [this.Ingredient.sequelize.Op.iLike]: `%${query}%` } }
          ],
          is_available: true
        },
        limit: 20
      });

      return ingredients.map(ingredient => ingredient.getPublicData(lang));
    } catch (error) {
      logger.error('Error buscando ingredientes:', error);
      throw error;
    }
  }
}

module.exports = new IngredientService();
