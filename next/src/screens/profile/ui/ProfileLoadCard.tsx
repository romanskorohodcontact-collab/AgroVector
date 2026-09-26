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
    <article className="flex flex-col bg-bg-surface border border-border rounded-[24px] px-5 py-4 max-w-[620px]">

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

      {/*<h3 className="mt-3 text-xl font-medium leading-[1.25] text-text-primary tracking-[-0.7px]">
        {load.cargo}
      </h3>*/}
      {/*<p className="mt-1 text-sm font-medium tracking-[-0.14px] leading-[1.4] text-text-primary whitespace-nowrap overflow-hidden text-ellipsis tabular-nums">
        {load.loadingPlace} → {load.unloadingPlace}
      </p>*/}
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span className="mt-1 text-sm font-medium tracking-[-0.14px] leading-[1.4] text-text-primary whitespace-nowrap overflow-hidden text-ellipsis tabular-nums">
            {load.loadingRegion}
          </span>
          <span
            className="text-xs text-text-muted whitespace-nowrap"
          > {load.loadingPlace}</span>
        </div>
        →
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

      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 mt-4 py-3 border-y border-border">
        <span className="text-xs text-text-muted whitespace-nowrap">
          <b className="font-medium text-sm text-text-primary tracking-[-0.14px] tabular-nums">
            {load.tonnage.tonnageWeight}
            {/*{load.tonnage.tonnageUnit === "ton" ? "т" : "кг"}*/}
          </b>{" "}
          {load.tonnage.tonnageUnit === "ton" ? "т" : "кг"}
          {/*· Тоннаж*/}
        </span>
        <span className="text-xs text-text-muted whitespace-nowrap">
          <b className="font-medium text-sm text-text-primary tracking-[-0.14px] tabular-nums">
            {load.distance.toLocaleString("ru-RU")}
          </b>{" "}
          км
          {/*· Расстояние*/}
        </span>
        <span className="text-xs text-text-muted whitespace-nowrap">
          <b className="font-medium text-sm text-text-primary tracking-[-0.14px] tabular-nums">
            {load.ratePerKm.toFixed(2)}
          </b>{" "}
          ₽/км
        </span>
        <span className="text-xs text-text-muted whitespace-nowrap">
          <b className="font-medium text-lg text-accent tracking-[-0.24px] tabular-nums">
            {load.rate.toLocaleString("ru-RU")}
          </b>{" "}
          {/*· Ставка*/}
          ₽/рейс
        </span>
      </div>


      <div className="flex flex-wrap gap-2 mt-4">
        {/*{load.bodyType ? (
          <span
            className="inline-flex items-center h-5 px-2.5 rounded-pill bg-bg-subtle text-xs leading-none text-text-secondary tracking-[-0.16px] whitespace-nowrap"
          >
            {load.bodyType}
          </span>
        ) : null}
        {load.loadingType && load.loadingType.map((type) => (
         <span
           key={type}
           className="inline-flex items-center h-5 px-2.5 rounded-pill bg-bg-subtle text-xs leading-none text-text-secondary tracking-[-0.16px] whitespace-nowrap"
         >
            {type}
         </span>
        ))}*/}
        {/*Эта часть новая*/}
        <div className="flex gap-2">
          <span
            className="inline-flex items-center h-5 px-2.5 rounded-pill bg-bg-subtle text-xs leading-none text-text-secondary tracking-[-0.16px] whitespace-nowrap"
          >
            {load.cargo}
          </span>
          <span
            className="inline-flex items-center h-5 px-2.5 rounded-pill bg-bg-subtle text-xs leading-none text-text-secondary tracking-[-0.16px] whitespace-nowrap"
          >
            {load.vatType}
          </span>
          <span
            className="inline-flex items-center h-5 px-2.5 rounded-pill bg-bg-subtle text-xs leading-none text-text-secondary tracking-[-0.16px] whitespace-nowrap"
          >
            {loadingDateLabel}
          </span>
        </div>
        {/*Конец новой части*/}
      </div>

      <footer className="flex items-center justify-between flex-wrap gap-4 mt-4 mt- 8 max-md:flex-col max-md:items-stretch">

        <div className="flex items-center gap-2 max-md:w-full w-full">
          {editable ? (
            <Link
              href={`/loads/${load.id}/edit`}
              className="inline-flex items-center justify-center rounded-pill bg-bg-subtle px-4 h-9 gap-1.5 text-sm font-medium text-text-primary text-center leading-[1.43] tracking-[-0.16px] whitespace-nowrap transition-colors duration-150 hover:bg-bg-hover max-md:flex-1"
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
