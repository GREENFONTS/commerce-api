import Joi from 'joi';

export const addToCartSchema = Joi.object({
  productId: Joi.string().required().messages({
    'string.empty': 'productId is required',
    'any.required': 'productId is required',
  }),
  quantity: Joi.number().integer().positive().required().messages({
    'number.base': 'quantity must be a number',
    'number.integer': 'quantity must be an integer',
    'number.positive': 'quantity must be positive',
    'any.required': 'quantity is required',
  }),
});

export const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().positive().required().messages({
    'number.base': 'quantity must be a number',
    'number.integer': 'quantity must be an integer',
    'number.positive': 'quantity must be positive',
    'any.required': 'quantity is required',
  }),
});

export const checkoutSchema = Joi.object({
  email: Joi.string().email().optional().messages({
    'string.email': 'email must be a valid email address',
  }),
  name: Joi.string().optional().messages({
    'string.base': 'name must be a string',
  }),
  shippingAddress: Joi.string().optional().messages({
    'string.base': 'shippingAddress must be a string',
  }),
  notes: Joi.string().optional().messages({
    'string.base': 'notes must be a string',
  }),
}).min(0); 

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').required().messages({
    'any.only': 'status must be one of: pending, processing, shipped, delivered, cancelled',
    'any.required': 'status is required',
  }),
});

