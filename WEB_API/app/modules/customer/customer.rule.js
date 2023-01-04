const Joi = require("joi");

const ruleCreateOrUpdate = {
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  gender: Joi.number().valid(0, 1).required(),
  birthday: Joi.string().regex(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/),
  email: Joi.string().email().required(),
  phone_number: Joi.string(),
  address: Joi.string(),
};

const ruleResetPassword = {
  password: Joi.string().required(),
  password_confirm: Joi.string().required().valid(Joi.ref("password")),
};
const ruleChangePasswordCustomer = {
  old_password: Joi.string().required(),
  new_password: Joi.string().required(),
  re_password: Joi.string().required().valid(Joi.ref("new_password")),
};

const validateRules = {
  createCustomer: {
    body: Object.assign({}, ruleCreateOrUpdate, ruleResetPassword, {
      customer_name: Joi.required(),
    }),
  },
  updateCustomer: {
    body: ruleCreateOrUpdate,
  },
  resetPassword: {
    body: ruleResetPassword,
  },
  changePasswordCustomer: {
    body: ruleChangePasswordCustomer,
  },
};

module.exports = validateRules;