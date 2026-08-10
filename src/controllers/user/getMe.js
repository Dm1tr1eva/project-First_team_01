import createHttpError from "http-errors";
import { Session, User } from "../../models/index.js";

export const getMe = async (req, res) => {
  const { sessionId } = req.cookies;

  if (!sessionId) {
    throw createHttpError(401, "Session not found");
  }

  const session = await Session.findById(sessionId);

  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  if (session.refreshTokenValidUntil < new Date()) {
    await Session.findByIdAndDelete(sessionId);

    throw createHttpError(401, "Session expired");
  }

  const user = await User.findById(session.userId);

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
};
