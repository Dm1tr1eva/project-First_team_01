
import { User } from "../../models/User.js";

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Будь ласка, виберіть фото" });
    }

    const avatarUrl = req.file.path;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarUrl: avatarUrl },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "Фото успішно завантажено",
      data: {
        avatarUrl: avatarUrl,
      },
    });
  } catch (error) {
    console.error("Помилка завантаження аватара:", error);
    next(error);
  }
};