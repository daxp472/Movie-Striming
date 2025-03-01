const Joi = require('joi');

const updateProgressSchema = Joi.object({
  progress: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.min': 'Progress cannot be negative',
      'any.required': 'Progress is required'
    }),
  completed: Joi.boolean()
    .default(false)
});

module.exports = {
  updateProgressSchema
};
