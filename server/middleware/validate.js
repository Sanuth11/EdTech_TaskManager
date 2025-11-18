// simple Joi validator middleware factory
const Joi = require("joi");

function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.validate(req.body, { abortEarly: false, allowUnknown: false });
    if (result.error) {
      result.error.isJoi = true;
      return next(result.error);
    }
    req.validatedBody = result.value;
    next();
  };
}

module.exports = { validateBody };
