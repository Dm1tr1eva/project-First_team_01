import { User } from "../../models/User.js";

export const getUsers = async (req, res, next) => {
  const { page = 1, perPage = 20 } = req.query;

  const skip = (page - 1) * perPage;

  const usersQuery = User.find().select("name avatarUrl articlesAmount");

  const [totalItems, users] = await Promise.all([
    usersQuery.clone().countDocuments(),
    usersQuery.skip(skip).limit(perPage),
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
