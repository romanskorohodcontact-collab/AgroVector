import Link from "next/link";
import type { Load } from "../model";
import { EditIcon } from "@/shared/ui/EditIcon";
import { LoadDetailButton } from "@/widgets/load-detail";

interface LoadCardProps {
  load: Load;
  editable?: boolean;
}

const DEFAULT_STATUS = "В поиске";

export function LoadCard({ load, editable = false }: LoadCardProps) {
  const loadingDate = load.loadingDate ? new Date(load.loadingDate as unknown as string) : null;
  const loadingDateLabel =
    loadingDate && !Number.isNaN(loadingDate.getTime())
      ? loadingDate.toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "—";

  return (
    <article className="flex max-w-[620px] flex-col gap-3 rounded-[24px] border border-border bg-bg-surface px-5 pt-3 pb-4">
      {/*<div className="flex items-center justify-between gap-3">
        <span className="text-xs text-text-muted whitespace-nowrap leading-[1.5]">
          № {load.id}
        </span>
        <span className="inline-flex items-center h-5 px-2.5 rounded-pill bg-bg-subtle text-xs leading-none text-text-secondary tracking-[-0.16px] whitespace-nowrap">
          <span
            aria-hidden="true"
            className="w-1.5 h-1.5 rounded-pill bg-accent mr-1.5"
          />
          {DEFAULT_STATUS}
        </span>
      </div>*/}

      {/*Откуда куда*/}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="mt-1 overflow-hidden text-sm leading-[1.4] font-medium tracking-[-0.14px] text-ellipsis whitespace-nowrap text-text-primary tabular-nums">
            {load.loadingRegion}
          </span>
          <span className="text-xs whitespace-nowrap text-text-muted"> {load.loadingPlace}</span>
        </div>
        <span>→</span>
        <div className="flex flex-col">
          <span className="mt-1 overflow-hidden text-sm leading-[1.4] font-medium tracking-[-0.14px] text-ellipsis whitespace-nowrap text-text-primary tabular-nums">
            {load.unloadingRegion}
          </span>
          <span className="text-xs whitespace-nowrap text-text-muted">{load.unloadingPlace}</span>
        </div>
      </div>

      {/*Пэйджи*/}
      <div className="mt- 2 flex gap-2">
        <span className="inline-flex h-5 items-center rounded-pill bg-bg-subtle px-2.5 text-xs leading-none tracking-[-0.16px] whitespace-nowrap text-text-secondary">
          {load.cargo}
        </span>
        {/*<span
          className="inline-flex items-center h-5 px-2.5 rounded-pill bg-bg-subtle text-xs leading-none text-text-secondary tracking-[-0.16px] whitespace-nowrap"
        >
          {load.vatType}
        </span>*/}
        <span className="inline-flex h-5 items-center rounded-pill bg-bg-subtle px-2.5 text-xs leading-none tracking-[-0.16px] whitespace-nowrap text-text-secondary">
          {loadingDateLabel}
        </span>
      </div>

      {/*Основная инфа*/}
      <div className="flex items-center justify-between gap-x-5 gap-y-2 border-y border-border py-1">
        <span className="text-xs whitespace-nowrap text-text-muted">
          <b className="text-sm font-medium tracking-[-0.14px] text-text-primary tabular-nums">
            {load.tonnage.tonnageWeight}
            {/*{load.tonnage.tonnageUnit === "ton" ? "т" : "кг"}*/}
          </b>{" "}
          {load.tonnage.tonnageUnit === "ton" ? "т" : "кг"}
          {/*· Тоннаж*/}
        </span>
        <span className="text-xs whitespace-nowrap text-text-muted">
          <b className="text-sm font-medium tracking-[-0.14px] text-text-primary tabular-nums">
            {load.distance.toLocaleString("ru-RU")}
          </b>{" "}
          км
          {/*· Расстояние*/}
        </span>

        <span className="text-xs whitespace-nowrap text-text-muted">
          <b
            // className="font-medium text-lg text-accent tracking-[-0.24px] tabular-nums"
            className="text-sm font-medium tracking-[-0.14px] text-text-primary tabular-nums"
          >
            {load.rate.toLocaleString("ru-RU")}
          </b>{" "}
          {/*· Ставка*/}
          ₽/рейс
        </span>
        <span className="text-xs whitespace-nowrap text-text-muted">
          <b className="text-lg font-medium tracking-[-0.24px] text-text-primary tabular-nums">
            {load.ratePerKm.toFixed(2)}
          </b>{" "}
          ₽/км
        </span>
      </div>

      {/*Контакты + Подробнее*/}
      <footer className="flex flex-wrap items-end justify-between max-md:flex-col max-md:items-stretch">
        <div className="flex flex-col items-baseline gap-0 max-md:justify-between">
          <span className="text-sm leading-[1.43] tracking-[-0.14px] text-text-primary">
            {load.customerName}
          </span>
          <a
            className="cursor-pointer text-sm leading-[1.43] tracking-[-0.14px] text-text-secondary no-underline transition-colors duration-150 hover:text-text-primary"
            href={`tel:${load.customerPhone}`}
          >
            {load.customerPhone}
          </a>
        </div>
        <div className="flex items-center gap-2 max-md:w-full">
          {editable ? (
            <Link
              href={`/loads/${load.id}/edit`}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-pill bg-bg-subtle px-4 text-center text-sm leading-[1.43] font-medium tracking-[-0.16px] whitespace-nowrap text-text-primary transition-colors duration-150 hover:bg-bg-hover max-md:flex-1"
            >
              <EditIcon />
              Редактировать
            </Link>
          ) : null}
          <LoadDetailButton load={load} />
        </div>
      </footer>
    </article>
  );
}
