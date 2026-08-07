import { Joi, Segments } from "celebrate";
import { isValidObjectId } from "mongoose";
import { CATEGORIES } from "../constants/index.js";

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message("Invalid id format") : value;
};

export const articleIdSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const getArticlesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    category: Joi.string()
      .valid(...CATEGORIES)
      .optional(),
    search: Joi.string().trim().allow(""),
  }),
};

export const createArticleSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(3).max(48).required(),
    desc: Joi.string().required(),
    article: Joi.string().required(),
    category: Joi.string()
      .valid(...CATEGORIES)
      .optional(),
  }),
};

export const updateArticleSchema = {
  ...articleIdSchema,
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(3).max(48),
    desc: Joi.string(),
    article: Joi.string(),
    category: Joi.string().valid(...CATEGORIES),
  }).min(1), // важливо: не дозволяємо порожнє тіло
};
