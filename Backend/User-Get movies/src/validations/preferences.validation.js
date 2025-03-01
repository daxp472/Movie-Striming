const Joi = require('joi');

const updatePreferencesSchema = Joi.object({
  preferredGenres: Joi.array()
    .items(Joi.string())
    .messages({
      'array.base': 'Preferred genres must be an array'
    }),
  language: Joi.string()
    .messages({
      'string.base': 'Language must be a string'
    }),
  subtitles: Joi.boolean()
    .messages({
      'boolean.base': 'Subtitles must be a boolean'
    }),
  autoplay: Joi.boolean()
    .messages({
      'boolean.base': 'Autoplay must be a boolean'
    }),
  notifications: Joi.boolean()
    .messages({
      'boolean.base': 'Notifications must be a boolean'
    })
});

module.exports = {
  updatePreferencesSchema
};