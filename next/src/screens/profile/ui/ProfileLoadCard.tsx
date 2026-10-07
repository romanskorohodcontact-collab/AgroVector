import Link from "next/link";
import type { Load } from "@/entities/load/model";
import { EditIcon } from "@/shared/ui/EditIcon";
import { LoadDetailButton } from "@/widgets/load-detail";

interface ProfileLoadCardProps {
  load: Load;
  editable?: boolean;
}

const DEFAULT_STATUS = "В поиске";

export function ProfileLoadCard({ load, editable = false }: ProfileLoadCardProps) {
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
    <article className="flex flex-col gap-3 bg-bg-surface border border-border rounded-[24px] px-5 pb-4 pt-3 max-w-[620px]">

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
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="mt-1 text-sm font-medium tracking-[-0.14px] leading-[1.4] text-text-primary whitespace-nowrap overflow-hidden text-ellipsis tabular-nums">
            {load.loadingRegion}
          </span>
          <span
            className="text-xs text-text-muted whitespace-nowrap"
          > {load.loadingPlace}</span>
        </div>
        <span>→</span>
        <div className="flex flex-col">
          <span className="mt-1 text-sm font-medium tracking-[-0.14px] leading-[1.4] text-text-primary whitespace-nowrap overflow-hidden text-ellipsis tabular-nums">
            {load.unloadingRegion}
          </span>
          <span
            className="text-xs text-text-muted whitespace-nowrap"
          >
            {load.unloadingPlace}</span>
        </div>
      </div>

      {/*Пэйджи*/}
      <div className="flex gap-2 mt-2">
        <span
          className="inline-flex items-center h-5 px-2.5 rounded-pill bg-bg-subtle text-xs leading-none text-text-secondary tracking-[-0.16px] whitespace-nowrap"
        >
          {load.cargo}
        </span>
        {/*<span
          className="inline-flex items-center h-5 px-2.5 rounded-pill bg-bg-subtle text-xs leading-none text-text-secondary tracking-[-0.16px] whitespace-nowrap"
        >
          {load.vatType}
        </span>*/}
        <span
          className="inline-flex items-center h-5 px-2.5 rounded-pill bg-bg-subtle text-xs leading-none text-text-secondary tracking-[-0.16px] whitespace-nowrap"
        >
          {loadingDateLabel}
        </span>
      </div>

      {/*Основная инфа*/}
      {/*<div className="flex justify-between items-center py-1 gap-x-5 gap-y-2 border-y border-border">
        <span className="text-xs text-text-muted whitespace-nowrap">
          <b className="font-medium text-sm text-text-primary tracking-[-0.14px] tabular-nums">
            {load.tonnage.tonnageWeight}
          </b>{" "}
          {load.tonnage.tonnageUnit === "ton" ? "т" : "кг"}
        </span>
        <span className="text-xs text-text-muted whitespace-nowrap">
          <b className="font-medium text-sm text-text-primary tracking-[-0.14px] tabular-nums">
            {load.distance.toLocaleString("ru-RU")}
          </b>{" "}
          км
        </span>

        <span className="text-xs text-text-muted whitespace-nowrap">
          <b className="font-medium text-sm text-text-primary tracking-[-0.14px] tabular-nums">
            {load.rate.toLocaleString("ru-RU")}
          </b>{" "}
          ₽/рейс
        </span>
        <span className="text-xs text-text-muted whitespace-nowrap">
          <b className="font-medium text-lg text-text-primary tracking-[-0.24px] tabular-nums">
            {load.ratePerKm.toFixed(2)}
          </b>{" "}
          ₽/км
        </span>
      </div>*/}

      <div className="border-b border-border" />

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between text-[14px] tracking-[-0.14px]">
          <span className="text-text-muted flex-none">Тоннаж</span>
          <span className="text-text-primary font-medium text-right tabular-nums">
            {load.tonnage.tonnageWeight} {" "} {load.tonnage.tonnageUnit === "ton" ? "т" : "кг"}
          </span>
        </div>
        <div className="flex items-baseline justify-between text-[14px] tracking-[-0.14px]">
          <span className="text-text-muted flex-none">Расстояние</span>
          <span className="text-text-primary font-medium text-right tabular-nums">
            {load.distance.toLocaleString("ru-RU")} {" "} км
          </span>

        </div>
        {/*<div className="flex items-baseline justify-between text-[14px] tracking-[-0.14px]">
          <span className="text-text-muted flex-none">Мин. ставка</span>
          <span className="text-text-primary font-medium text-right tabular-nums">
            {load.rate.toLocaleString("ru-RU")}   ₽/рейс
          </span>
        </div>*/}
        <div className="flex items-baseline justify-between text-[14px] tracking-[-0.14px]">
          <span className="text-text-muted flex-none">Мин. ставка</span>
          <span className="text-accent font-medium text-right tabular-nums">
            {load.ratePerKm.toFixed(2)} {" "} ₽/км
          </span>
        </div>
      </div>
      <div className="border-b border-border" />


      {/*Контакты + Подробнее*/}
      <footer className="flex items-end justify-between flex-wrap max-md:flex-col max-md:items-stretch">
        <div className="flex text-sm justify-between w-full items-baseline gap-0 max-md:justify-between">
          <span className="text-text-secondary tabular-nums">
            {load.customerName}
          </span>
          <a className="font-medium text-text-primary tabular-nums">
            {load.customerPhone}
          </a>
        </div>

        <div className="flex items-center w-full gap-2 max-md:w-full mt-5">
          {editable ? (
            <Link
              href={`/loads/${load.id}/edit`}
              className="inline-flex items-center justify-center rounded-pill bg-bg-subtle px-4 h-9 gap-1.5 text-sm font-medium text-text-primary text-center leading-[1.43] tracking-[-0.16px] whitespace-nowrap transition-colors duration-150 hover:bg-bg-hover max-md:flex-1"
            >
              {/*<EditIcon />*/}
              Редактировать
            </Link>
          ) : null}
          <LoadDetailButton load={load} />
        </div>
      </footer>
    </article>
  );
}
