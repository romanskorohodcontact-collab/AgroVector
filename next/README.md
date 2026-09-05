# Next.js Application — AgroRunok

Backend и frontend платформы заявок на перевозку внутри одного Next.js приложения.
Модульный монолит: код приложения находится в `src/`.

## Запуск локально

```bash
npm install
npm run dev
```

Приложение доступно по адресу http://localhost:3000

## Структура src/

- `app/` — Next.js routing, layouts, providers, API Route Handlers
- `pages/` — полные экраны приложения
- `widgets/` — крупные блоки интерфейса
- `features/` — пользовательские действия и сценарии
- `entities/` — доменные сущности
- `shared/` — независимый от домена переиспользуемый код
- `server/` — серверная часть
  - `db/` — подключение к MongoDB и модели
  - `modules/` — бизнес-модули
  - `services/` — инфраструктура и внешние интеграции
  - `repositories/` — работа с базой данных
  - `validators/` — серверная валидация
