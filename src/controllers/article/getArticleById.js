import { Article } from "../../models/Article.js";
export const getArticleById = async (req, res, next) => {
  const { id } = req.params;

  const article = await Article.findById(id);

  res.status(200).json({
    article,
  });
};
