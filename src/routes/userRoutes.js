import { Router } from "express";
import { celebrate } from "celebrate";
import { user as ctrl } from "../controllers/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { articleIdSchema } from "../validations/index.js";

// Імпорт контролерів user (розкоментувати, коли почнете писати код):
// import { updateUserSchema } from "../validations/index.js";

const userRoutes = Router();

// Отримати список користувачів (public)
userRoutes.get("/", ctrl.getUsers);

// Отримати інфо про користувача за id (public)
userRoutes.get("/:id", ctrl.getUserInfo);

// Оновити дані користувача (private)
// userRoutes.patch("/me", celebrate(updateUserSchema), ctrl.updateUser);

// Додати/змінити аватар (private)
// userRoutes.patch("/me/avatar", ctrl.updateAvatar);

// Отримати статті користувача (public)
// userRoutes.get("/:id/articles", ctrl.getUserArticles);

// Отримати збережені статті (private)
// userRoutes.get("/me/saved", ctrl.getSavedArticles);

// Додати статтю у збережені (private)
userRoutes.post("/me/saved/:id", authMiddleware, celebrate(articleIdSchema), ctrl.addSavedArticle);

// Видалити статтю зі збережених (private)
userRoutes.delete(
  "/me/saved/:id",
  authMiddleware,
  celebrate(articleIdSchema),
  ctrl.removeSavedArticle,
);

export default userRoutes;
