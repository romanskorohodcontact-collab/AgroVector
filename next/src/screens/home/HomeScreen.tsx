import Link from "next/link";
import { listLoads } from "@/server/modules/loads";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";
import { LoadsList } from "@/widgets/loads-list";
import { LoadsMap } from "@/widgets/loads-map";
import { SearchPanel } from "@/widgets/search-panel";
import { TransportsList } from "@/widgets/transports-list";

const BTN_MD_FILL =
  "inline-flex items-center justify-center h-12 px-[21.28px] gap-1.5 rounded-pill bg-accent text-base font-medium text-text-inverse whitespace-nowrap tracking-[-0.16px] transition-colors duration-150 hover:bg-accent/90";
const BTN_MD_WHITE =
  "inline-flex items-center justify-center h-12 px-[21.28px] gap-1.5 rounded-pill bg-bg-surface text-base font-medium text-text-primary whitespace-nowrap tracking-[-0.16px] transition-colors duration-150 hover:bg-bg-hover";
const BTN_SM_GHOST =
  "inline-flex items-center justify-center h-9 w-full rounded-pill bg-bg-subtle text-sm font-medium text-text-primary whitespace-nowrap tracking-[-0.16px] transition-colors duration-150 hover:bg-bg-hover";

const STATS = [
  { value: "2 400+", label: "Активных перевозчиков" },
  { value: "18 000+", label: "Заявок выполнено" },
  { value: "320 км", label: "Средняя дальность" },
  { value: "4.8", label: "Средний рейтинг" },
];

const STEPS = [
  {
    number: "01",
    title: "Создайте заявку",
    text: "Укажите маршрут, тип груза, тоннаж и ставку. Заявка сразу видна перевозчикам.",
    button: "Создать заявку",
    href: "/loads/create",
  },
  {
    number: "02",
    title: "Найдите перевозчика",
    text: "Сравните предложения, проверьте рейтинги и выберите подходящий транспорт.",
    button: "Найти перевозчика",
    href: "/search?type=transport",
  },
  {
    number: "03",
    title: "Отслеживайте доставку",
    text: "Контролируйте статус груза в реальном времени на интерактивной карте.",
    button: "Открыть карту",
    href: "/search?type=load",
  },
];

export async function HomeScreen() {
  const loads = await listLoads();

  return (
    <main>
      <Header activePath="/" />

      <Hero />
      <SearchPanel />

      <section className="py-[88px] max-md:py-16">
        <LoadsMap mapItems={loads} className="h-[420px] w-full max-md:h-[260px]" />
      </section>

      <LoadsList loads={loads.slice(0, 6)} />
      <TransportsList />

      <Stats />
      <HowItWorks />
      <Cta />

      <Footer />
    </main>
  );
}

function Hero() {
  return (
    <section className="bg-[linear-gradient(rgba(20,20,20,0.55),rgba(20,20,20,0.75)),url('/photo1.jpg')] bg-cover bg-center py-[128px] text-center max-md:py-20">
      <div className="container-app">
        <span className="block mb-4 text-sm leading-[1.43] tracking-[-0.14px] text-text-inverse/90">
          Аграрная логистика
        </span>
        <h1 className="text-[64px] font-medium leading-[1.04] tracking-[-4.62px] text-text-inverse max-lg:text-[60px] max-lg:tracking-[-3.2px] max-md:text-[44px] max-md:tracking-[-2.4px]">
          Грузы и транспорт для аграрного рынка
        </h1>
        <p className="mt-7 mx-auto max-w-[680px] text-lg leading-[1.78] tracking-[-0.18px] text-text-inverse/85">
          Публикуйте заявки на груз или транспорт и находите подходящие предложения от заказчиков и перевозчиков.
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <Link href="/loads/create" className={BTN_MD_FILL}>
            Разместить груз
          </Link>
          <Link href="/transports/create" className={BTN_MD_WHITE}>
            Разместить транспорт
          </Link>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="py-[88px] bg-bg-subtle max-md:py-16">
      <div className="container-app">
        <div className="grid grid-cols-4 gap-8 max-lg:grid-cols-2 max-lg:gap-10 max-md:grid-cols-1">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-center text-[48px] font-medium leading-[1.04] tracking-[-2.16px] text-text-primary max-md:text-[40px]">
                {stat.value}
              </p>
              <p className="mt-2 text-center text-base text-text-secondary tracking-[-0.16px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="py-[88px] max-md:py-16">
      <div className="container-app">
        <div className="flex items-end justify-between gap-6 mb-8 max-md:flex-col max-md:items-start">
          <div className="max-w-[560px]">
            <h2 className="text-[18px] font-semibold leading-[1.33] tracking-[-0.18px] text-text-primary">
              Процесс
            </h2>
            <p className="mt-1 text-sm leading-[1.43] text-text-secondary tracking-[-0.14px]">
              Как это работает
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 max-md:p-4">
          {STEPS.map((step) => (
            <article
              key={step.number}
              className="flex flex-col bg-bg-surface border border-border rounded-[24px] p-6"
            >
              <div className="flex items-center justify-center w-full h-[184px] mb-3 rounded-[24px] bg-bg-subtle text-text-muted">
                <span className="text-[40px] font-medium tracking-[-1.6px] text-text-primary">
                  {step.number}
                </span>
              </div>
              <h3 className="text-[20px] font-medium leading-[1.25] tracking-[-0.7px] text-text-primary">
                {step.title}
              </h3>
              <p className="mt-1 text-sm leading-[1.43] text-text-secondary tracking-[-0.14px]">
                {step.text}
              </p>
              <div className="mt-6">
                <Link href={step.href} className={BTN_SM_GHOST}>
                  {step.button}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="py-[120px] text-center bg-[linear-gradient(rgba(20,20,20,0.55),rgba(20,20,20,0.75)),url('/photo2.jpg')] bg-cover bg-center max-md:py-20">
      <div className="container-app">
        <h2 className="mx-auto max-w-[640px] text-[26px] font-medium leading-[1.5] tracking-[-0.52px] text-text-inverse">
          Готовы начать?
        </h2>
        <p className="mx-auto mt-3 max-w-[560px] text-base leading-[1.75] text-text-inverse/85 tracking-[-0.16px]">
          Разместите первую заявку за пару минут и найдите перевозчика для вашего
          груза.
        </p>
        <div className="flex justify-center mt-8">
          <Link href="/loads/create" className={BTN_MD_FILL}>
            Выложить заявку
          </Link>
        </div>
      </div>
    </section>
  );
}
