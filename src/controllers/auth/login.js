import createHttpError from "http-errors";
import { User } from "../../models/User.js";
import bcrypt from "bcrypt";
import { Session } from "../../models/Session.js";
import { createSession, setSessionCookies } from "../../services/session.js";

export const login = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw createHttpError(401, "Invalid credentials");
  }

  const isValidPassword = await bcrypt.compare(req.body.password, user.password);
  console.log(req.body.password, user.password);

  if (!isValidPassword) {
    throw createHttpError(401, "Invalid credentials");
  }
  await Session.deleteOne({ userId: user._id });

  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);
  res.status(200).json({ user });
};
