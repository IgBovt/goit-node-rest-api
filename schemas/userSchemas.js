import Joi from "joi";

const validSubscriptions = ["starter", "pro", "business"];

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

export const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...validSubscriptions)
    .required(),
});
