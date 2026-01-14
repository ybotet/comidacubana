const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../shared/database/config');

const Ingredient = sequelize.define('Ingredient', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name_es: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre en español es requerido'
      }
    }
  },
  name_ru: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre en ruso es requerido'
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
  price_extra: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'El precio extra no puede ser negativo'
      }
    }
  },
  is_available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  category: {
    type: DataTypes.ENUM('protein', 'vegetable', 'sauce', 'spice', 'cheese', 'other'),
    allowNull: false,
    defaultValue: 'other',
  },
  allergen_info: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  icon: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: {
        args: [0],
        msg: 'Las calorías no pueden ser negativas'
      }
    }
  }
}, {
  tableName: 'ingredients',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['is_available']
    }
  ]
});

// Método para obtener nombre según idioma
Ingredient.prototype.getName = function(lang = 'es') {
  return lang === 'ru' ? this.name_ru : this.name_es;
};

// Método para obtener descripción según idioma
Ingredient.prototype.getDescription = function(lang = 'es') {
  return lang === 'ru' ? this.description_ru : this.description_es;
};

// Método para obtener datos públicos
Ingredient.prototype.getPublicData = function(lang = 'es') {
  return {
    id: this.id,
    name: this.getName(lang),
    description: this.getDescription(lang),
    price_extra: this.price_extra,
    is_available: this.is_available,
    category: this.category,
    allergen_info: this.allergen_info,
    icon: this.icon,
    image_url: this.image_url,
    calories: this.calories,
    created_at: this.created_at,
    updated_at: this.updated_at
  };
};

module.exports = Ingredient;
