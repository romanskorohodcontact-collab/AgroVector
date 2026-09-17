"use client";

import { useEffect } from "react";
import type { Load } from "@/entities/load/model";
import { LoadDetailMap } from "@/widgets/loads-map";

const DEFAULT_STATUS = "В поиске";

interface LoadDetailWindowProps {
  load: Load;
  onClose: () => void;
}

export function LoadDetailWindow({ load, onClose }: LoadDetailWindowProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 max-[900px]:items-start max-[900px]:p-4 max-[560px]:p-3">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-[1000px] h-[80vh] bg-white border border-[#ECECEC] rounded-[24px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.2)] grid grid-cols-2 max-[900px]:grid-cols-1 max-[900px]:h-auto max-[900px]:max-h-[80vh]">
        <div className="min-h-0 max-[900px]:h-[220px] max-[900px]:order-first bg-bg-subtle">
          <LoadDetailMap location={load.loadingLocation} className="h-full w-full" />
        </div>

        <div className="min-h-0 overflow-y-auto overscroll-contain p-8 [scrollbar-width:thin] [scrollbar-color:#E0E0E0_transparent] max-[900px]:overflow-visible max-[900px]:p-6 max-[560px]:px-4 max-[560px]:py-5">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              {/*<span className="block mb-1.5 text-xs text-text-muted whitespace-nowrap">
                № {load.id}
              </span>*/}
              <h1 className="text-[20px] font-medium leading-[1.25] text-text-primary tracking-[-0.7px]">
                {load.cargo}
              </h1>
              <p className="mt-1 text-sm text-text-secondary leading-[1.43] tracking-[-0.14px]">
                Груз на перевозку
              </p>
              {/*<div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-flex items-center h-5 px-2.5 rounded-pill bg-bg-subtle text-xs text-text-secondary tracking-[-0.16px] whitespace-nowrap">
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-accent mr-1.5"
                  />
                  {DEFAULT_STATUS}
                </span>
              </div>*/}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className="flex items-center justify-center w-8 h-8 shrink-0 rounded-pill bg-bg-subtle text-text-secondary transition-colors duration-150 hover:bg-[#EFEFEF] hover:text-text-primary"
            >
              <CloseIcon />
            </button>

            {/*<div className="mt-5  w-[100px] h-[100px] shrink-0  aspect-square bg-[#EBEDEB] rounded-[16px] flex items-center justify-center overflow-hidden">
              <img
                src="/photoTr1.png"
                alt=""
                className="max-w-full max-h-full object-contain"
              />
            </div>*/}
          </div>



          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 p-[14px] rounded-2xl bg-bg-subtle mt-5 max-[560px]:grid-cols-1 max-[560px]:gap-2">
            <div className="flex flex-col h-full gap-0.5 min-w-0">
              <span className="text-xs text-text-muted tracking-[-0.12px]">
                Погрузка
              </span>
              {/*<strong className="text-base font-semibold text-text-primary tracking-[-0.16px] whitespace-nowrap overflow-hidden text-ellipsis">
                {load.loadingPlace}
              </strong>*/}
              <div className="flex flex-col">
                <span className="mt-1 text-sm font-medium tracking-[-0.14px] leading-[1.4] text-text-primary whitespace-nowrap overflow-hidden text-ellipsis tabular-nums">
                  {load.loadingRegion}
                </span>
                <span
                  className="text-xs text-text-muted whitespace-nowrap"
                > {load.loadingPlace}</span>
              </div>
            </div>
            <span
              aria-hidden="true"
              className="flex items-center text-text-muted max-[560px]:justify-start max-[560px]:rotate-90"
            >
              <RouteArrowIcon />
            </span>
            <div className="flex flex-col gap-0.5 min-w-0 h-full items-end text-right max-[560px]:items-start max-[560px]:text-left">
              <span className="text-xs text-text-muted tracking-[-0.12px]">
                Выгрузка
              </span>
              {/*<strong className="text-base font-semibold text-text-primary tracking-[-0.16px] whitespace-nowrap overflow-hidden text-ellipsis">
                {load.unloadingPlace}
              </strong>*/}
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
          </div>

          <div className="mt-2">
            <DtcRow label="Тоннаж" value={`${load.tonnage} т`} />
            <DtcRow
              label="Километраж"
              value={`${load.distance.toLocaleString("ru-RU")} км`}
            />
            <DtcRow
              label="Ставка"
              value={`${load.rate.toLocaleString("ru-RU")} ₽`}
            />
            <DtcRow
              label="Тип груза"
              value={load.cargoTypes?.join(", ") || "—"}
            />
            <DtcRow
              label="Округ и регион погрузки"
              value={`${(load.loadingDistrict ?? []).join(", ") || "—"}, ${load.loadingRegion?.join(", ") || "—"}`}
              block
            />
            {/*<DtcRow
              label="Регион погрузки"
              value={load.loadingRegion?.join(", ") || "—"}
              block
            />*/}
            {/*<DtcRow
              label="Округ погрузки"
              value={(load.loadingDistrict ?? []).join(", ") || "—"}
              block
            />*/}
            <DtcRow
              label="Округ и регион выгрузки"
              value={`${(load.unloadingDistrict ?? []).join(", ") || "—"}, ${load.unloadingRegion?.join(", ") || "—"}`}
              block
            />
            {/*<DtcRow
              label="Регион выгрузки"
              value={load.unloadingRegion?.join(", ") || "—"}
              block
            />
            <DtcRow
              label="Округ выгрузки"
              value={(load.unloadingDistrict ?? []).join(", ") || "—"}
              block
            />*/}
            <DtcRow
              label="Дата погрузки"
              value={load.loadingDate ? load.loadingDate.toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }) : "—"}
            />
            <DtcRow label="НДС" value={load.vatType} />
            <DtcRow
              label="Требуемый способ загрузки"
              value={load.loadingType?.join(", ") || "—"}
              block
            />
            <DtcRow
              label="Требуемый способ выгрузки"
              value={load.unloadingType?.join(", ") || "—"}
              block
            />
            <DtcRow label="Компания" value={load.companyName} />

            {load.customProperties.map((prop) => (
              <DtcRow key={prop.name} label={prop.name} value={prop.value} />
            ))}
            <DtcRow
              label="Доп. информация"
              value={load.additionalInfo || "—"}
              block
            />
          </div>

          <div className="flex items-end justify-between gap-4 flex-wrap mt-5 pt-4 border-t border-[#0D0D0D0F]">
            <div className="flex items-center gap-4">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 flex-none text-text-muted"
              >
                <path d="M6.6 10.8c1.5 2.7 3.9 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4c0-.6.4-1 1-1h3.3c.6 0 1 .4 1 1 0 1.2.2 2.4.7 3.5.1.3.1.7-.3 1z" />
              </svg>
              <span className="flex flex-col text-sm text-text-secondary tracking-[-0.14px]">
                <span>{load.customerName}</span>
                <a
                  href={`tel:${load.customerPhone}`}
                  className="text-base font-medium text-text-primary tracking-[-0.16px] tabular-nums no-underline transition-colors duration-150 hover:text-accent"
                >
                  {load.customerPhone}
                </a>
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className="inline-flex items-center justify-center h-9 px-4 rounded-pill border-[0.8px] border-[#0D0D0D1A] bg-white text-sm text-text-secondary tracking-[-0.14px] whitespace-nowrap transition-colors duration-150 hover:text-text-primary hover:border-[#0D0D0D33]"
            >Закрыть заявку</button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DtcRowProps {
  label: string;
  value: string;
  block?: boolean;
}

function DtcRow({ label, value, block = false }: DtcRowProps) {
  return (
    <div
      className={
        "flex items-baseline justify-between gap-4 py-[11px] border-b border-[#0D0D0D0F] last:border-b-0 " +
        (block ? "flex-col items-start gap-1" : "")
      }
    >
      <span className="text-xs text-text-muted whitespace-nowrap">
        {label}
      </span>
      {block ? (
        <span className="text-sm text-text-secondary leading-[1.5] tracking-[-0.14px]">
          {value}
        </span>
      ) : (
        <span className="text-base font-medium text-text-primary tracking-[-0.16px] text-right tabular-nums">
          {value}
        </span>
      )}
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18"></path>
      <path d="m6 6 12 12"></path>
    </svg>
  );
}

function RouteArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14"></path>
      <path d="m13 6 6 6-6 6"></path>
    </svg>
  );
}
