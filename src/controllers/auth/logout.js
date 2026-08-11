import { Session } from "../../models/Session.js";

export const logout = async (req, res, next) => {
  const { sessionId } = req.cookies;
  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }
  res.clearCookie("sessionId");
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(204).send();
};

