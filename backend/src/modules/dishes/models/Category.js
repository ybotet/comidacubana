const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../shared/database/config');

const Category = sequelize.define('Category', {
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
  icon: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  color: {
    type: DataTypes.STRING(7), // #FF0000
    allowNull: true,
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  tableName: 'categories',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['is_active']
    },
    {
      fields: ['order']
    }
  ]
});

// Método para obtener nombre según idioma
Category.prototype.getName = function(lang = 'es') {
  return lang === 'ru' ? this.name_ru : this.name_es;
};

// Método para obtener descripción según idioma
Category.prototype.getDescription = function(lang = 'es') {
  return lang === 'ru' ? this.description_ru : this.description_es;
};

module.exports = Category;
