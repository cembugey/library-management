// src/validators/userValidator.ts

import Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
});
