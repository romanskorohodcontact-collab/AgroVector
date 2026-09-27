import mongoose from "mongoose";
import { ForumThreadModel } from "./models/forum-thread";
import { ForumPostModel } from "./models/forum-post";

const MONGODB_URI =
  process.env.DATABASE_URL ?? "mongodb://127.0.0.1:27017/agrorunok";

interface SeedPost {
  authorName: string;
  text: string;
  at: string;
}

interface SeedThread {
  section: "discussion" | "platform-issues" | "proposals" | "support";
  title: string;
  body: string;
  authorName: string;
  tags: string[];
  isPinned?: boolean;
  isClosed?: boolean;
  viewsCount: number;
  createdAt: string;
  posts: SeedPost[];
}

const threads: SeedThread[] = [
  {
    section: "discussion",
    title: "Зерновозы: какой полуприцеп выбрать под 32 т?",
    body: "Коллеги, подбираю полуприцеп-зерновоз под перевозку 32 т. Рассматриваю самосвальный и классический вариант с разгрузкой через люки. Что предпочитаете под длинные маршруты между элеваторами? Интересуют сроки окупаемости и расход топлива.",
    authorName: "Павел Белов",
    tags: ["зерновозы", "полуприцеп"],
    isPinned: true,
    viewsCount: 345,
    createdAt: "2026-09-12T14:32:00",
    posts: [
      {
        authorName: "Олег Дроздов",
        text: "По опыту — самосвальный полуприцеп удобнее на коротких плечах, где элеватор оборудован приёмной ямой. На дальних маршрутах с выгрузкой через люки расход стабильнее и нет простоев в очереди под разгрузку.",
        at: "2026-09-12T15:10:00",
      },
      {
        authorName: "Марина Лебедева",
        text: "Соглашусь с Олегом. У нас парк из восьми зерновозов — для регулярных рейсов 400–600 км берём только с верхней загрузкой и донной выгрузкой. Быстрее оборачиваемость, меньше зависимость от приёмки.",
        at: "2026-09-12T17:45:00",
      },
    ],
  },
  {
    section: "discussion",
    title: "Маршрут Краснодар — Москва: как рассчитать ставку за км?",
    body: "Планирую регулярные рейсы Краснодар — Москва для груза до 20 т. Какую ставку за километр закладывать с учётом топлива и возврата порожнего? Поделитесь, кто возит по этому плечу.",
    authorName: "Ирина Ковалёва",
    tags: ["ставки", "расчёт"],
    isClosed: true,
    viewsCount: 214,
    createdAt: "2026-09-10T10:05:00",
    posts: [
      {
        authorName: "Антон Петров",
        text: "Закладывайте 26–30 ₽/км на этом плече: 1 400 км, две ночёвки и порожний возврат в 25% случаев. Подробный расчёт выложил в ответе, но сперва попрошу уточнить загрузку.",
        at: "2026-09-10T12:40:00",
      },
    ],
  },
  {
    section: "discussion",
    title: "Оплата безналом для ИП: делимся опытом",
    body: "Работаю как ИП, хочу уйти от наличных. Как выстраиваете безналичные расчёты с заказчиками и какие документы готовите?",
    authorName: "Дмитрий Соколов",
    tags: ["оплата", "ИП"],
    viewsCount: 198,
    createdAt: "2026-09-09T09:15:00",
    posts: [],
  },
  {
    section: "discussion",
    title: "Сроки загрузки в портах Азовского моря",
    body: "Кто возил в этом сезоне? Интересуют реальные сроки ожидания загрузки и есть ли смысл бронировать слоты заранее.",
    authorName: "Олег Дроздов",
    tags: ["порты", "загрузка"],
    viewsCount: 96,
    createdAt: "2026-09-07T11:20:00",
    posts: [],
  },
  {
    section: "discussion",
    title: "Осенняя уборка: как координируете парк машин?",
    body: "В сезон уборки машин не хватает. Как распределяете рейсы между элеваторами и подрядчиками, чтобы не простаивать?",
    authorName: "Марина Лебедева",
    tags: ["уборка", "флот"],
    viewsCount: 412,
    createdAt: "2026-09-05T08:00:00",
    posts: [],
  },
  {
    section: "discussion",
    title: "Договор-заявка: на что обратить внимание",
    body: "Собираю чек-лист по договору-заявке: какие пункты обязательно проверять перед рейсом?",
    authorName: "Ксения Романова",
    tags: ["договор", "заявка"],
    viewsCount: 163,
    createdAt: "2026-09-01T13:00:00",
    posts: [],
  },
  {
    section: "discussion",
    title: "Ставки на перевозку зерна: сезонность и пики",
    body: "Понаблюдал за ставками за год: пики приходятся на уборку и предпраздничные периоды. Как вы планируете контракты, чтобы сгладить сезонность?",
    authorName: "Дмитрий Соколов",
    tags: ["ставки", "сезонность"],
    viewsCount: 267,
    createdAt: "2026-08-28T10:00:00",
    posts: [],
  },
  {
    section: "platform-issues",
    title: "Не работает поиск по региону",
    body: "При выборе региона в фильтре список результатов не обновляется. Повторяется в Firefox и Chrome.",
    authorName: "Антон Петров",
    tags: ["баг", "поиск"],
    viewsCount: 88,
    createdAt: "2026-09-08T16:30:00",
    posts: [],
  },
  {
    section: "platform-issues",
    title: "Медленно грузится карта на мобильном",
    body: "На телефоне карта с кластерами открывается несколько секунд. На десктопе всё быстро.",
    authorName: "Сергей Козлов",
    tags: ["карта", "мобильный"],
    viewsCount: 54,
    createdAt: "2026-09-04T12:10:00",
    posts: [],
  },
  {
    section: "proposals",
    title: "Калькулятор ставки прямо в заявке",
    body: "Предлагаю добавить калькулятор: указываешь расстояние и расход, получаешь рекомендованную ставку за км.",
    authorName: "Ксения Романова",
    tags: ["предложение", "ставки"],
    viewsCount: 150,
    createdAt: "2026-08-20T09:40:00",
    posts: [],
  },
  {
    section: "support",
    title: "Как подтвердить номер телефона?",
    body: "Зарегистрировался, но не могу найти, где подтвердить телефон. Подскажите, пожалуйста.",
    authorName: "Марина Лебедева",
    tags: ["регистрация"],
    viewsCount: 42,
    createdAt: "2026-09-06T14:00:00",
    posts: [],
  },
];

