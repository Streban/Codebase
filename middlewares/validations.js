const joi = require("joi");
const createCredentialsSchema = joi.object({
  _id: joi.string().optional(),
  server: joi.string().trim(true).required(),
  country: joi.string().trim(true).required(),
  type: joi.string().trim(true).required(),
  businessId: joi.string().required(),
  port: joi.number().integer().required(),
  auth: joi.object({
    user: joi.string().required(),
    pass: joi.string().required(),
  }),
  secure: joi.boolean().default(false),
  primary: joi.boolean().default(false)
});

const updateCredentialsSchema = joi.object({
  _id: joi.string().optional(),
  server: joi.string().trim(true),
  country: joi.string().trim(true),
  type: joi.string().trim(true),
  businessId: joi.string(),
  port: joi.number().integer(),
  auth: joi.object({
    user: joi.string(),
    pass: joi.string(),
  }),
  secure: joi.boolean().default(false),
  primary: joi.boolean().default(false)
});

const validateCredentials = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    console.log("--- validation error ---");
    console.log(error);
    console.log("--- validation error ---");
    return res.status(422).json({ message: error.message });
  }

  next();
};

module.exports = {
  validateCredentials,
  createCredentialsSchema,
  updateCredentialsSchema
};
