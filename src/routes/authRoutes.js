import { Router } from "express";
import { celebrate } from "celebrate";

// Імпорт контролерів auth (розкоментувати, коли почнете писати код):
import { auth as ctrl } from "../controllers/index.js";
import { registerSchema, loginSchema } from "../validations/index.js";

const authRoutes = Router();

// Реєстрація нового користувача (public)
authRoutes.post("/register", celebrate(registerSchema), ctrl.register);

// Логін (public)
authRoutes.post("/login", celebrate(loginSchema), ctrl.login);

// Логаут (private, потрібен authMiddleware)
// authRoutes.post("/logout", ctrl.logout);

// Оновлення access/refresh токена (protected)
// authRoutes.post("/refresh", ctrl.refresh);

export default authRoutes;
