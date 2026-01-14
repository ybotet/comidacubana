const Joi = require('joi');

const createDishSchema = Joi.object({
    name_es: Joi.string()
        .min(3)
        .max(200)
        .required()
        .messages({
            'string.min': 'El nombre en español debe tener al menos 3 caracteres',
            'string.max': 'El nombre en español no puede exceder 200 caracteres',
            'string.empty': 'El nombre en español es requerido',
            'any.required': 'El nombre en español es requerido'
        }),
    name_ru: Joi.string()
        .min(3)
        .max(200)
        .required()
        .messages({
            'string.min': 'El nombre en ruso debe tener al menos 3 caracteres',
            'string.max': 'El nombre en ruso no puede exceder 200 caracteres',
            'string.empty': 'El nombre en ruso es requerido',
            'any.required': 'El nombre en ruso es requerido'
        }),
    description_es: Joi.string()
        .allow(null, '')
        .max(2000),
    description_ru: Joi.string()
        .allow(null, '')
        .max(2000),
    base_price: Joi.number()
        .precision(2)
        .min(0)
        .required()
        .messages({
            'number.min': 'El precio base no puede ser negativo',
            'number.precision': 'El precio base debe tener máximo 2 decimales',
            'any.required': 'El precio base es requerido'
        }),
    image_url: Joi.string()
        .uri()
        .allow(null, '')
        .max(500)
        .messages({
            'string.uri': 'La URL de la imagen debe ser válida'
        }),
    images: Joi.array()
        .items(Joi.string().uri().max(500))
        .max(10)
        .default([]),
    category_id: Joi.string()
        .uuid()
        .allow(null, '')
        .messages({
            'string.guid': 'El ID de categoría debe ser un UUID válido'
        }),
    preparation_time: Joi.number()
        .integer()
        .min(1)
        .default(15)
        .messages({
            'number.min': 'El tiempo de preparación debe ser al menos 1 minuto',
            'number.integer': 'El tiempo de preparación debe ser un número entero'
        }),
    is_active: Joi.boolean()
        .default(true),
    is_featured: Joi.boolean()
        .default(false),
    calories: Joi.number()
        .integer()
        .min(0)
        .allow(null),
    tags: Joi.array()
        .items(Joi.string().max(50))
        .max(20)
        .default([]),
    customization_options: Joi.object({
        can_add_ingredients: Joi.boolean().default(true),
        can_remove_ingredients: Joi.boolean().default(true),
        max_extra_ingredients: Joi.number().integer().min(0).default(5),
        allowed_categories: Joi.array().items(
            Joi.string().valid('protein', 'vegetable', 'sauce', 'spice', 'cheese', 'other')
        ).default([])
    }).default({
        can_add_ingredients: true,
        can_remove_ingredients: true,
        max_extra_ingredients: 5,
        allowed_categories: []
    }),
    ingredients: Joi.array()
        .items(
            Joi.object({
                id: Joi.string().uuid().required(),
                quantity: Joi.number().integer().min(1).default(1),
                is_removable: Joi.boolean().default(false),
                is_default: Joi.boolean().default(true),
                order: Joi.number().integer().default(0)
            })
        )
        .default([])
});

const updateDishSchema = Joi.object({
    name_es: Joi.string()
        .min(3)
        .max(200),
    name_ru: Joi.string()
        .min(3)
        .max(200),
    description_es: Joi.string()
        .allow(null, '')
        .max(2000),
    description_ru: Joi.string()
        .allow(null, '')
        .max(2000),
    base_price: Joi.number()
        .precision(2)
        .min(0)
        .messages({
            'number.min': 'El precio base no puede ser negativo',
            'number.precision': 'El precio base debe tener máximo 2 decimales'
        }),
    image_url: Joi.string()
        .uri()
        .allow(null, '')
        .max(500)
        .messages({
            'string.uri': 'La URL de la imagen debe ser válida'
        }),
    images: Joi.array()
        .items(Joi.string().uri().max(500))
        .max(10),
    category_id: Joi.string()
        .uuid()
        .allow(null, '')
        .messages({
            'string.guid': 'El ID de categoría debe ser un UUID válido'
        }),
    preparation_time: Joi.number()
        .integer()
        .min(1)
        .messages({
            'number.min': 'El tiempo de preparación debe ser al menos 1 minuto',
            'number.integer': 'El tiempo de preparación debe ser un número entero'
        }),
    is_active: Joi.boolean(),
    is_featured: Joi.boolean(),
    calories: Joi.number()
        .integer()
        .min(0)
        .allow(null),
    tags: Joi.array()
        .items(Joi.string().max(50))
        .max(20),
    customization_options: Joi.object({
        can_add_ingredients: Joi.boolean(),
        can_remove_ingredients: Joi.boolean(),
        max_extra_ingredients: Joi.number().integer().min(0),
        allowed_categories: Joi.array().items(
            Joi.string().valid('protein', 'vegetable', 'sauce', 'spice', 'cheese', 'other')
        )
    }),
    ingredients: Joi.array()
        .items(
            Joi.object({
                id: Joi.string().uuid().required(),
                quantity: Joi.number().integer().min(1).default(1),
                is_removable: Joi.boolean().default(false),
                is_default: Joi.boolean().default(true),
                order: Joi.number().integer().default(0)
            })
        )
});

const customizeDishSchema = Joi.object({
    add: Joi.array()
        .items(Joi.string().uuid())
        .max(10)
        .default([]),
    remove: Joi.array()
        .items(Joi.string().uuid())
        .max(10)
        .default([]),
    extra: Joi.array()
        .items(
            Joi.object({
                id: Joi.string().uuid().required(),
                quantity: Joi.number().integer().min(1).max(5).default(1)
            })
        )
        .max(10)
        .default([])
});

const dishFiltersSchema = Joi.object({
    category_id: Joi.string().uuid(),
    is_featured: Joi.boolean(),
    search: Joi.string().max(100),
    min_price: Joi.number().min(0),
    max_price: Joi.number().min(0),
    ingredient_id: Joi.string().uuid(),
    sort_by: Joi.string().valid('price_asc', 'price_desc', 'name_asc', 'preparation_time', 'newest', 'popularity'),
    limit: Joi.number().integer().min(1).max(100),
    offset: Joi.number().integer().min(0),
    lang: Joi.string().valid('es', 'ru').default('es')
});

module.exports = {
    createDishSchema,
    updateDishSchema,
    customizeDishSchema,
    dishFiltersSchema
};
