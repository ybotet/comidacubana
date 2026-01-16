const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../shared/database/config');
const User = require('../../auth/models/User');
const Dish = require('../../dishes/models/Dish');
const Ingredient = require('../../dishes/models/Ingredient');

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    session_id: {
        type: DataTypes.STRING(100),
        allowNull: true, // Para usuarios no autenticados
    },
    items: {
        type: DataTypes.JSONB,
        defaultValue: [],
        validate: {
            isValidItems(value) {
                if (!Array.isArray(value)) {
                    throw new Error('Los items deben ser un array');
                }

                for (const item of value) {
                    if (!item.dish_id && !item.custom_dish) {
                        throw new Error('Cada item debe tener dish_id o custom_dish');
                    }
                    if (!item.quantity || item.quantity < 1) {
                        throw new Error('Cantidad inválida');
                    }
                }
            }
        }
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        validate: {
            min: {
                args: [0],
                msg: 'El total no puede ser negativo'
            }
        }
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    tableName: 'carts',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            fields: ['user_id']
        },
        {
            fields: ['session_id']
        },
        {
            fields: ['expires_at']
        }
    ]
});

// Validación a nivel de modelo: debe existir `user_id` o `session_id`
Cart.addHook('beforeValidate', (cart) => {
    if (!cart.user_id && !cart.session_id) {
        throw new Error('El carrito debe pertenecer a un usuario o a una sesión');
    }
});


// Métodos de instancia
Cart.prototype.calculateTotal = async function () {
    let total = 0;

    for (const item of this.items) {
        let itemPrice = 0;

        if (item.dish_id) {
            // Plato estándar
            const dish = await Dish.findByPk(item.dish_id);
            if (dish && dish.is_active) {
                itemPrice = parseFloat(dish.base_price);

                // Calcular personalizaciones si existen
                if (item.customization) {
                    if (item.customization.add && Array.isArray(item.customization.add)) {
                        for (const ingredientId of item.customization.add) {
                            const ingredient = await Ingredient.findByPk(ingredientId);
                            if (ingredient && ingredient.is_available) {
                                itemPrice += parseFloat(ingredient.price_extra);
                            }
                        }
                    }

                    if (item.customization.extra && Array.isArray(item.customization.extra)) {
                        for (const extra of item.customization.extra) {
                            const ingredient = await Ingredient.findByPk(extra.id);
                            if (ingredient && ingredient.is_available) {
                                itemPrice += parseFloat(ingredient.price_extra) * (extra.quantity || 1);
                            }
                        }
                    }
                }
            }
        } else if (item.custom_dish) {
            // Plato personalizado
            itemPrice = parseFloat(item.custom_dish.total_price) || 0;
        }

        total += itemPrice * (item.quantity || 1);
    }

    this.total_amount = total;
    return total;
};

Cart.prototype.addItem = async function (item) {
    if (!this.items) {
        this.items = [];
    }

    // Buscar si ya existe el mismo item
    const existingIndex = this.items.findIndex(existing =>
        existing.dish_id === item.dish_id &&
        JSON.stringify(existing.customization) === JSON.stringify(item.customization) &&
        JSON.stringify(existing.custom_dish) === JSON.stringify(item.custom_dish)
    );

    if (existingIndex >= 0) {
        // Actualizar cantidad
        this.items[existingIndex].quantity += (item.quantity || 1);
    } else {
        // Agregar nuevo item
        this.items.push({
            ...item,
            added_at: new Date().toISOString()
        });
    }

    await this.calculateTotal();
    // Marcar items como cambiados para que Sequelize persista el JSONB
    this.set('items', this.items);
    this.changed('items', true);
    await this.save();
    return this;
};

Cart.prototype.removeItem = async function (index) {
    if (this.items && this.items[index]) {
        this.items.splice(index, 1);
        await this.calculateTotal();
    }
    // Marcar items como cambiados para persistencia
    this.set('items', this.items);
    this.changed('items', true);
    await this.save();
    return this;
};

Cart.prototype.updateItemQuantity = async function (index, quantity) {
    if (this.items && this.items[index] && quantity > 0) {
        this.items[index].quantity = quantity;
        await this.calculateTotal();
    }
    // Marcar items como cambiados para persistencia
    this.set('items', this.items);
    this.changed('items', true);
    await this.save();
    return this;
};

Cart.prototype.clear = async function () {
    this.items = [];
    this.total_amount = 0;
    // Marcar items como cambiados para persistencia
    this.set('items', this.items);
    this.changed('items', true);
    await this.save();
    return this;
};

Cart.prototype.getItemCount = function () {
    if (!this.items) return 0;
    return this.items.reduce((total, item) => total + (item.quantity || 1), 0);
};

Cart.prototype.getItemsSummary = async function (lang = 'es') {
    if (!this.items || this.items.length === 0) {
        return [];
    }

    const summary = [];

    for (const item of this.items) {
        let itemSummary = {
            quantity: item.quantity || 1,
            unit_price: 0,
            total_price: 0,
            customization: item.customization || null
        };

        if (item.dish_id) {
            const dish = await Dish.findByPk(item.dish_id, {
                include: [
                    {
                        model: sequelize.models.Category,
                        as: 'category'
                    }
                ]
            });

            if (dish) {
                itemSummary.dish = await dish.getPublicData(lang, true);
                itemSummary.unit_price = parseFloat(dish.base_price);

                // Calcular precio con personalizaciones
                if (item.customization) {
                    let customizationPrice = 0;

                    if (item.customization.add && Array.isArray(item.customization.add)) {
                        for (const ingredientId of item.customization.add) {
                            const ingredient = await Ingredient.findByPk(ingredientId);
                            if (ingredient && ingredient.is_available) {
                                customizationPrice += parseFloat(ingredient.price_extra);
                            }
                        }
                    }

                    if (item.customization.extra && Array.isArray(item.customization.extra)) {
                        for (const extra of item.customization.extra) {
                            const ingredient = await Ingredient.findByPk(extra.id);
                            if (ingredient && ingredient.is_available) {
                                customizationPrice += parseFloat(ingredient.price_extra) * (extra.quantity || 1);
                            }
                        }
                    }

                    itemSummary.unit_price += customizationPrice;
                    itemSummary.customization_price = customizationPrice;
                }

                itemSummary.total_price = itemSummary.unit_price * itemSummary.quantity;
            }
        } else if (item.custom_dish) {
            itemSummary.custom_dish = item.custom_dish;
            itemSummary.unit_price = parseFloat(item.custom_dish.total_price) || 0;
            itemSummary.total_price = itemSummary.unit_price * itemSummary.quantity;
        }

        summary.push(itemSummary);
    }

    return summary;
};

module.exports = Cart;
