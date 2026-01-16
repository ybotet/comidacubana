const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../shared/database/config');
const Order = require('./Order');
const Dish = require('../../dishes/models/Dish');

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    order_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'orders',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    dish_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'dishes',
            key: 'id'
        }
    },
    dish_data: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Snapshot del plato al momento del pedido'
    },
    custom_dish_data: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Datos de plato personalizado'
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
    unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: 'El precio unitario no puede ser negativo'
            }
        }
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: 'El precio total no puede ser negativo'
            }
        }
    },
    customization: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Personalizaciones aplicadas al plato'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    preparation_status: {
        type: DataTypes.ENUM('pending', 'preparing', 'ready', 'served'),
        defaultValue: 'pending',
    }
}, {
    tableName: 'order_items',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            fields: ['order_id']
        },
        {
            fields: ['dish_id']
        },
        {
            fields: ['preparation_status']
        }
    ]
});

// Hooks
OrderItem.addHook('beforeCreate', async (orderItem) => {
    // Calcular precio total
    if (!orderItem.total_price) {
        orderItem.total_price = parseFloat(orderItem.unit_price) * orderItem.quantity;
    }
});

// Métodos de instancia
OrderItem.prototype.getPublicData = function (lang = 'es') {
    const data = {
        id: this.id,
        quantity: this.quantity,
        unit_price: this.unit_price,
        total_price: this.total_price,
        customization: this.customization,
        notes: this.notes,
        preparation_status: this.preparation_status,
        created_at: this.created_at
    };

    // Usar dish_data si existe (snapshot), sino cargar del modelo
    if (this.dish_data) {
        data.dish = this.dish_data;
        // Asegurar que tenga nombre en el idioma correcto
        if (data.dish) {
            data.dish.name = lang === 'ru' ? data.dish.name_ru : data.dish.name_es;
            delete data.dish.name_es;
            delete data.dish.name_ru;
        }
    } else if (this.dish) {
        data.dish = {
            id: this.dish.id,
            name: this.dish.getName(lang),
            description: this.dish.getDescription(lang),
            image_url: this.dish.image_url
        };
    }

    if (this.custom_dish_data) {
        data.custom_dish = this.custom_dish_data;
    }

    return data;
};

OrderItem.prototype.updatePreparationStatus = async function (newStatus) {
    this.preparation_status = newStatus;
    await this.save();
    return this;
};

module.exports = OrderItem;
