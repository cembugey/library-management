// src/validators/bookValidator.ts

import Joi from 'joi';

export const createBookSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
});

export const returnBookSchema = Joi.object({
  score: Joi.number().integer().min(1).max(10).required(),
});
