import { User } from "../../models/User.js";

export const getUsers = async (req, res, next) => {
  const { page = 1, perPage = 20 } = req.query;

  const skip = (page - 1) * perPage;

  const usersQuery = User.find().select("name avatarUrl articlesAmount");

  const [totalItems, users] = await Promise.all([
    usersQuery.clone().countDocuments(),
    // Сортування обовʼязкове, і саме з _id: сідові користувачі імпортувались
    // напряму, тож createdAt у них немає. Без тайбрейкера вони всі — одна нічия,
    // порядок у ній Mongo не гарантує, і сторінки дублюють та гублять авторів.
    // Той самий баг щойно ловили в списках статей.
    usersQuery.sort({ createdAt: -1, _id: -1 }).skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    page,
    perPage,
    totalItems,
    totalPages,
    users,
  });
};
