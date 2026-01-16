const Joi = require('joi');

const cartItemSchema = Joi.object({
    dish_id: Joi.string()
        .uuid()
        .messages({
            'string.guid': 'El ID del plato debe ser un UUID válido'
        }),
    custom_dish: Joi.object({
        name: Joi.string().min(3).max(200).required(),
        total_price: Joi.number().precision(2).min(0).required(),
        ingredients: Joi.array().items(
            Joi.object({
                id: Joi.string().uuid().required(),
                name: Joi.string().required(),
                price_extra: Joi.number().precision(2).min(0).required()
            })
        ).min(1)
    }),
    quantity: Joi.number()
        .integer()
        .min(1)
        .max(10)
        .default(1)
        .messages({
            'number.min': 'La cantidad debe ser al menos 1',
            'number.max': 'La cantidad no puede exceder 10',
            'number.integer': 'La cantidad debe ser un número entero'
        }),
    customization: Joi.object({
        add: Joi.array()
            .items(Joi.string().uuid())
            .max(5)
            .default([]),
        remove: Joi.array()
            .items(Joi.string().uuid())
            .max(5)
            .default([]),
        extra: Joi.array()
            .items(
                Joi.object({
                    id: Joi.string().uuid().required(),
                    quantity: Joi.number().integer().min(1).max(3).default(1)
                })
            )
            .max(5)
            .default([])
    }).default({ add: [], remove: [], extra: [] }),
    notes: Joi.string()
        .max(500)
        .allow(null, '')
}).xor('dish_id', 'custom_dish')
    .messages({
        'object.xor': 'Debe proporcionar o dish_id o custom_dish, pero no ambos'
    });

const updateQuantitySchema = Joi.object({
    quantity: Joi.number()
        .integer()
        .min(1)
        .max(10)
        .required()
        .messages({
            'number.min': 'La cantidad debe ser al menos 1',
            'number.max': 'La cantidad no puede exceder 10',
            'any.required': 'La cantidad es requerida'
        })
});

module.exports = {
    cartItemSchema,
    updateQuantitySchema
};
