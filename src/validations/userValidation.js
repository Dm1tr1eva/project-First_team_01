import { Joi, Segments } from "celebrate";

export const updateUserSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(32),
    email: Joi.string().email().max(64),
  }).min(1), // важливо: не дозволяємо порожнє тіло
};

export const getUsersSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(20),
  }),
};
