import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string(),
  phone: Joi.string(),
}).or("name", "email", "phone");

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
