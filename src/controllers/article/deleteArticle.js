import createHttpError from "http-errors";
import { v2 as cloudinary } from "cloudinary";
import { Article, User } from "../../models/index.js";

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
  await User.updateMany({ savedArticles: id }, { $pull: { savedArticles: id } });

  if (article.img) {
    try {
      const publicId = article.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`articles/${publicId}`);
    } catch (cleanupError) {
      console.warn("Не вдалося видалити зображення статті:", cleanupError.message);
    }
  }

  res.status(204).send();
};
