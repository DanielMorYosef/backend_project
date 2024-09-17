import Joi from "joi";

const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,30}$/;

export const UserLogin = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const UserSignup = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().regex(passwordRegex),
  firstName: Joi.string().required().min(2).max(20),
  lastName: Joi.string().required().min(2).max(20),
  phone: Joi.string().required().min(9).max(15),
  address: Joi.object({
    state: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    street: Joi.string().required(),
    houseNumber: Joi.string().required(),
  }),
  isBusiness: Joi.boolean().required(),
  isAdmin: Joi.boolean(),
});
