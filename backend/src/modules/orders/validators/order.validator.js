const Joi = require('joi');

const createOrderSchema = Joi.object({
    delivery_type: Joi.string()
        .valid('delivery', 'pickup')
        .required()
        .messages({
            'any.only': 'El tipo de entrega debe ser delivery o pickup',
            'any.required': 'El tipo de entrega es requerido'
        }),
    address_id: Joi.string()
        .uuid()
        .when('delivery_type', {
            is: 'delivery',
            then: Joi.required(),
            otherwise: Joi.optional()
        })
        .messages({
            'string.guid': 'El ID de la dirección debe ser un UUID válido',
            'any.required': 'La dirección es requerida para delivery'
        }),
    delivery_address: Joi.object({
        street: Joi.string().required(),
        number: Joi.string().required(),
        apartment: Joi.string().allow(null, ''),
        neighborhood: Joi.string().allow(null, ''),
        city: Joi.string().required(),
        state: Joi.string().allow(null, ''),
        postal_code: Joi.string().required(),
        country: Joi.string().default('España'),
        instructions: Joi.string().allow(null, ''),
        latitude: Joi.number().min(-90).max(90).allow(null),
        longitude: Joi.number().min(-180).max(180).allow(null)
    }).when('delivery_type', {
        is: 'delivery',
        then: Joi.when('address_id', {
            is: Joi.exist(),
            then: Joi.forbidden(),
            otherwise: Joi.required()
        }),
        otherwise: Joi.forbidden()
    }),
    scheduled_for: Joi.date()
        .min('now')
        .allow(null)
        .messages({
            'date.min': 'La fecha programada no puede ser en el pasado'
        }),
    special_instructions: Joi.string()
        .max(1000)
        .allow(null, ''),
    payment_method: Joi.string()
        .valid('cash', 'card', 'transfer')
        .default('cash')
        .messages({
            'any.only': 'El método de pago debe ser cash, card o transfer'
        })
});

const updateOrderStatusSchema = Joi.object({
    status: Joi.string()
        .valid('pending', 'accepted', 'preparing', 'ready', 'on_delivery', 'delivered', 'cancelled', 'rejected')
        .required()
        .messages({
            'any.only': 'Estado inválido',
            'any.required': 'El estado es requerido'
        }),
    reason: Joi.string()
        .max(500)
        .allow(null, '')
        .when('status', {
            is: Joi.valid('rejected', 'cancelled'),
            then: Joi.required(),
            otherwise: Joi.optional()
        })
        .messages({
            'any.required': 'La razón es requerida para rechazar o cancelar un pedido'
        })
});

const orderFiltersSchema = Joi.object({
    status: Joi.string()
        .valid('pending', 'accepted', 'preparing', 'ready', 'on_delivery', 'delivered', 'cancelled', 'rejected'),
    delivery_type: Joi.string()
        .valid('delivery', 'pickup'),
    start_date: Joi.date(),
    end_date: Joi.date(),
    sort_order: Joi.string()
        .valid('ASC', 'DESC')
        .default('DESC'),
    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(50),
    offset: Joi.number()
        .integer()
        .min(0)
        .default(0),
    include_provider: Joi.boolean()
        .default(false),
    include_items: Joi.boolean()
        .default(false),
    lang: Joi.string()
        .valid('es', 'ru')
        .default('es')
});

const orderStatisticsSchema = Joi.object({
    start_date: Joi.date(),
    end_date: Joi.date(),
    group_by: Joi.string()
        .valid('day', 'week', 'month', 'year')
        .default('day')
});

module.exports = {
    createOrderSchema,
    updateOrderStatusSchema,
    orderFiltersSchema,
    orderStatisticsSchema
};
