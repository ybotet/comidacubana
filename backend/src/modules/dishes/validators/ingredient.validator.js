const Joi = require('joi');

const createIngredientSchema = Joi.object({
    name_es: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'El nombre en español debe tener al menos 2 caracteres',
            'string.max': 'El nombre en español no puede exceder 100 caracteres',
            'string.empty': 'El nombre en español es requerido',
            'any.required': 'El nombre en español es requerido'
        }),
    name_ru: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'El nombre en ruso debe tener al menos 2 caracteres',
            'string.max': 'El nombre en ruso no puede exceder 100 caracteres',
            'string.empty': 'El nombre en ruso es requerido',
            'any.required': 'El nombre en ruso es requerido'
        }),
    description_es: Joi.string()
        .allow(null, '')
        .max(1000),
    description_ru: Joi.string()
        .allow(null, '')
        .max(1000),
    price_extra: Joi.number()
        .precision(2)
        .min(0)
        .default(0)
        .messages({
            'number.min': 'El precio extra no puede ser negativo',
            'number.precision': 'El precio extra debe tener máximo 2 decimales'
        }),
    is_available: Joi.boolean()
        .default(true),
    category: Joi.string()
        .valid('protein', 'vegetable', 'sauce', 'spice', 'cheese', 'other')
        .default('other')
        .required()
        .messages({
            'any.only': 'La categoría debe ser una de: protein, vegetable, sauce, spice, cheese, other',
            'any.required': 'La categoría es requerida'
        }),
    allergen_info: Joi.string()
        .allow(null, '')
        .max(500),
    icon: Joi.string()
        .allow(null, '')
        .max(100),
    image_url: Joi.string()
        .uri()
        .allow(null, '')
        .max(500)
        .messages({
            'string.uri': 'La URL de la imagen debe ser válida'
        }),
    calories: Joi.number()
        .integer()
        .min(0)
        .allow(null)
});

const updateIngredientSchema = Joi.object({
    name_es: Joi.string()
        .min(2)
        .max(100),
    name_ru: Joi.string()
        .min(2)
        .max(100),
    description_es: Joi.string()
        .allow(null, '')
        .max(1000),
    description_ru: Joi.string()
        .allow(null, '')
        .max(1000),
    price_extra: Joi.number()
        .precision(2)
        .min(0)
        .messages({
            'number.min': 'El precio extra no puede ser negativo',
            'number.precision': 'El precio extra debe tener máximo 2 decimales'
        }),
    is_available: Joi.boolean(),
    category: Joi.string()
        .valid('protein', 'vegetable', 'sauce', 'spice', 'cheese', 'other')
        .messages({
            'any.only': 'La categoría debe ser una de: protein, vegetable, sauce, spice, cheese, other'
        }),
    allergen_info: Joi.string()
        .allow(null, '')
        .max(500),
    icon: Joi.string()
        .allow(null, '')
        .max(100),
    image_url: Joi.string()
        .uri()
        .allow(null, '')
        .max(500)
        .messages({
            'string.uri': 'La URL de la imagen debe ser válida'
        }),
    calories: Joi.number()
        .integer()
        .min(0)
        .allow(null)
});

module.exports = {
    createIngredientSchema,
    updateIngredientSchema
};
