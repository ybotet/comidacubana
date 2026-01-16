const { Ingredient } = require('../models');
const { Op } = require('sequelize');
const logger = require('../../../shared/logging/logger');

class IngredientService {
  constructor() {
    this.Ingredient = Ingredient;
    this.Op = Op;
    this.logger = logger;
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
        whereCondition.is_available = true;
      }

      if (filters.search) {
        whereCondition[this.Op.or] = [
          { name_es: { [this.Op.iLike]: `%${filters.search}%` } },
          { name_ru: { [this.Op.iLike]: `%${filters.search}%` } }
        ];
      }

      const ingredients = await this.Ingredient.findAll({
        where: whereCondition,
        order: [['category', 'ASC'], ['name_es', 'ASC']]
      });

      return ingredients.map(ingredient => ingredient.getPublicData(lang));
    } catch (error) {
      this.logger.error('Error obteniendo ingredientes:', error);
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
      this.logger.error('Error obteniendo ingrediente por ID:', error);
      throw error;
    }
  }

  async createIngredient(ingredientData) {
    try {
      const existingIngredient = await this.Ingredient.findOne({
        where: {
          name_es: ingredientData.name_es
        }
      });

      if (existingIngredient) {
        throw new Error('Ya existe un ingrediente con este nombre en español');
      }

      const ingredient = await this.Ingredient.create(ingredientData);
      this.logger.info(`Ingrediente creado: ${ingredient.name_es}`);

      return ingredient;
    } catch (error) {
      this.logger.error('Error creando ingrediente:', error);
      throw error;
    }
  }

  async updateIngredient(id, updateData) {
    try {
      const ingredient = await this.Ingredient.findByPk(id);

      if (!ingredient) {
        throw new Error('Ingrediente no encontrado');
      }

      if (updateData.name_es && updateData.name_es !== ingredient.name_es) {
        const existingIngredient = await this.Ingredient.findOne({
          where: {
            name_es: updateData.name_es,
            id: { [this.Op.ne]: id }
          }
        });

        if (existingIngredient) {
          throw new Error('Ya existe otro ingrediente con este nombre en español');
        }
      }

      await ingredient.update(updateData);
      this.logger.info(`Ingrediente actualizado: ${ingredient.name_es}`);

      return ingredient;
    } catch (error) {
      this.logger.error('Error actualizando ingrediente:', error);
      throw error;
    }
  }

  async deleteIngredient(id) {
    try {
      const ingredient = await this.Ingredient.findByPk(id);

      if (!ingredient) {
        throw new Error('Ingrediente no encontrado');
      }

      const dishCount = await ingredient.countDishes();
      if (dishCount > 0) {
        throw new Error(`No se puede eliminar el ingrediente porque está en ${dishCount} plato(s)`);
      }

      await ingredient.destroy();
      this.logger.info(`Ingrediente eliminado: ${ingredient.name_es}`);

      return { success: true, message: 'Ingrediente eliminado correctamente' };
    } catch (error) {
      this.logger.error('Error eliminando ingrediente:', error);
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

      this.logger.info(`Ingrediente marcado como ${status}: ${ingredient.name_es}`);

      return {
        success: true,
        message: `Ingrediente marcado como ${status}`,
        is_available: ingredient.is_available
      };
    } catch (error) {
      this.logger.error('Error cambiando disponibilidad de ingrediente:', error);
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
      this.logger.error('Error obteniendo ingredientes por categoría:', error);
      throw error;
    }
  }

  async searchIngredients(query, lang = 'es') {
    try {
      const ingredients = await this.Ingredient.findAll({
        where: {
          [this.Op.or]: [
            { name_es: { [this.Op.iLike]: `%${query}%` } },
            { name_ru: { [this.Op.iLike]: `%${query}%` } },
            { description_es: { [this.Op.iLike]: `%${query}%` } },
            { description_ru: { [this.Op.iLike]: `%${query}%` } }
          ],
          is_available: true
        },
        limit: 20
      });

      return ingredients.map(ingredient => ingredient.getPublicData(lang));
    } catch (error) {
      this.logger.error('Error buscando ingredientes:', error);
      throw error;
    }
  }
}
