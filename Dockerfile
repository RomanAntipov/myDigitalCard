# === Этап 1: Сборка приложения ===
FROM node:24-alpine AS builder
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем ВСЕ зависимости (включая devDependencies для сборки)
RUN npm ci

# Копируем исходный код и контракт базы данных
COPY . .

# Генерируем типы и JSON-контракт через contract emit
RUN npx prisma contract emit

# Собираем NestJS проект в папку dist
RUN npm run build

# === Этап 2: Финальный легковесный образ ===
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Копируем только файлы манифестов
COPY package*.json ./

# Устанавливаем только production-зависимости (без лишнего мусора)
RUN npm ci --only=production

# Копируем скомпилированное приложение из этапа builder
COPY --from=builder /app/dist ./dist
# Копируем сгенерированный клиент Prisma, чтобы ORM работала внутри контейнера
COPY --from=builder /app/src/prisma ./src/prisma

# Копируем файл конфигурации Призмы.
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Открываем порт для NestJS
EXPOSE 3000

# Запуск приложения
CMD ["node", "--import", "tsx", "--experimental-detect-module", "dist/main.js"]
