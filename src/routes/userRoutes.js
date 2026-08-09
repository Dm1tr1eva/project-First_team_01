import { Router } from "express";
import { celebrate } from "celebrate";
import { user as ctrl } from "../controllers/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { articleIdSchema } from "../validations/index.js";
import { uploadCloudinary } from "../middleware/uploadMiddleware.js";
import { updateUserSchema } from "../validations/userValidation.js";

const userRoutes = Router();

userRoutes.get("/:id", ctrl.getUserInfo);

userRoutes.patch("/me", authMiddleware, celebrate(updateUserSchema), ctrl.updateUser);

userRoutes.patch(
  "/me/avatar",
  authMiddleware,
  uploadCloudinary.single("avatar"),
  ctrl.updateAvatar
);

userRoutes.get("/:id/articles", celebrate(articleIdSchema), ctrl.getUserArticles);

userRoutes.get("/me/saved", authMiddleware, ctrl.getSavedArticles);

userRoutes.post("/me/saved/:id", authMiddleware, celebrate(articleIdSchema), ctrl.addSavedArticle);

userRoutes.delete(
  "/me/saved/:id",
  authMiddleware,
  celebrate(articleIdSchema),
  ctrl.removeSavedArticle
);

export default userRoutes;