const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../shared/database/config');
const User = require('../../auth/models/User');

const Address = sequelize.define('Address', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    alias: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El alias es requerido'
            }
        }
    },
    street: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La calle es requerida'
            }
        }
    },
    number: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El número es requerido'
            }
        }
    },
    apartment: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    neighborhood: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La ciudad es requerida'
            }
        }
    },
    state: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    postal_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El código postal es requerido'
            }
        }
    },
    country: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'España',
        validate: {
            notEmpty: {
                msg: 'El país es requerido'
            }
        }
    },
    instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
    }
}, {
    tableName: 'addresses',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            fields: ['user_id']
        },
        {
            fields: ['is_default']
        }
    ]
});


// Hook para asegurar que solo haya una dirección por defecto
Address.addHook('beforeSave', async (address) => {
    if (address.is_default) {
        await Address.update(
            { is_default: false },
            {
                where: {
                    user_id: address.user_id,
                    id: { [sequelize.Sequelize.Op.ne]: address.id || null }
                }
            }
        );
    }
});

// Método para obtener dirección formateada
Address.prototype.getFormattedAddress = function () {
    const parts = [
        `${this.street} ${this.number}`,
        this.apartment && `Apto: ${this.apartment}`,
        this.neighborhood,
        `${this.postal_code} ${this.city}`,
        this.state,
        this.country
    ].filter(Boolean);

    return parts.join(', ');
};

module.exports = Address;
