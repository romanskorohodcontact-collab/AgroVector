### Дизайн проекта
https://www.figma.com/design/WMbhpvgzfhwaeSUVPD2wim/%D0%90%D0%B3%D1%80%D0%BE%D0%92%D0%B5%D0%BA%D1%82%D0%BE%D1%80?node-id=0-1


# AgroRunok

Веб-платформа заявок на перевозку грузов и поиска транспорта.

## Структура репозитория

```
AgroRunok/
├── next/                  # Next.js application: frontend + server
├── docker-compose.yml     # Next.js + MongoDB
├── .env
├── .env.example
└── README.md
```

## Технологический стек

- Next.js (App Router) + TypeScript
- MongoDB + Mongoose
- Docker Compose

## Локальная разработка (без Docker)

Next.js запускается локально напрямую из папки `next`:

```bash
cd next
npm install
npm run dev
```

Приложение доступно по адресу http://localhost:3000

## Запуск через Docker Compose

MongoDB и Next.js запускаются в контейнерах:

```bash
docker compose up --build
```

- Next.js: http://localhost:3000
- MongoDB: mongodb://localhost:27017

Данные MongoDB хранятся в persistent volume.

## Файлы конфигурации

- `.env` — переменные окружения, используется и локально, и в Docker.
- `.env.example` — шаблон для `.env`.

## Статус

Базовая структура проекта реализована: Next.js приложение построено по слоям
`app/screens/widgets/features/entities/shared/server` внутри `next/src`,
настроено подключение к MongoDB, аутентификация по телефону/паролю и
CRUD-заявки на груз.
