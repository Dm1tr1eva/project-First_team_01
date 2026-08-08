import { Router } from "express";
import { celebrate } from "celebrate";

// Імпорт контролерів user (розкоментувати, коли почнете писати код):
import { user as ctrl } from "../controllers/index.js";
// import { updateUserSchema } from "../validations/index.js";

const userRoutes = Router();

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
// userRoutes.post("/me/saved/:articleId", ctrl.addSavedArticle);

// Видалити статтю зі збережених (private)
// userRoutes.delete("/me/saved/:articleId", ctrl.removeSavedArticle);

export default userRoutes;
