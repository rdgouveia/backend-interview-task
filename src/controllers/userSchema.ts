import Joi from "joi";

export const createUserBody = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string()
    .pattern(
      new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/
      )
    )
    .required(),
  group: Joi.string().valid("admin", "user").required(),
});

export const pagination = Joi.object({
  page: Joi.number().required(),
  limit: Joi.number().required(),
});

export const editUserQuery = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
});

export const editUserBody = Joi.object({
  name: Joi.string().optional(),
  group: Joi.string().valid("admin", "user").optional(),
});
