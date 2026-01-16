const Joi = require('joi');

const createAddressSchema = Joi.object({
    alias: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'El alias debe tener al menos 2 caracteres',
            'string.max': 'El alias no puede exceder 100 caracteres',
            'any.required': 'El alias es requerido'
        }),
    street: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.min': 'La calle debe tener al menos 3 caracteres',
            'string.max': 'La calle no puede exceder 255 caracteres',
            'any.required': 'La calle es requerida'
        }),
    number: Joi.string()
        .max(50)
        .required()
        .messages({
            'string.max': 'El número no puede exceder 50 caracteres',
            'any.required': 'El número es requerido'
        }),
    apartment: Joi.string()
        .max(50)
        .allow(null, ''),
    neighborhood: Joi.string()
        .max(100)
        .allow(null, ''),
    city: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'La ciudad debe tener al menos 2 caracteres',
            'string.max': 'La ciudad no puede exceder 100 caracteres',
            'any.required': 'La ciudad es requerida'
        }),
    state: Joi.string()
        .max(100)
        .allow(null, ''),
    postal_code: Joi.string()
        .pattern(/^\d{4,5}$/)
        .required()
        .messages({
            'string.pattern.base': 'El código postal debe tener 4 o 5 dígitos',
            'any.required': 'El código postal es requerido'
        }),
    country: Joi.string()
        .min(2)
        .max(100)
        .default('España')
        .messages({
            'string.min': 'El país debe tener al menos 2 caracteres',
            'string.max': 'El país no puede exceder 100 caracteres'
        }),
    instructions: Joi.string()
        .max(1000)
        .allow(null, ''),
    is_default: Joi.boolean()
        .default(false),
    latitude: Joi.number()
        .min(-90)
        .max(90)
        .allow(null),
    longitude: Joi.number()
        .min(-180)
        .max(180)
        .allow(null)
});

const updateAddressSchema = Joi.object({
    alias: Joi.string()
        .min(2)
        .max(100),
    street: Joi.string()
        .min(3)
        .max(255),
    number: Joi.string()
        .max(50),
    apartment: Joi.string()
        .max(50)
        .allow(null, ''),
    neighborhood: Joi.string()
        .max(100)
        .allow(null, ''),
    city: Joi.string()
        .min(2)
        .max(100),
    state: Joi.string()
        .max(100)
        .allow(null, ''),
    postal_code: Joi.string()
        .pattern(/^\d{4,5}$/)
        .messages({
            'string.pattern.base': 'El código postal debe tener 4 o 5 dígitos'
        }),
    country: Joi.string()
        .min(2)
        .max(100),
    instructions: Joi.string()
        .max(1000)
        .allow(null, ''),
    is_default: Joi.boolean(),
    latitude: Joi.number()
        .min(-90)
        .max(90)
        .allow(null),
    longitude: Joi.number()
        .min(-180)
        .max(180)
        .allow(null)
});

module.exports = {
    createAddressSchema,
    updateAddressSchema
};
