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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 max-[900px]:items-start max-[900px]:p-4 max-[560px]:p-3">
      <div className="absolute inset-0 bg-bg-overlay" onClick={onClose} aria-hidden="true" />

      <div className="relative grid h-[80vh] w-full max-w-[1000px] grid-cols-2 overflow-hidden rounded-[24px] border border-border bg-bg-surface shadow-[0_24px_60px_rgba(0,0,0,0.2)] max-[900px]:h-auto max-[900px]:max-h-[80vh] max-[900px]:grid-cols-1">
        <div className="min-h-0 bg-bg-subtle max-[900px]:order-first max-[900px]:h-[220px]">
          <LoadDetailMap location={load.loadingLocation} className="h-full w-full" />
        </div>

        <div className="min-h-0 [scrollbar-width:thin] [scrollbar-color:var(--color-border)_transparent] overflow-y-auto overscroll-contain p-8 max-[900px]:overflow-visible max-[900px]:p-6 max-[560px]:px-4 max-[560px]:py-5">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              {/*<span className="block mb-1.5 text-xs text-text-muted whitespace-nowrap">
                № {load.id}
              </span>*/}
              <h1 className="text-[20px] leading-[1.25] font-medium tracking-[-0.7px] text-text-primary">
                {load.cargo}
              </h1>
              <p className="mt-1 text-sm leading-[1.43] tracking-[-0.14px] text-text-secondary">
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
            {/*<button
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className="flex items-center justify-center w-8 h-8 shrink-0 rounded-pill bg-text-primary text-white transition-colors duration-150 hover:bg-text-primary/90"
            >
              <CloseIcon />
            </button>*/}

            {/*<div className="mt-5  w-[100px] h-[100px] shrink-0  aspect-square bg-bg-subtle rounded-[16px] flex items-center justify-center overflow-hidden">
              <img
                src="/photoTr1.png"
                alt=""
                className="max-w-full max-h-full object-contain"
              />
            </div>*/}
          </div>

          <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl bg-bg-subtle p-[14px] max-[560px]:grid-cols-1 max-[560px]:gap-2">
            <div className="flex h-full min-w-0 flex-col gap-0.5">
              <span className="text-xs tracking-[-0.12px] text-text-muted">Погрузка</span>
              {/*<strong className="text-base font-semibold text-text-primary tracking-[-0.16px] whitespace-nowrap overflow-hidden text-ellipsis">
                {load.loadingPlace}
              </strong>*/}
              <div className="flex flex-col">
                <span className="mt-1 overflow-hidden text-sm leading-[1.4] font-medium tracking-[-0.14px] text-ellipsis whitespace-nowrap text-text-primary tabular-nums">
                  {load.loadingRegion?.join(", ")}
                </span>
                <span className="text-xs whitespace-nowrap text-text-muted">
                  {" "}
                  {load.loadingPlace}
                </span>
              </div>
            </div>
            <span
              aria-hidden="true"
              className="flex items-center text-text-muted max-[560px]:rotate-90 max-[560px]:justify-start"
            >
              <RouteArrowIcon />
            </span>
            <div className="flex h-full min-w-0 flex-col items-end gap-0.5 text-right max-[560px]:items-start max-[560px]:text-left">
              <span className="text-xs tracking-[-0.12px] text-text-muted">Выгрузка</span>
              {/*<strong className="text-base font-semibold text-text-primary tracking-[-0.16px] whitespace-nowrap overflow-hidden text-ellipsis">
                {load.unloadingPlace}
              </strong>*/}
              <div className="flex flex-col">
                <span className="mt-1 overflow-hidden text-sm leading-[1.4] font-medium tracking-[-0.14px] text-ellipsis whitespace-nowrap text-text-primary tabular-nums">
                  {load.unloadingRegion?.join(", ")}
                </span>
                <span className="text-xs whitespace-nowrap text-text-muted">
                  {load.unloadingPlace}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="border-b border-border" />

            <DtcRow
              label="Тоннаж"
              value={`${load.tonnage.tonnageWeight} ${load.tonnage.tonnageUnit === "ton" ? "т" : "кг"}`}
            />
            <DtcRow label="Километраж" value={`${load.distance.toLocaleString("ru-RU")} км`} />
            <DtcRow label="Ставка за км" value={`${load.ratePerKm.toFixed(2)} ₽/км`} accent />
            <DtcRow label="Ставка за рейс" value={`${load.rate.toLocaleString("ru-RU")} ₽`} />
            {/*<<<<<<< HEAD
            <DtcRow label="НДС" value={load.vatType} />
=======*/}
            <DtcRow label="НДС" value={load.vatType.join(", ") || "—"} />
            {/*>>>>>>> feature/debug*/}

            <div className="border-b border-border" />

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

            <div className="border-b border-border" />

            <DtcRow label="Тип груза" value={load.cargoTypes?.join(", ") || "—"} />
            {/*<<<<<<< HEAD
            <DtcRow label="Тип кузова" value={load.bodyType || "—"} />
            <DtcRow label="Компания" value={load.companyName} />
=======*/}
            <DtcRow label="Тип загрузки груза" value={load.cargoForm || "—"} />
            <DtcRow label="Тип кузова" value={load.bodyType.join(", ") || "—"} />
            <DtcRow label="Компания" value={load.companyName || "—"} />
            {/*>>>>>>> feature/debug*/}
            <DtcRow label="Дата погрузки" value={loadingDateLabel} />

            <div className="border-b border-border" />
            {/*<DtcRow
              label="Округ и регион погрузки"
              value={`${(load.loadingDistrict ?? []).join(", ") || "—"}, ${load.loadingRegion?.join(", ") || "—"}`}
              block
            />*/}

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
            {/*<DtcRow
              label="Округ и регион выгрузки"
              value={`${(load.unloadingDistrict ?? []).join(", ") || "—"}, ${load.unloadingRegion?.join(", ") || "—"}`}
              block
            />*/}
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

            {/*
            {load.customProperties.map((prop) => (
              <DtcRow key={prop.name} label={prop.name} value={prop.value} />
            ))}*/}

            <DtcRow label="Доп. информация" value={load.additionalInfo || "—"} block />
            <div className="mt-2 flex items-start justify-between gap-4">
              <span className="text-xs whitespace-nowrap text-text-muted">Контакты</span>
              <span className="flex flex-col items-end text-sm tracking-[-0.14px] text-text-secondary">
                <span>{load.customerName}</span>
                <a
                  href={`tel:${load.customerPhone}`}
                  className="text-base font-medium tracking-[-0.16px] text-text-primary tabular-nums no-underline transition-colors duration-150 hover:text-accent"
                >
                  {load.customerPhone}
                </a>
              </span>
            </div>
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
  accent?: boolean;
}

function DtcRow({ label, value, block = false, accent = false }: DtcRowProps) {
  return (
    <div
      className={
        "flex items-baseline justify-between py-2 " +
        (block ? "flex-col items-start gap-1" : "gap-4")
      }
    >
      <span className="text-xs whitespace-nowrap text-text-muted">{label}</span>
      {block ? (
        <span className="text-sm leading-[1.5] tracking-[-0.14px] text-text-secondary">
          {value}
        </span>
      ) : (
        <span
          className={
            "text-right text-base font-medium tracking-[-0.16px] tabular-nums " +
            (accent ? "text-accent" : "text-text-primary")
          }
        >
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
