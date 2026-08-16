import { Joi, Segments } from "celebrate";

// .trim().lowercase() перед .email(): без цього " User@Example.com" (з пробілом)
// відхиляється валідацією як невалідний email, а "USER@..." і "user@..."
// проходять як два різні значення — тому Mongo знаходив різні записи
// для того самого юзера залежно від регістру при вводі.
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
      .lowercase()
      .max(64)
      .pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
      .required(),

    password: Joi.string()
      .trim()
      .min(8)
      .max(64)
      .pattern(/\S/)
      .custom((value, helpers) => {
        if (Buffer.byteLength(value, "utf8") > 72) {
          return helpers.error("string.maxBytes");
        }

        return value;
      })
      .messages({
        "string.maxBytes": "Password must not exceed 72 bytes",
      })
      .required(),
  }),
};

export const loginSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().trim().required(),
  }),
};
