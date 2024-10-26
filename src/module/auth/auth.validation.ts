import * as joi from 'joi';

export const signupSchema = {
  body: joi.object({
    name: joi.string().required(),
    email: joi.string().email().lowercase().required(),
    password: joi
      .string()
      .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{5,}$'))
      .required()
      .messages({
        'string.pattern.base': `Password must be at least 5 characters long, include at least one capital letter and one special character`,
      }),
  }),
};

export const signinSchema = {
  body: joi.object({
    email: joi.string().email().lowercase().required(),
    password: joi.string().required(),
  }),
};

export const refreshTokenSchema = {
  body: joi.object({
    refresh_token: joi.string().required(),
  }),
};