const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required()
    .messages({
      'string.email': 'Debe ser un email válido',
      'string.empty': 'El email es requerido',
      'any.required': 'El email es requerido'
    }),
  password: Joi.string()
    .min(8)
    .max(100)
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$'))
    .messages({
      'string.min': 'La contraseña debe tener al menos 8 caracteres',
      'string.max': 'La contraseña no puede exceder 100 caracteres',
      'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
      'string.empty': 'La contraseña es requerida',
      'any.required': 'La contraseña es requerida'
    }),
  first_name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres',
      'string.empty': 'El nombre es requerido',
      'any.required': 'El nombre es requerido'
    }),
  last_name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'El apellido debe tener al menos 2 caracteres',
      'string.max': 'El apellido no puede exceder 100 caracteres',
      'string.empty': 'El apellido es requerido',
      'any.required': 'El apellido es requerido'
    }),
  phone: Joi.string()
    .pattern(new RegExp('^[0-9+\\s\\-\\(\\)]{10,20}$'))
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Número de teléfono inválido'
    }),
  role: Joi.string()
    .valid('customer', 'provider', 'admin')
    .default('customer'),
  language: Joi.string()
    .valid('es', 'ru')
    .default('es')
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Debe ser un email válido',
      'string.empty': 'El email es requerido',
      'any.required': 'El email es requerido'
    }),
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'La contraseña es requerida',
      'any.required': 'La contraseña es requerida'
    })
});

const updateProfileSchema = Joi.object({
  first_name: Joi.string()
    .min(2)
    .max(100),
  last_name: Joi.string()
    .min(2)
    .max(100),
  phone: Joi.string()
    .pattern(new RegExp('^[0-9+\\s\\-\\(\\)]{10,20}$'))
    .allow(null, ''),
  language: Joi.string()
    .valid('es', 'ru'),
  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$'))
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'string.empty': 'El refresh token es requerido',
      'any.required': 'El refresh token es requerido'
    })
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  refreshTokenSchema
};
