const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../shared/database/config');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Debe ser un email válido'
      },
      notEmpty: {
        msg: 'El email es requerido'
      }
    }
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre es requerido'
      },
      len: {
        args: [2, 100],
        msg: 'El nombre debe tener entre 2 y 100 caracteres'
      }
    }
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El apellido es requerido'
      },
      len: {
        args: [2, 100],
        msg: 'El apellido debe tener entre 2 y 100 caracteres'
      }
    }
  },
  role: {
    type: DataTypes.ENUM('customer', 'provider', 'admin'),
    defaultValue: 'customer',
    allowNull: false,
  },
  language: {
    type: DataTypes.ENUM('es', 'ru'),
    defaultValue: 'es',
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password_hash) {
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(user.password_hash, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password_hash')) {
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(user.password_hash, salt);
      }
    }
  }
});

// Método de instancia para verificar contraseña
User.prototype.verifyPassword = async function(password) {
  return await bcrypt.compare(password, this.password_hash);
};

// Método de instancia para generar nombre completo
User.prototype.getFullName = function() {
  return `${this.first_name} ${this.last_name}`;
};

// Método de instancia para obtener datos seguros (sin password)
User.prototype.getSafeData = function() {
  const { password_hash, ...safeData } = this.toJSON();
  return safeData;
};

module.exports = User;
