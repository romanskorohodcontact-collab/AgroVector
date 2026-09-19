import Link from "next/link";
import { TransportDetailButton } from "@/widgets/transport-detail";
import { MOCK_TRANSPORTS } from "./transportMocks";

export function TransportsList() {
  return (
    <section className="py-[88px] max-md:py-16">
      <div className="container-app">
        <div className="flex items-end justify-between gap-6 mb-8 max-md:flex-col max-md:items-start">
          <div className="max-w-[560px]">
            <h2 className="text-[18px] font-semibold leading-[1.33] tracking-[-0.18px] text-text-primary">
              Заявки на транспорт
            </h2>
            <p className="mt-1 text-sm leading-[1.43] text-text-secondary tracking-[-0.14px]">
              Актуальные предложения от перевозчиков
            </p>
          </div>
          <Link
            href="/search?type=transport"
            className="shrink-0 pb-1 text-sm leading-[1.43] text-text-secondary tracking-[-0.14px] hover:text-text-primary"
          >
            Все заявки
          </Link>
        </div>

        {MOCK_TRANSPORTS.length === 0 ? (
          <p className="text-sm leading-[1.43] text-text-secondary tracking-[-0.14px]">
            Заявок пока нет
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 max-[960px]:grid-cols-1">
            {MOCK_TRANSPORTS.map((transport) => (
              <TransportDetailButton key={transport.id} transport={transport} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
