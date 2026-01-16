const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../shared/database/config');
const Category = require('./Category');

const Dish = sequelize.define('Dish', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name_es: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre en español es requerido'
      },
      len: {
        args: [3, 200],
        msg: 'El nombre debe tener entre 3 y 200 caracteres'
      }
    }
  },
  name_ru: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre en ruso es requerido'
      },
      len: {
        args: [3, 200],
        msg: 'El nombre debe tener entre 3 y 200 caracteres'
      }
    }
  },
  description_es: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  description_ru: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  base_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'El precio base no puede ser negativo'
      },
      notNull: {
        msg: 'El precio base es requerido'
      }
    }
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING(500)),
    defaultValue: [],
  },
  category_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  preparation_time: {
    type: DataTypes.INTEGER, // en minutos
    allowNull: false,
    defaultValue: 15,
    validate: {
      min: {
        args: [1],
        msg: 'El tiempo de preparación debe ser al menos 1 minuto'
      }
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING(50)),
    defaultValue: [],
  },
  customization_options: {
    type: DataTypes.JSONB,
    defaultValue: {
      can_add_ingredients: true,
      can_remove_ingredients: true,
      max_extra_ingredients: 5,
      allowed_categories: [] // Si está vacío, permite todas
    }
  },
  popularity_score: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
  }
}, {
  tableName: 'dishes',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['is_active']
    },
    {
      fields: ['is_featured']
    },
    {
      fields: ['category_id']
    },
    {
      fields: ['popularity_score']
    }
  ]
});

// // Relaciones
// Dish.belongsTo(Category, {
//   foreignKey: 'category_id',
//   as: 'category'
// });

// Category.hasMany(Dish, {
//   foreignKey: 'category_id',
//   as: 'dishes'
// });

// Métodos de instancia
Dish.prototype.getName = function (lang = 'es') {
  return lang === 'ru' ? this.name_ru : this.name_es;
};

Dish.prototype.getDescription = function (lang = 'es') {
  return lang === 'ru' ? this.description_ru : this.description_es;
};

// Método para incrementar popularidad
Dish.prototype.incrementPopularity = async function (points = 1) {
  this.popularity_score = (parseFloat(this.popularity_score) || 0) + points;
  await this.save();
};

// Método para obtener datos públicos
Dish.prototype.getPublicData = async function (lang = 'es', includeIngredients = true) {
  const data = {
    id: this.id,
    name: this.getName(lang),
    description: this.getDescription(lang),
    base_price: this.base_price,
    image_url: this.image_url,
    images: this.images,
    preparation_time: this.preparation_time,
    is_active: this.is_active,
    is_featured: this.is_featured,
    calories: this.calories,
    tags: this.tags,
    customization_options: this.customization_options,
    popularity_score: this.popularity_score,
    created_at: this.created_at,
    updated_at: this.updated_at
  };

  // Incluir categoría si está cargada
  if (this.category) {
    data.category = {
      id: this.category.id,
      name: this.category.getName(lang),
      description: this.category.getDescription(lang),
      icon: this.category.icon,
      color: this.category.color
    };
  } else if (this.category_id) {
    data.category_id = this.category_id;
  }

  // Incluir ingredientes si se solicita
  if (includeIngredients && this.ingredients) {
    data.ingredients = this.ingredients.map(ingredient => {
      const ingredientData = ingredient.getPublicData(lang);
      // Agregar información específica de la relación si existe
      if (ingredient.DishIngredient) {
        ingredientData.quantity = ingredient.DishIngredient.quantity;
        ingredientData.is_removable = ingredient.DishIngredient.is_removable;
        ingredientData.is_default = ingredient.DishIngredient.is_default;
      }
      return ingredientData;
    });
  }

  return data;
};

module.exports = Dish;
