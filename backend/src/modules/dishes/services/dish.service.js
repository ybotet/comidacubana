const { Dish, Ingredient, DishIngredient, Category } = require('../models');
const { Op } = require('sequelize');
const logger = require('../../../shared/logging/logger');

class DishService {
  constructor() {
    this.Dish = Dish;
    this.Ingredient = Ingredient;
    this.DishIngredient = DishIngredient;
    this.Category = Category;
    this.Op = Op;
    this.logger = logger;
  }

  async getAllDishes(lang = 'es', filters = {}) {
    try {
      const whereCondition = { is_active: true };

      // Aplicar filtros
      if (filters.category_id) {
        whereCondition.category_id = filters.category_id;
      }

      if (filters.is_featured !== undefined) {
        whereCondition.is_featured = filters.is_featured;
      }

      if (filters.search) {
        whereCondition[this.Op.or] = [
          { name_es: { [this.Op.iLike]: `%${filters.search}%` } },
          { name_ru: { [this.Op.iLike]: `%${filters.search}%` } },
          { description_es: { [this.Op.iLike]: `%${filters.search}%` } },
          { description_ru: { [this.Op.iLike]: `%${filters.search}%` } },
          { tags: { [this.Op.contains]: [filters.search] } }
        ];
      }

      if (filters.min_price !== undefined) {
        whereCondition.base_price = {
          [this.Op.gte]: parseFloat(filters.min_price)
        };
      }

      if (filters.max_price !== undefined) {
        whereCondition.base_price = {
          ...whereCondition.base_price,
          [this.Op.lte]: parseFloat(filters.max_price)
        };
      }

      const include = [
        {
          model: this.Category,
          as: 'category',
          required: false
        },
        {
          model: this.Ingredient,
          as: 'ingredients',
          through: { attributes: ['quantity', 'is_removable', 'is_default', 'order'] },
          where: filters.ingredient_id ? { id: filters.ingredient_id } : undefined,
          required: !!filters.ingredient_id
        }
      ];

      // Ordenamiento
      let order = [['popularity_score', 'DESC']];
      if (filters.sort_by) {
        switch (filters.sort_by) {
          case 'price_asc':
            order = [['base_price', 'ASC']];
            break;
          case 'price_desc':
            order = [['base_price', 'DESC']];
            break;
          case 'name_asc':
            order = [['name_es', 'ASC']];
            break;
          case 'preparation_time':
            order = [['preparation_time', 'ASC']];
            break;
          case 'newest':
            order = [['created_at', 'DESC']];
            break;
        }
      }

      const dishes = await this.Dish.findAll({
        where: whereCondition,
        include: include,
        order: order,
        limit: filters.limit ? parseInt(filters.limit) : 50,
        offset: filters.offset ? parseInt(filters.offset) : 0
      });

      // Procesar resultados
      const dishesWithData = await Promise.all(
        dishes.map(async dish => {
          try {
            return await dish.getPublicData(lang, true);
          } catch (error) {
            this.logger.error(`Error procesando plato ${dish.id}:`, error);
            return null;
          }
        })
      );

      // Filtrar nulos y devolver
      return dishesWithData.filter(dish => dish !== null);
    } catch (error) {
      this.logger.error('Error obteniendo platos:', error);
      throw error;
    }
  }

  async getDishById(id, lang = 'es') {
    try {
      const dish = await this.Dish.findByPk(id, {
        include: [
          {
            model: this.Category,
            as: 'category'
          },
          {
            model: this.Ingredient,
            as: 'ingredients',
            through: { attributes: ['quantity', 'is_removable', 'is_default', 'order'] }
          }
        ]
      });

      if (!dish) {
        throw new Error('Plato no encontrado');
      }

      if (!dish.is_active) {
        throw new Error('Este plato no está disponible actualmente');
      }

      // Incrementar popularidad al ver detalles
      await dish.incrementPopularity(0.5);

      return await dish.getPublicData(lang, true);
    } catch (error) {
      this.logger.error('Error obteniendo plato por ID:', error);
      throw error;
    }
  }

  async createDish(dishData, userId) {
    try {
      // Validar que no exista plato con mismo nombre
      const existingDish = await this.Dish.findOne({
        where: {
          name_es: dishData.name_es
        }
      });

      if (existingDish) {
        throw new Error('Ya existe un plato con este nombre en español');
      }

      // Crear el plato
      const dish = await this.Dish.create({
        ...dishData,
        created_by: userId
      });

      this.logger.info(`Plato creado: ${dish.name_es} por usuario ${userId}`);

      // Si hay ingredientes, agregarlos
      if (dishData.ingredients && Array.isArray(dishData.ingredients)) {
        await this._updateDishIngredients(dish.id, dishData.ingredients);
      }

      return dish;
    } catch (error) {
      this.logger.error('Error creando plato:', error);
      throw error;
    }
  }

