import Joi from "joi";

export const createUserSchema = Joi.object({
  email: Joi.string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .lowercase(),
  password: Joi.string()
    .min(7)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required(),
});
