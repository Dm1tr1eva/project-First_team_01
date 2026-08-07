import { Router } from "express";
import { celebrate } from "celebrate";

// Імпорт контролерів article (розкоментувати, коли почнете писати код):
import { article as ctrl } from "../controllers/index.js";
import { getArticlesSchema, articleIdSchema, createArticleSchema, updateArticleSchema } from "../validations/index.js";

const articleRoutes = Router();

// Список статей з пагінацією (public)
// articleRoutes.get("/", celebrate(getArticlesSchema), ctrl.getArticles);

// Статті з фільтрами/сортуванням (public, additional)
// articleRoutes.get("/filter", ctrl.getArticlesFiltered);

// Отримати статтю за id (public)
// articleRoutes.get("/:id", celebrate(articleIdSchema), ctrl.getArticleById);

// Створити статтю (private)
articleRoutes.post("/", celebrate(createArticleSchema), ctrl.createArticle);

// Редагувати статтю (private)
articleRoutes.patch("/:id", celebrate(updateArticleSchema), ctrl.updateArticle);

// Видалити статтю (private)
// articleRoutes.delete("/:id", celebrate(articleIdSchema), ctrl.deleteArticle);

export default articleRoutes;
