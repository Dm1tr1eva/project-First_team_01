import createHttpError from "http-errors";
import { Article } from "../../models/index.js";

export const deleteArticle = async (req, res, next) => {
  const { id } = req.params;

  const article = await Article.findById(id);

  if (!article) {
    throw createHttpError(404, "Article not found");
  }

  if (article.ownerId.toString() !== req.user._id.toString()) {
    throw createHttpError(403, "You are not allowed to delete this article");
  }

  await Article.findByIdAndDelete(id);

  res.status(204).send();
};
