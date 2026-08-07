import { Router } from "express";

// Імпорт контролерів categories (розкоментувати, коли почнете писати код):
// import { categories as ctrl } from "../controllers/index.js";

const categoriesRoutes = Router();

// Список категорій: popular, general (public, additional)
// categoriesRoutes.get("/", ctrl.getCategories);

export default categoriesRoutes;
