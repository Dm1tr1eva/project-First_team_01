import { Article } from "../../models/Article.js";
import createHttpError from "http-errors";
export const getArticleById = async (req, res, next) => {
  const { id } = req.params;
  const article = await Article.findById(id);
  if (!article) {
    throw createHttpError(404, "Article not found");
  }

  res.status(200).json({
    article,
  });
};
