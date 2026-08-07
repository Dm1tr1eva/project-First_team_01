import createHttpError from "http-errors";
import { Article } from "../../models/index.js";
import { saveFileToCloudinary } from "../../utils/index.js";

export const createArticle = async (req, res, next) => {
  try {
    const { title, desc, article, category } = req.body;
    const { file } = req;

    const date = new Date().toISOString().split("T")[0];

    if (!file) {
      throw createHttpError(400, "Article image is required");
    }

    const imageUrl = await saveFileToCloudinary(file.buffer, "articles");

    const createdArticle = await Article.create({
      title,
      desc,
      article,
      img: imageUrl,
      date,
      category,
      ownerId: req.user._id,
    });

    return res.status(201).json({
      status: 201,
      message: "Article created successfully",
      data: createdArticle,
    });
  } catch (error) {
    next(error);
  }
};
