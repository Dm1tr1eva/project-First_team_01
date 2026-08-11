import { Article } from "../../models/Article.js";

export const getArticles = async (req, res, next) => {
  const { page = 1, perPage = 10 } = req.query;

  const skip = (page - 1) * perPage;

  const articlesQuery = Article.find();

  const [totalItems, articles] = await Promise.all([
    articlesQuery.clone().countDocuments(),
    articlesQuery
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage)
      .populate("ownerId", "name avatarUrl"),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    page,
    perPage,
    totalItems,
    totalPages,
    articles,
  });
};
