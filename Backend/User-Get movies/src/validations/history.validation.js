const Joi = require('joi');

const addToHistorySchema = Joi.object({
  movieId: Joi.string()
    .required()
    .messages({
      'any.required': 'Movie ID is required'
    }),
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
  addToHistorySchema
};