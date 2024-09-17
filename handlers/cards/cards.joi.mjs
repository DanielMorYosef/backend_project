import Joi from "joi";

export default function validateCard(card) {
  const schema = Joi.object({
    title: Joi.string().required(),
    subtitle: Joi.string().required(),
    description: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    address: Joi.object({
      state: Joi.string().required(),
      country: Joi.string().required(),
      city: Joi.string().required(),
      street: Joi.string().required(),
      houseNumber: Joi.number().required(),
      zip: Joi.string().required(),
    }).required(),
    image: Joi.object({
      url: Joi.string().uri().required(),
      alt: Joi.string().required(),
    }).required(),
    web: Joi.string().uri().required(),
    user_id: Joi.string().required(),
  });

  const { error, value } = schema.validate(card);
  if (error) {
    throw new Error(`Validation error: ${error.message}`);
  }
  return value;
}
