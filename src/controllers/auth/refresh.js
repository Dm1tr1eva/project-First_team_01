import crypto from "node:crypto";
import { Session } from "../../models/Session.js";

const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000;
const REFRESH_TOKEN_LIFETIME = 30 * 24 * 60 * 60 * 1000;

export const refresh = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies ?? {};

    if (!sessionId || !refreshToken) {
      return res.status(401).json({
        message: "Session not found",
      });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(401).json({
        message: "Session not found",
      });
    }

    if (session.refreshToken !== refreshToken) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    if (session.refreshTokenValidUntil < new Date()) {
      await Session.findByIdAndDelete(sessionId);

      return res.status(401).json({
        message: "Refresh token expired",
      });
    }

    const newAccessToken = crypto.randomBytes(30).toString("base64");
    const newRefreshToken = crypto.randomBytes(30).toString("base64");

    session.accessToken = newAccessToken;
    session.refreshToken = newRefreshToken;

    session.accessTokenValidUntil = new Date(
      Date.now() + ACCESS_TOKEN_LIFETIME,
    );

    session.refreshTokenValidUntil = new Date(
      Date.now() + REFRESH_TOKEN_LIFETIME,
    );

    await session.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    res.cookie("sessionId", session._id.toString(), {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    return res.status(200).json({
      status: 200,
      message: "Successfully refreshed a session!",
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};