  async updateDish(id, updateData) {
    try {
      const dish = await this.Dish.findByPk(id);

      if (!dish) {
        throw new Error('Plato no encontrado');
      }

      // Validar unicidad si se cambia el nombre
      if (updateData.name_es && updateData.name_es !== dish.name_es) {
        const existingDish = await this.Dish.findOne({
          where: {
            name_es: updateData.name_es,
            id: { [this.Op.ne]: id }
          }
        });

        if (existingDish) {
          throw new Error('Ya existe otro plato con este nombre en español');
        }
      }

      await dish.update(updateData);

      // Si hay ingredientes, actualizarlos
      if (updateData.ingredients && Array.isArray(updateData.ingredients)) {
        await this._updateDishIngredients(dish.id, updateData.ingredients);
      }

      this.logger.info(`Plato actualizado: ${dish.name_es}`);

      return dish;
    } catch (error) {
      this.logger.error('Error actualizando plato:', error);
      throw error;
    }
  }

  async _updateDishIngredients(dishId, ingredients) {
    try {
      // Eliminar relaciones existentes
      await this.DishIngredient.destroy({
        where: { dish_id: dishId }
      });

      // Crear nuevas relaciones
      const dishIngredients = ingredients.map(ingredient => ({
        dish_id: dishId,
        ingredient_id: ingredient.id,
        quantity: ingredient.quantity || 1,
        is_removable: ingredient.is_removable || false,
        is_default: ingredient.is_default !== undefined ? ingredient.is_default : true,
        order: ingredient.order || 0
      }));

      await this.DishIngredient.bulkCreate(dishIngredients);
    } catch (error) {
      this.logger.error('Error actualizando ingredientes del plato:', error);
      throw error;
    }
  }

  async deleteDish(id) {
    try {
      const dish = await this.Dish.findByPk(id);

      if (!dish) {
        throw new Error('Plato no encontrado');
      }

      // No eliminar físicamente, solo marcar como inactivo
      await dish.update({ is_active: false });
      this.logger.info(`Plato marcado como inactivo: ${dish.name_es}`);

      return {
        success: true,
        message: 'Plato marcado como inactivo correctamente',
        dish_id: id
      };
    } catch (error) {
      this.logger.error('Error eliminando plato:', error);
      throw error;
    }
  }

  async toggleDishStatus(id) {
    try {
      const dish = await this.Dish.findByPk(id);

      if (!dish) {
        throw new Error('Plato no encontrado');
      }

      await dish.update({ is_active: !dish.is_active });
      const status = dish.is_active ? 'activado' : 'desactivado';

      this.logger.info(`Plato ${status}: ${dish.name_es}`);

      return {
        success: true,
        message: `Plato ${status} correctamente`,
        is_active: dish.is_active
      };
    } catch (error) {
      this.logger.error('Error cambiando estado del plato:', error);
      throw error;
    }
  }

  async toggleFeaturedStatus(id) {
    try {
      const dish = await this.Dish.findByPk(id);

      if (!dish) {
        throw new Error('Plato no encontrado');
      }

      await dish.update({ is_featured: !dish.is_featured });
      const status = dish.is_featured ? 'destacado' : 'no destacado';

      this.logger.info(`Plato marcado como ${status}: ${dish.name_es}`);

      return {
        success: true,
        message: `Plato marcado como ${status}`,
        is_featured: dish.is_featured
      };
    } catch (error) {
      this.logger.error('Error cambiando estado destacado del plato:', error);
      throw error;
    }
  }

  async getPopularDishes(limit = 10, lang = 'es') {
    try {
      const dishes = await this.Dish.findAll({
        where: { is_active: true },
        order: [['popularity_score', 'DESC']],
        limit: limit,
        include: [
          {
            model: this.Category,
            as: 'category'
          }
        ]
      });

      const dishesWithData = await Promise.all(
        dishes.map(async dish => {
          try {
            const data = await dish.getPublicData(lang, false);
            return {
              ...data,
              ingredients_count: dish.ingredients ? dish.ingredients.length : 0
            };
          } catch (error) {
            this.logger.error(`Error procesando plato popular ${dish.id}:`, error);
            return null;
          }
        })
      );

      return dishesWithData.filter(dish => dish !== null);
    } catch (error) {
      this.logger.error('Error obteniendo platos populares:', error);
      throw error;
    }
  }

