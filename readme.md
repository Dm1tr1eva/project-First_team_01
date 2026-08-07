# Harmoniq — Backend

Бекенд для проєкту Harmoniq (Node.js + Express + MongoDB).

## Стек

- Node.js, Express 5
- MongoDB + Mongoose
- Аутентифікація на сесіях (колекція `Session`, без JWT)
- `celebrate` (Joi) — валідація запитів
- `multer` + Cloudinary — завантаження зображень
- `pino-http` — логування
- ESLint + Prettier

## Швидкий старт

1. Встановити залежності:

   ```bash
   npm install
   ```

2. Скопіювати `.env.example` в `.env` і заповнити значення:

   ```bash
   cp .env.example .env
   ```

3. Запустити у dev-режимі (з автоперезапуском):

   ```bash
   npm run dev
   ```

Сервер підніметься на `http://localhost:3000` (порт з `PORT` в `.env`).

## Змінні оточення

| Змінна                  | Опис                                                          |
| ----------------------- | ------------------------------------------------------------- |
| `PORT`                  | Порт сервера (за замовчуванням 3000)                          |
| `NODE_ENV`              | `development` / `production`                                  |
| `MONGO_URL`             | Рядок підключення до MongoDB Atlas                            |
| `CLIENT_URL`            | Адреса фронтенду — для CORS (заповнити, коли з'явиться фронт) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud name                                         |
| `CLOUDINARY_API_KEY`    | Cloudinary API Key                                            |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret                                         |

## Структура проєкту

```
src/
  constants/     — спільні константи (CATEGORIES тощо)
  controllers/   — по папці на домен (auth/user/article/categories),
                   у кожній — файл на ендпоінт + index.js-барабан
  db/            — підключення до MongoDB
  middleware/    — logger, authMiddleware, uploadMiddleware, error/notFound handlers
  models/        — Mongoose-моделі (User, Article, Session)
  routes/        — Express-роутери, по одному на домен
  services/      — бізнес-логіка (заповнюється по ходу роботи)
  utils/         — допоміжні функції (saveFileToCloudinary тощо)
  validations/   — celebrate/Joi-схеми, по домену
  server.js      — точка входу
```

## Як додати новий ендпоінт

1. Реалізувати логіку в `controllers/<domain>/<endpointName>.js` (файл-заглушка вже створений).
2. За потреби додати/доповнити Joi-схему в `validations/<domain>Validation.js`.
3. У відповідному файлі `routes/<domain>Routes.js` розкоментувати рядок з потрібним ендпоінтом (імпорт контролера та схеми вже підготовлені коментарями зверху файлу).

Кожен ендпоінт — окремий рядок у роутері й окремий файл контролера, тому паралельна робота декількох людей в одних і тих самих файлах не призводить до конфліктів при мерджі.

## Скрипти

| Команда          | Що робить                     |
| ---------------- | ----------------------------- |
| `npm run dev`    | Запуск у dev-режимі (nodemon) |
| `npm start`      | Запуск у продакшн-режимі      |
| `npm run lint`   | Перевірка коду ESLint         |
| `npm run format` | Автоформатування Prettier     |

## Git-flow

- Гілки від `main`: `feature/<назва>`, `fix/<назва>`.
- Пул-реквест в `main`, мінімум одне рев'ю перед мерджем.
- Не пушити напряму в `main`.
