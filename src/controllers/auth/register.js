import createHttpError from "http-errors";
import { User } from "../../models/User.js";
import { Session } from "../../models/Session.js";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { FIFTEEN_MINUTES, ONE_DAY } from "../../constants/session.js";

export const createSession = async (userId) => {
  const accessToken = crypto.randomUUID();
  const refreshToken = crypto.randomUUID();
  return Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

export const setSessionCookies = (res, session) => {
  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  };

  res.cookie("accessToken", session.accessToken, {
    ...cookieOptions,
    maxAge: FIFTEEN_MINUTES,
  });

  res.cookie("refreshToken", session.refreshToken, {
    ...cookieOptions,
    maxAge: ONE_DAY,
  });

  res.cookie("sessionId", session._id.toString(), {
    ...cookieOptions,
    maxAge: ONE_DAY,
  });
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw createHttpError(400, "Email is already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const session = await createSession(newUser._id);

  setSessionCookies(res, session);

  res.status(201).json({
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    avatarUrl: newUser.avatarUrl,
  });
};
