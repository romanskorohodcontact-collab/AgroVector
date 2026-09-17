import Link from "next/link";
import { LoadCard } from "@/entities/load";
import type { Load } from "@/entities/load/model";

interface LoadsListProps {
  loads: Load[];
}

export function LoadsList({ loads }: LoadsListProps) {
  return (
    <section className="py-[88px] bg-bg-subtle max-md:py-16">
      <div className="container-app">
        <div className="flex items-end justify-between gap-6 mb-8 max-md:flex-col max-md:items-start">
          <div className="max-w-[560px]">
            <h2 className="text-[18px] font-semibold leading-[1.33] tracking-[-0.18px] text-text-primary">
              Заявки на перевозку грузов
            </h2>
            <p className="mt-1 text-sm leading-[1.43] text-text-secondary tracking-[-0.14px]">
              Актуальные предложения от грузоотправителей
            </p>
          </div>
          <Link
            href="/search"
            className="shrink-0 pb-1 text-sm leading-[1.43] text-text-secondary tracking-[-0.14px] hover:text-text-primary"
          >
            Все заявки
          </Link>
        </div>

        {loads.length === 0 ? (
          <p className="text-sm leading-[1.43] text-text-secondary tracking-[-0.14px]">
            Заявок пока нет
          </p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 max-md:p-4">
            {loads.map((load) => (
              <LoadCard key={load.id} load={load} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}