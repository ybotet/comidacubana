const { sequelize } = require('./config');

// 1. Cargar modelos sin dependencias primero
const User = require('../../modules/auth/models/User');

// 2. Modelos de dishes
const Category = require('../../modules/dishes/models/Category');
const Ingredient = require('../../modules/dishes/models/Ingredient');
const Dish = require('../../modules/dishes/models/Dish');
const DishIngredient = require('../../modules/dishes/models/DishIngredient');

// 3. Modelos de orders
const Address = require('../../modules/orders/models/Address');
const Cart = require('../../modules/orders/models/Cart');
const Order = require('../../modules/orders/models/Order');
const OrderItem = require('../../modules/orders/models/OrderItem');
const Notification = require('../../modules/orders/models/Notification');

// Establecer relaciones en orden

// Relaciones de Dishes
Dish.belongsTo(Category, {
    foreignKey: 'category_id',
    as: 'category'
});

Category.hasMany(Dish, {
    foreignKey: 'category_id',
    as: 'dishes'
});

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

// Relaciones de Orders
Address.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'owner'
});

User.hasMany(Address, {
    foreignKey: 'user_id',
    as: 'addresses'
});

Cart.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'cartUser'
});

User.hasMany(Cart, {
    foreignKey: 'user_id',
    as: 'carts'
});

Order.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'customer'
});

Order.belongsTo(User, {
    foreignKey: 'provider_id',
    as: 'provider'
});

Order.belongsTo(Address, {
    foreignKey: 'address_id',
    as: 'address'
});

User.hasMany(Order, {
    foreignKey: 'user_id',
    as: 'customer_orders'
});

User.hasMany(Order, {
    foreignKey: 'provider_id',
    as: 'provider_orders'
});

OrderItem.belongsTo(Order, {
    foreignKey: 'order_id',
    as: 'order'
});

OrderItem.belongsTo(Dish, {
    foreignKey: 'dish_id',
    as: 'dish'
});

Order.hasMany(OrderItem, {
    foreignKey: 'order_id',
    as: 'items'
});

Notification.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'notificationUser'
});

User.hasMany(Notification, {
    foreignKey: 'user_id',
    as: 'notifications'
});

// Exportar todos los modelos
module.exports = {
    sequelize,
    User,
    Category,
    Ingredient,
    Dish,
    DishIngredient,
    Address,
    Cart,
    Order,
    OrderItem,
    Notification
};
