// Este archivo maneja las exportaciones de modelos de dishes
// y ayuda a prevenir dependencias circulares

const Category = require('./Category');
const Ingredient = require('./Ingredient');
const Dish = require('./Dish');
const DishIngredient = require('./DishIngredient');

module.exports = {
    Category,
    Ingredient,
    Dish,
    DishIngredient
};
