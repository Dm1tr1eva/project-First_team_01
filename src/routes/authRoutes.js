import { Router } from "express";
import { celebrate } from "celebrate";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { auth as ctrl } from "../controllers/index.js";
import { registerSchema, loginSchema } from "../validations/index.js";

const authRoutes = Router();

// Реєстрація нового користувача (public)
// upload перед celebrate: без нього поля multipart-форми не потраплять у req.body
// і валідація впаде. На JSON-запити multer не впливає, пропускає їх далі як є.
authRoutes.post("/register", upload.single("avatar"), celebrate(registerSchema), ctrl.register);

// Логін (public)
authRoutes.post("/login", celebrate(loginSchema), ctrl.login);

// Логаут (private)
authRoutes.post("/logout", authMiddleware, ctrl.logout);

// Перевірка активної сесії (private)
authRoutes.get("/session", authMiddleware, ctrl.sessionTru);

// Оновлення access/refresh токена (protected) — валідність refreshToken
// перевіряється всередині контролера, не через celebrate
authRoutes.post("/refresh", ctrl.refresh);

export default authRoutes;
