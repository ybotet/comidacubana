const Joi = require('joi');

const createCategorySchema = Joi.object({
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
    .max(500),
  description_ru: Joi.string()
    .allow(null, '')
    .max(500),
  icon: Joi.string()
    .allow(null, '')
    .max(100),
  color: Joi.string()
    .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .allow(null, '')
    .messages({
      'string.pattern.base': 'El color debe ser un código hexadecimal válido (ej: #FF0000)'
    }),
  order: Joi.number()
    .integer()
    .min(0)
    .default(0),
  is_active: Joi.boolean()
    .default(true)
});

const updateCategorySchema = Joi.object({
  name_es: Joi.string()
    .min(2)
    .max(100),
  name_ru: Joi.string()
    .min(2)
    .max(100),
  description_es: Joi.string()
    .allow(null, '')
    .max(500),
  description_ru: Joi.string()
    .allow(null, '')
    .max(500),
  icon: Joi.string()
    .allow(null, '')
    .max(100),
  color: Joi.string()
    .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .allow(null, '')
    .messages({
      'string.pattern.base': 'El color debe ser un código hexadecimal válido (ej: #FF0000)'
    }),
  order: Joi.number()
    .integer()
    .min(0),
  is_active: Joi.boolean()
});

module.exports = {
  createCategorySchema,
  updateCategorySchema
};