  async getDishesByCategory(categoryId, lang = 'es') {
    try {
      const dishes = await this.Dish.findAll({
        where: {
          category_id: categoryId,
          is_active: true
        },
        include: [
          {
            model: this.Category,
            as: 'category'
          },
          {
            model: this.Ingredient,
            as: 'ingredients',
            through: { attributes: [] }
          }
        ],
        order: [['popularity_score', 'DESC']]
      });

      const dishesWithData = await Promise.all(
        dishes.map(async dish => await dish.getPublicData(lang, true))
      );

      return dishesWithData;
    } catch (error) {
      this.logger.error('Error obteniendo platos por categoría:', error);
      throw error;
    }
  }

  async searchDishes(query, lang = 'es', limit = 20) {
    try {
      const dishes = await this.Dish.findAll({
        where: {
          is_active: true,
          [this.Op.or]: [
            { name_es: { [this.Op.iLike]: `%${query}%` } },
            { name_ru: { [this.Op.iLike]: `%${query}%` } },
            { description_es: { [this.Op.iLike]: `%${query}%` } },
            { description_ru: { [this.Op.iLike]: `%${query}%` } },
            { tags: { [this.Op.contains]: [query] } }
          ]
        },
        include: [
          {
            model: this.Category,
            as: 'category'
          }
        ],
        limit: limit
      });

      const dishesWithData = await Promise.all(
        dishes.map(async dish => await dish.getPublicData(lang, false))
      );

      return dishesWithData;
    } catch (error) {
      this.logger.error('Error buscando platos:', error);
      throw error;
    }
  }

  async customizeDish(dishId, customization, lang = 'es') {
    try {
      const dish = await this.Dish.findByPk(dishId, {
        include: [
          {
            model: this.Ingredient,
            as: 'ingredients',
            through: { attributes: ['quantity', 'is_removable', 'is_default'] }
          }
        ]
      });

      if (!dish || !dish.is_active) {
        throw new Error('Plato no encontrado o no disponible');
      }

      // Calcular precio personalizado
      let totalPrice = parseFloat(dish.base_price);
      const customizationDetails = {
        added: [],
        removed: [],
        extra: [],
        original_price: dish.base_price,
        customization_price: 0
      };

      // Procesar ingredientes a agregar
      if (customization.add && Array.isArray(customization.add)) {
        for (const ingredientId of customization.add) {
          const ingredient = await this.Ingredient.findByPk(ingredientId);
          if (ingredient && ingredient.is_available) {
            totalPrice += parseFloat(ingredient.price_extra);
            customizationDetails.added.push({
              id: ingredient.id,
              name: ingredient.getName(lang),
              price_extra: ingredient.price_extra
            });
            customizationDetails.customization_price += parseFloat(ingredient.price_extra);
          }
        }
      }

      // Procesar ingredientes a remover
      if (customization.remove && Array.isArray(customization.remove)) {
        for (const ingredientId of customization.remove) {
          const ingredient = await this.Ingredient.findByPk(ingredientId);
          if (ingredient) {
            // Verificar si el ingrediente es removible en este plato
            const dishIngredient = dish.ingredients.find(
              ing => ing.id === ingredientId && ing.DishIngredient.is_removable
            );

            if (dishIngredient) {
              customizationDetails.removed.push({
                id: ingredient.id,
                name: ingredient.getName(lang)
              });
            }
          }
        }
      }

      // Procesar ingredientes extra (más cantidad)
      if (customization.extra && Array.isArray(customization.extra)) {
        for (const extraItem of customization.extra) {
          const ingredient = await this.Ingredient.findByPk(extraItem.id);
          if (ingredient && ingredient.is_available) {
            const extraQuantity = extraItem.quantity || 1;
            totalPrice += parseFloat(ingredient.price_extra) * extraQuantity;
            customizationDetails.extra.push({
              id: ingredient.id,
              name: ingredient.getName(lang),
              price_extra: ingredient.price_extra,
              quantity: extraQuantity,
              total_extra: parseFloat(ingredient.price_extra) * extraQuantity
            });
            customizationDetails.customization_price += parseFloat(ingredient.price_extra) * extraQuantity;
          }
        }
      }

      // Obtener datos del plato con los ingredientes actualizados
      const dishData = await dish.getPublicData(lang, true);

      return {
        dish: dishData,
        customization: customizationDetails,
        total_price: totalPrice,
        base_price: dish.base_price,
        customization_summary: {
          added_count: customizationDetails.added.length,
          removed_count: customizationDetails.removed.length,
          extra_count: customizationDetails.extra.length
        }
      };
    } catch (error) {
      this.logger.error('Error personalizando plato:', error);
      throw error;
    }
  }
}

module.exports = new DishService();
