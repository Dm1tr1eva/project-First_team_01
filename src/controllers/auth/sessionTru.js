import createHttpError from "http-errors";
import { Session } from "../../models/index.js";

export const sessionTru = async (req, res) => {
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

  res.status(200).json({
    success: true,
  });
};
