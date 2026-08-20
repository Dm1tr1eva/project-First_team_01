import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import { connectMongoDB } from "./db/connectToMongoDB.js";
import { logger } from "./middleware/logger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" with { type: "json" };

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import categoriesRoutes from "./routes/categoriesRoutes.js";

// Без цього обрив звʼязку з Atlas (чи будь-який неспійманий проміс/виняток
// поза Express-обробником) просто мовчки вбиває процес без жодного сліду
// в логах — Render рестартує контейнер, і причина падіння губиться
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 3000;

// Render стоїть за проксі — без цього express-rate-limit (і будь-що інше,
// що дивиться на req.ip) бачить лише внутрішню IP Render, тобто всіх
// відвідувачів як одного клієнта
app.set("trust proxy", 1);

// Локальні адреси фронтенду — щоб команді не треба було заповнювати CLIENT_URL для дев-режиму
const DEV_ORIGINS = ["http://localhost:3000", "http://localhost:3001"];

// CLIENT_URL може містити кілька адрес через кому (напр. прод + прев'ю-деплой).
// Слеш у кінці зрізаємо: браузер надсилає Origin без нього, інакше порівняння не збіглося б
const allowedOrigins = [
  ...(process.env.CLIENT_URL ?? "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean),
  ...(process.env.NODE_ENV === "production" ? [] : DEV_ORIGINS),
];

// Порожній CLIENT_URL у проді = allowedOrigins порожній = CORS мовчки
// блокує геть усі браузерні запити, а сервер при цьому відповідає 200 і
// виглядає в логах живим — падати одразу зрозуміліше, ніж ловити це постфактум
if (process.env.NODE_ENV === "production" && allowedOrigins.length === 0) {
  console.error("CLIENT_URL is not set in production — refusing to start.");
  process.exit(1);
}

app.use(logger);
app.use(helmet());
app.use(
  express.json({
    type: ["application/json", "application/vnd.api+json"],
    limit: "100kb",
  }),
);
app.use(
  cors({
    // credentials: true не працює з origin: "*" — браузер вимагає конкретну адресу
    origin: (origin, callback) => {
      // Запити без заголовка Origin (curl, Postman, сервер-до-сервера) не є CORS-запитами
      if (!origin) return callback(null, true);

      return callback(null, allowedOrigins.includes(origin));
    },
    credentials: true,
  }),
);
app.use(cookieParser());

// Мінімальний CSRF-захист (BE-06): CORS-колбек вище блокує лише читання
// відповіді чужим origin, а не сам запит, якщо він "простий" (без кастомних
// заголовків — POST multipart/form-data чи text/plain такий і є, преflight
// не йде). Кастомний заголовок форсує preflight, який CORS уже коректно
// відхиляє для чужого origin. Легітимний виклик (наш же BFF-проксі з Vercel
// на Render — не браузер, CORS на нього не діє) додає цей заголовок сам,
// див. proxyRequest.ts/api.ts на фронті.
function requireCustomHeaderOnMutations(req, res, next) {
  const isSafeMethod = req.method === "GET" || req.method === "HEAD";

  if (isSafeMethod || req.get("X-Requested-With") === "XMLHttpRequest") {
    return next();
  }

  return res.status(403).json({ message: "Missing required header" });
}

app.use(requireCustomHeaderOnMutations);

// Rate limiting (BE-07): без нього /auth/login відкритий для брутфорсу,
// /auth/register — для спаму акаунтами, POST /articles — для заливання
// Cloudinary до вичерпання квоти.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again later" },
});

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later" },
});

app.use(globalLimiter);

app.use(
  "/api-docs",
  swaggerUi.serve,
  // withCredentials: щоб "Try it out" гарантовано слав сесійні куки,
  // не покладаючись на дефолт fetch
  swaggerUi.setup(swaggerDocument, { swaggerOptions: { withCredentials: true } }),
);

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/categories", categoriesRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
