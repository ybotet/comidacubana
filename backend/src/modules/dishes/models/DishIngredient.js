const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../shared/database/config');
const Dish = require('./Dish');
const Ingredient = require('./Ingredient');

const DishIngredient = sequelize.define('DishIngredient', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  dish_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'dishes',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  ingredient_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'ingredients',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: {
        args: [1],
        msg: 'La cantidad debe ser al menos 1'
      }
    }
  },
  is_removable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_default: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
}, {
  tableName: 'dish_ingredients',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['dish_id', 'ingredient_id']
    },
    {
      fields: ['dish_id']
    },
    {
      fields: ['ingredient_id']
    }
  ]
});

// Establecer relaciones
Dish.belongsToMany(Ingredient, {
  through: DishIngredient,
  foreignKey: 'dish_id',
  otherKey: 'ingredient_id',
  as: 'ingredients'
});

Ingredient.belongsToMany(Dish, {
  through: DishIngredient,
  foreignKey: 'ingredient_id',
  otherKey: 'dish_id',
  as: 'dishes'
});

DishIngredient.belongsTo(Dish, {
  foreignKey: 'dish_id',
  as: 'dish'
});

DishIngredient.belongsTo(Ingredient, {
  foreignKey: 'ingredient_id',
  as: 'ingredient'
});

module.exports = DishIngredient;
