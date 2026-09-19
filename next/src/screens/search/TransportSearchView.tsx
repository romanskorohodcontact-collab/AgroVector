"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Transport, TransportSearchResult } from "@/entities/transport/model";
import { TransportDetailButton } from "@/widgets/transport-detail";
import { Pagination } from "./ui/Pagination";

const PAGE_SIZE = 10;

export function TransportSearchView() {
  const [page, setPage] = useState(1);

  const query = useQuery<TransportSearchResult>({
    queryKey: ["transports-search", page],
    queryFn: () => fetchTransports(page),
  });

  const result = query.data;
  const totalPages = result
    ? Math.max(1, Math.ceil(result.total / PAGE_SIZE))
    : 1;

  return (
    <main className="grid min-w-0 min-h-0 flex-1 grid-cols-[1fr_1fr] overflow-hidden max-[960px]:h-auto max-[960px]:flex-none max-[960px]:grid-cols-1 max-[960px]:overflow-visible">
      <div className="grid grid-rows-[1fr_2fr] min-h-0 border-r border-[#0D0D0D12] max-[960px]:grid-rows-none max-[960px]:border-r-0">
        <section
          className="flex flex-col gap-3 px-6 pt-4 pb-5 border-b border-[#0D0D0D12] min-h-0"
          aria-label="Фильтр заявок"
        />

        <div className="grid grid-cols-[1fr_2fr] min-h-0 max-[960px]:grid-cols-1">
          <aside
            className="px-4 py-5 min-h-0 overflow-y-auto border-r border-[#0D0D0D12] max-[960px]:border-r-0 max-[960px]:border-b max-[960px]:overflow-visible"
            aria-label="Сортировка"
          />

          <section className="p-4 min-h-0 overflow-y-auto bg-bg-subtle max-[960px]:overflow-visible max-[960px]:h-auto" aria-label="Заявки на транспорт">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm leading-[1.43] text-text-secondary tracking-[-0.14px]">
                Заявки на транспорт
              </span>
              {result ? (
                <span className="text-sm leading-[1.43] text-text-secondary tracking-[-0.14px]">
                  {`${result.items.length} из ${result.total}`}
                </span>
              ) : null}
            </div>

            {query.isPending && !result ? (
              <p className="py-12 px-4 text-center text-sm text-text-muted tracking-[-0.14px]">
                Загрузка…
              </p>
            ) : query.isError ? (
              <p className="py-12 px-4 text-center text-sm text-text-muted tracking-[-0.14px]">
                Не удалось загрузить заявки
              </p>
            ) : result && result.items.length === 0 ? (
              <p className="py-12 px-4 text-center text-sm text-text-muted tracking-[-0.14px]">
                Заявок не найдено
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {result?.items.map((transport) => (
                  <TransportDetailButton key={transport.id} transport={transport} />
                ))}
              </div>
            )}

            {result ? (
              <Pagination
                page={page}
                totalPages={totalPages}
                total={result.total}
                onPageChange={setPage}
              />
            ) : null}
          </section>
        </div>
      </div>

      <div
        role="presentation"
        className="relative flex items-center justify-center gap-2.5 min-w-0 bg-bg-subtle bg-[linear-gradient(rgba(13,13,13,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(13,13,13,0.05)_1px,transparent_1px)] [background-size:36px_36px] max-[960px]:h-[320px]"
      >
        <span className="absolute top-5 left-5 z-10 px-3.5 py-2 rounded-pill bg-white shadow-[0_4px_16px_rgba(24,24,24,0.08)] text-[13px] font-medium text-text-primary tracking-[-0.13px]">
          Заявки на карте
        </span>
      </div>
    </main>
  );
}

async function fetchTransports(page: number): Promise<TransportSearchResult> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(PAGE_SIZE));
  const response = await fetch(`/api/transports?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Не удалось получить заявки");
  }
  return response.json();
}
