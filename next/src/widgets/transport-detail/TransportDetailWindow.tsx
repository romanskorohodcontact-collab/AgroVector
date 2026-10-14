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
  Свободен: { bg: "bg-success-soft", text: "text-accent" },
  Занят: { bg: "bg-warning-soft", text: "text-warning" },
};

export function TransportDetailWindow({ transport, onClose }: TransportDetailWindowProps) {
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

  const capacity = transport.loadCapacityTons != null ? `${transport.loadCapacityTons} т` : "—";
  const volume = transport.bodyVolumeM3 != null ? `${transport.bodyVolumeM3} м³` : "—";
  const rate = transport.minRatePerKm != null ? `${transport.minRatePerKm} ₽/км` : "—";
  const tripRate =
    transport.minTripRate != null ? `${transport.minTripRate.toLocaleString("ru-RU")} ₽` : "—";

  const createdAt = transport.createdAt ? new Date(transport.createdAt as unknown as string) : null;
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
      <div className="absolute inset-0 bg-bg-overlay" onClick={onClose} aria-hidden="true" />

      <div className="relative grid h-[80vh] w-full max-w-[1000px] grid-cols-2 overflow-hidden rounded-[24px] border border-border bg-bg-surface shadow-[0_24px_60px_rgba(0,0,0,0.2)] max-[900px]:h-auto max-[900px]:max-h-[80vh] max-[900px]:grid-cols-1">
        <div className="min-h-0 bg-bg-subtle max-[900px]:order-first max-[900px]:h-[220px]">
          <LoadDetailMap location={transport.transportLocation} className="h-full w-full" />
        </div>

        <div className="relative min-h-0 [scrollbar-width:thin] [scrollbar-color:var(--color-border)_transparent] overflow-y-auto overscroll-contain p-8 max-[900px]:overflow-visible max-[900px]:p-6 max-[560px]:px-4 max-[560px]:py-5">
          <div className="relative z-10 min-w-0">
            {/*Бэйдж Доступность*/}

            <div className="flex items-start justify-between">
              <div>
                <h2 className="mt- 15 text-[20px] leading-[1.25] font-medium tracking-[-0.7px] text-text-primary">
                  {transport.transportType}
                </h2>
                <p className="mt-1 text-sm leading-[1.43] tracking-[-0.14px] text-text-secondary">
                  {transport.bodyType}
                </p>
              </div>

              <div className={`${colors.bg} flex w-fit gap-2 rounded-full px-4 py-1 text-[12px]`}>
                <p className={`${colors.text} font-medium tracking-[-0.7px]`}>
                  {availability.type}
                </p>
                {availability.date ? (
                  <p className={`leading-[1.43] font-normal ${colors.text} tracking-[-0.14px]`}>
                    до {availability.date}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {transport.cargoTypes.map((cargo) => (
                <span
                  key={cargo}
                  className="inline-flex h-5 items-center rounded-pill bg-bg-subtle px-2.5 text-xs tracking-[-0.16px] whitespace-nowrap text-text-secondary"
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

            <DtcRow label="Округа работы" value={transport.workDistricts.join(", ")} block small />
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
            <div className="mt-2 flex items-start justify-between gap-4">
              <span className="text-xs whitespace-nowrap text-text-muted">Контакты</span>
              <span className="flex flex-col items-end text-sm tracking-[-0.14px] text-text-secondary">
                <span>{transport.contactName}</span>
                <a className="text-base font-medium tracking-[-0.16px] text-text-primary tabular-nums no-underline transition-colors duration-150 hover:text-accent">
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
      <span className="text-xs whitespace-nowrap text-text-muted">{label}</span>
      {block ? (
        <span className="text-sm leading-[1.5] tracking-[-0.14px] text-text-secondary">
          {value}
        </span>
      ) : small ? (
        <span className="text-right text-sm tracking-[-0.14px] text-text-secondary">{value}</span>
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
