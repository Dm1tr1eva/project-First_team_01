import { isValidObjectId } from "mongoose";
import { Session } from "../../models/index.js";
import { getCookieOptions } from "../../services/session.js";

export const logout = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  // Звірка по refreshToken (24 год), а не accessToken (15 хв) — інакше
  // accessToken часто вже мертвий у браузері саме в момент виходу, і
  // перевірка володіння ніколи не спрацює. sessionId сам по собі не секрет
  // (звичайний Mongo ObjectId), тому без refreshToken видаляти не можна —
  // інакше будь-хто, хто вгадав чужий sessionId, міг би розлогінити чужого.
  if (sessionId && isValidObjectId(sessionId) && refreshToken) {
    await Session.deleteOne({ _id: sessionId, refreshToken });
  }

  // Прапорці мають збігатися з тими, з якими куки ставилися: у проді це
  // secure + sameSite "none". Без них браузер не зіставить куку з наявною
  // і не видалить її — сесія зникне з бази, а куки лишаться в браузері.
  const cookieOptions = getCookieOptions();

  res.clearCookie("sessionId", cookieOptions);
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  res.status(204).send();
};
