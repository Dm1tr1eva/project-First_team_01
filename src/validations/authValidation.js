import { Joi, Segments } from "celebrate";

// .trim().lowercase() перед .email(): без цього " User@Example.com" (з пробілом)
// відхиляється валідацією як невалідний email, а "USER@..." і "user@..."
// проходять як два різні значення — тому Mongo знаходив різні записи
// для того самого юзера залежно від регістру при вводі.
export const registerSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(32).required(),
    email: Joi.string().trim().lowercase().email().max(64).required(),
    password: Joi.string().min(8).max(64).required(),
  }),
};

export const loginSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().required(),
  }),
};
