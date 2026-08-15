import { Joi, Segments } from "celebrate";

export const registerSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(32)
      .pattern(/^(?=.*[A-Za-zА-Яа-яІіЇїЄєҐґ])[A-Za-zА-Яа-яІіЇїЄєҐґ0-9\s'-]+$/)
      .required(),

    email: Joi.string()
      .trim()
      .max(64)
      .pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
      .required(),

    password: Joi.string().trim().min(8).max(64).pattern(/\S/).required(),
  }),
};

export const loginSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};