async function seed() {
  try {
    console.log("Подключение к MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Подключено успешно");

    console.log("Очистка форума (threads, posts)...");
    await ForumThreadModel.deleteMany({});
    await ForumPostModel.deleteMany({});
    console.log("Очищено");

    for (const seedThread of threads) {
      const createdAt = new Date(seedThread.createdAt);
      const lastPost = seedThread.posts[seedThread.posts.length - 1];
      const lastActivityAt = lastPost ? new Date(lastPost.at) : createdAt;

      const thread = await ForumThreadModel.create({
        section: seedThread.section,
        title: seedThread.title,
        body: seedThread.body,
        authorId: null,
        authorName: seedThread.authorName,
        tags: seedThread.tags,
        isPinned: seedThread.isPinned ?? false,
        isClosed: seedThread.isClosed ?? false,
        viewsCount: seedThread.viewsCount,
        repliesCount: seedThread.posts.length,
        lastActivityAt,
      });
      await ForumThreadModel.updateOne(
        { _id: thread._id },
        { $set: { createdAt } }
      );

      for (const seedPost of seedThread.posts) {
        const post = await ForumPostModel.create({
          threadId: thread._id,
          authorId: null,
          authorName: seedPost.authorName,
          text: seedPost.text,
        });
        await ForumPostModel.updateOne(
          { _id: post._id },
          { $set: { createdAt: new Date(seedPost.at) } }
        );
      }
    }

    console.log(`Успешно вставлено ${threads.length} тем и их ответы`);
    await mongoose.disconnect();
    console.log("Отключено от MongoDB");
  } catch (error) {
    console.error("Ошибка при сидировании:", error);
    process.exit(1);
  }
}

seed();
