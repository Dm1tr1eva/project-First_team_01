import createHttpError from "http-errors";
import { User } from "../../models/index.js";

export const updateUser = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;
        const { name, email } = req.body;


if (email) {
const existingUser = await User.findOne({ email, _id: { $ne: userId } });
if (existingUser) {
            throw createHttpError(409, "Email already in use");
};
};

 const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...(name && { name }), ...(email && { email }) },
      { new: true, runValidators: true },
    );
 
    if (!updatedUser) {
      throw createHttpError(404, "User not found");
    }
 
    res.status(200).json({
      status: 200,
      message: "User updated successfully",
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatarUrl: updatedUser.avatarUrl,
      },
    });
  } catch (error) {
    next(error);
  };
};
