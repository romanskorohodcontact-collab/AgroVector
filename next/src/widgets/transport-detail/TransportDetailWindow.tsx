"use client";

import { useEffect } from "react";
import type { Transport } from "@/entities/transport/model";
import { getAvailabilityDisplay } from "@/entities/transport/model";
import truck3 from "@/entities/transport/ui/truck3.jpg";
import { LoadDetailMap } from "@/widgets/loads-map";

interface TransportDetailWindowProps {
  transport: Transport;
  onClose: () => void;
}

const AVAILABILITY_COLORS: Record<string, { bg: string; text: string }> = {
  "Свободен": { bg: "bg-success-soft", text: "text-accent" },
  "Занят": { bg: "bg-warning-soft", text: "text-warning" },
};


export function TransportDetailWindow({
  transport,
  onClose,
}: TransportDetailWindowProps) {
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

  const availability = getAvailabilityDisplay(
    transport.availability.type,
    transport.availability.date,
  );

  const capacity =
    transport.loadCapacityTons != null ? `${transport.loadCapacityTons} т` : "—";
  const volume =
    transport.bodyVolumeM3 != null ? `${transport.bodyVolumeM3} м³` : "—";
  const rate =
    transport.minRatePerKm != null ? `${transport.minRatePerKm} ₽/км` : "—";
  const tripRate =
    transport.minTripRate != null
      ? `${transport.minTripRate.toLocaleString("ru-RU")} ₽`
      : "—";

  const createdAt = transport.createdAt
    ? new Date(transport.createdAt as unknown as string)
    : null;
  const createdAtLabel =
    createdAt && !Number.isNaN(createdAt.getTime())
      ? createdAt.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      : "—";

  const colors = AVAILABILITY_COLORS[availability.type] ?? AVAILABILITY_COLORS["Свободен"];


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 max-[900px]:items-start max-[900px]:p-4 max-[560px]:p-3">
      <div
        className="absolute inset-0 bg-bg-overlay"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-[1000px] h-[80vh] bg-bg-surface border border-border rounded-[24px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.2)] grid grid-cols-2 max-[900px]:grid-cols-1 max-[900px]:h-auto max-[900px]:max-h-[80vh]">
        <div className="min-h-0 max-[900px]:h-[220px] max-[900px]:order-first bg-bg-subtle">
          <LoadDetailMap
            location={transport.transportLocation}
            className="h-full w-full"
          />
        </div>

        <div className="relative min-h-0 overflow-y-auto overscroll-contain p-8 [scrollbar-width:thin] [scrollbar-color:var(--color-border)_transparent] max-[900px]:overflow-visible max-[900px]:p-6 max-[560px]:px-4 max-[560px]:py-5">
          {/*<div className="absolute -top-5 right-0 w-1/2 aspect-square overflow-hidden z-0 max-[900px]:top-0">
            <img
              src={truck3.src}
              alt=""
              className="h-full w-full object-cover object-left"
            />
          </div>*/}

          <div className="relative z-10 min-w-0">
            {/*Бэйдж Доступность*/}

            <div className="flex justify-between items-start">
              <div>
                <h2 className="mt- 15 text-[20px] font-medium leading-[1.25] text-text-primary tracking-[-0.7px]">
                  {transport.transportType}
                </h2>
                <p className="mt-1 text-sm text-text-secondary leading-[1.43] tracking-[-0.14px]">
                  {transport.bodyType}
                </p>
              </div>

              <div className={`${colors.bg} px-4 py-1 rounded-full text-[12px] flex gap-2 w-fit`}>
                <p className={`${colors.text} tracking-[-0.7px] font-medium`}>
                  {availability.type}
                </p>
                {availability.date ? (
                  <p className={`font-normal leading-[1.43] ${colors.text} tracking-[-0.14px]`}>
                    до {availability.date}
                  </p>
                ) : null}
              </div>
            </div>



            <div className="flex flex-wrap gap-2 mt-3">
              {transport.cargoTypes.map((cargo) => (
                <span
                  key={cargo}
                  className="inline-flex items-center h-5 px-2.5 rounded-pill bg-bg-subtle text-xs text-text-secondary tracking-[-0.16px] whitespace-nowrap"
                >
                  {cargo}
                </span>
              ))}
            </div>

          </div>



          <div className="relative z-10 mt-10">
            <div className="border-b border-border" />
            <DtcRow label="Тоннаж / объём" value={`${capacity} · ${volume}`} />
            <DtcRow label="Минимальная ставка" value={rate} accent />
            <DtcRow label="Минимальная ставка за рейс" value={tripRate} />
            <DtcRow label="НДС" value={transport.vatType} />
            {/*<DtcRow label="Дата размещения" value={createdAtLabel} />*/}

            <div className="border-b border-border" />


            <DtcRow label="Округа работы" value={transport.workDistricts.join(", ")}
              block
              small
            />
            <DtcRow
              label="Субъекты округов"
              value={transport.workRegions?.join(", ") || "—"}
              small
              block
            />
            <DtcRow
              label="Способ погрузки"
              value={transport.loadingType?.join(", ") || "—"}
              block
              small
            />
            <DtcRow
              label="Способ выгрузки"
              value={transport.unloadingType?.join(", ") || "—"}
              block
              small
            />
            <div className="border-b border-border" />

            <DtcRow
              label="Дополнительная информация"
              value={transport.additionalInfo || "—"}
              block
            />
            {/*Контакты*/}
            <div className="flex justify-between items-start gap-4 mt-2">
              <span className="text-xs text-text-muted whitespace-nowrap">
                Контакты
              </span>
              <span className="flex flex-col items-end text-sm text-text-secondary tracking-[-0.14px]">
                <span>{transport.contactName}</span>
                <a
                  className="text-base font-medium text-text-primary tracking-[-0.16px] tabular-nums no-underline transition-colors duration-150 hover:text-accent"
                >
                  {transport.contactPhone}
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
  accent?: boolean;
  small?: boolean;
  block?: boolean;
}

function DtcRow({ label, value, accent = false, small = false, block = false }: DtcRowProps) {
  return (
    <div
      className={
        "flex items-baseline justify-between py-2 " +
        (block ? "flex-col items-start gap-1" : "gap-4")
      }
    >
      <span className="text-xs text-text-muted whitespace-nowrap">{label}</span>
      {block ? (
        <span className="text-sm text-text-secondary leading-[1.5] tracking-[-0.14px]">
          {value}
        </span>
      ) : small ? (
        <span className="text-sm text-text-secondary text-right tracking-[-0.14px]">
          {value}
        </span>
      ) : (
        <span
          className={
            "text-base font-medium tracking-[-0.16px] text-right tabular-nums " +
            (accent ? "text-accent" : "text-text-primary")
          }
        >
          {value}
        </span>
      )}
    </div>
  );
}
