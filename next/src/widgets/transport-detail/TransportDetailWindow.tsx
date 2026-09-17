"use client";

import { useEffect } from "react";
import type { Transport } from "@/entities/transport/model";
import { getAvailabilityDisplay } from "@/entities/transport/model";
import { LoadDetailMap } from "@/widgets/loads-map";

interface TransportDetailWindowProps {
  transport: Transport;
  onClose: () => void;
}

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 max-[900px]:items-start max-[900px]:p-4 max-[560px]:p-3">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-[1000px] h-[80vh] bg-white border border-[#ECECEC] rounded-[24px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.2)] grid grid-cols-2 max-[900px]:grid-cols-1 max-[900px]:h-auto max-[900px]:max-h-[80vh]">
        <div className="min-h-0 max-[900px]:h-[220px] max-[900px]:order-first bg-bg-subtle">
          <LoadDetailMap
            location={transport.transportLocation}
            className="h-full w-full"
          />
        </div>

        <div className="min-h-0 overflow-y-auto overscroll-contain p-8 [scrollbar-width:thin] [scrollbar-color:#E0E0E0_transparent] max-[900px]:overflow-visible max-[900px]:p-6 max-[560px]:px-4 max-[560px]:py-5">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <h2 className="text-[20px] font-medium leading-[1.25] text-text-primary tracking-[-0.7px]">
                {transport.transportType}
              </h2>
              <p className="mt-1 text-sm text-text-secondary leading-[1.43] tracking-[-0.14px]">
                {transport.bodyType}
              </p>
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
            <div className="w-[120px] h-[120px] shrink-0 aspect-square bg-[#EBEDEB] rounded-[16px] flex items-center justify-center overflow-hidden">
              <img
                src="/photoTr1.png"
                alt=""
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <span className="text-xs text-text-muted whitespace-nowrap">
              Доступность
            </span>
            <span className="inline-flex items-center h-5 px-2.5 rounded-pill bg-bg-subtle text-xs font-medium text-accent whitespace-nowrap">
              {availability.type}
              {availability.date ? ` до ${availability.date}` : ""}
            </span>
          </div>

          <div className="mt-2">
            <DtcRow label="Тоннаж / объём" value={`${capacity} · ${volume}`} />
            <DtcRow label="Регионы" value={transport.workDistricts.join(", ")} />
            <DtcRow label="НДС" value={transport.vatType} />
            <DtcRow label="Минимальная ставка" value={rate} accent />
            <DtcRow
              label="Способ погрузки"
              value={transport.loadingType?.join(", ") || "—"}
            />
            <DtcRow
              label="Способ выгрузки"
              value={transport.unloadingType?.join(", ") || "—"}
            />
            <DtcRow
              label="Субъекты округов"
              value={transport.workRegions?.join(", ") || "—"}
              small
            />
            <DtcRow label="Минимальная ставка за рейс" value={tripRate} />
            <DtcRow
              label="Дополнительная информация"
              value={transport.additionalInfo || "—"}
              block
            />
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap mt-5 pt-4 border-t border-[#0D0D0D0F]">
            <div className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 flex-none text-text-muted"
              >
                <path d="M6.6 10.8c1.5 2.7 3.9 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4c0-.6.4-1 1-1h3.3c.6 0 1 .4 1 1 0 1.2.2 2.4.7 3.5.1.3.1.7-.3 1z" />
              </svg>
              <span className="text-sm text-text-secondary tracking-[-0.14px]">
                {transport.contactName} ·{" "}
                <a
                  href={`tel:${transport.contactPhone}`}
                  className="text-base font-medium text-text-primary tracking-[-0.16px] tabular-nums no-underline transition-colors duration-150 hover:text-accent"
                >
                  {transport.contactPhone}
                </a>
              </span>
            </div>
            <a
              href="#"
              className="inline-flex items-center justify-center h-9 px-4 rounded-pill border-[0.8px] border-[#0D0D0D1A] bg-white text-sm text-text-secondary tracking-[-0.14px] whitespace-nowrap transition-colors duration-150 hover:text-text-primary hover:border-[#0D0D0D33]"
            >
              Подробнее
            </a>
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
        "flex items-baseline justify-between gap-4 py-[11px] border-b border-[#0D0D0D0F] last:border-b-0 " +
        (block ? "flex-col items-start gap-1" : "")
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
