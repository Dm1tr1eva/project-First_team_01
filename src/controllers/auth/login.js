import createHttpError from "http-errors";
import { Session, User } from "../../models/index.js";
import bcrypt from "bcrypt";
import { createSession, setSessionCookies } from "../../services/session.js";
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, "Invalid credentials");
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw createHttpError(401, "Invalid credentials");
  }
  await Session.deleteOne({ userId: user._id });

  const session = await createSession(user._id);

  setSessionCookies(res, session);

  res.status(200).json(user);
};
