const Joi = require('joi');
const { ApiError } = require('../utils/apiError');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map(detail => detail.message);
    return next(new ApiError(400, 'Validation Error', errors));
  }

  next();
};

module.exports = {
  validate
};