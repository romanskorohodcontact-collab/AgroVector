import truck3 from "./truck3.jpg";
import type { Transport } from "../model";
import { getAvailabilityDisplay } from "../model";
import { ArrowUpRight } from "lucide-react";

// Не используются: id, userId, loadingType, unloadingType, workRegions, additionalInfo

const AVAILABILITY_COLORS: Record<string, { bg: string; text: string }> = {
  Свободен: { bg: "bg-success-soft", text: "text-accent" },
  Занят: { bg: "bg-warning-soft", text: "text-warning" },
};

interface TransportCardProps {
  transport: Transport;
  onOpenDetail?: () => void;
}

export function TransportCard({ transport, onOpenDetail }: TransportCardProps) {
  const availability = getAvailabilityDisplay(
    transport.availability.type,
    transport.availability.date,
  );

  const colors = AVAILABILITY_COLORS[availability.type] ?? AVAILABILITY_COLORS["Свободен"];

  const capacity = transport.loadCapacityTons != null ? `${transport.loadCapacityTons} т` : "—";
  const volume = transport.bodyVolumeM3 != null ? `${transport.bodyVolumeM3} м³` : "—";
  const rate = transport.minRatePerKm != null ? `${transport.minRatePerKm} ₽/км` : "—";
  const tripRate =
    transport.minTripRate != null ? `${transport.minTripRate.toLocaleString("ru-RU")} ₽` : "—";

  return (
    <article className="relative flex flex-col items-stretch gap-4 overflow-hidden rounded-3xl border border-border bg-bg-surface p-5">
      {/*<div className="absolute top-0 right-0 w-1/2 aspect-square overflow-hidden z-0">
        <img
          src={truck3.src}
          alt=""
          className="h-full w-full object-cover object-left"
        />
      </div>*/}

      <div className="relative z-10">
        {/*Бэйдж отредактировать стили под STYLEDv2.md + убрать хардкор переменные*/}
        {/*<div className={`${colors.bg} px-4 py-1 rounded-full text-[12px] flex gap-2 w-fit`}>
          <p className={`${colors.text} tracking-[-0.7px] font-medium`}>
            {availability.type}
          </p>
          {availability.date ? (
            <p className={`font-normal leading-[1.43] ${colors.text} tracking-[-0.14px]`}>
              до {availability.date}
            </p>
          ) : null}
        </div>*/}

        {/*Основная инфа*/}
        <div className="mt- 15 flex flex-col gap-3">
          {/*Тип транспорта*/}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-[20px] leading-[1.2] font-medium tracking-[-0.48px] text-text-primary">
                {/*text-[24px]*/}
                {transport.transportType}
              </h3>
              <p className="text-[14px] leading-[1.43] tracking-[-0.14px] text-text-secondary">
                {transport.bodyType}
              </p>
            </div>

            <div className={`${colors.bg} flex w-fit gap-2 rounded-full px-4 py-1 text-[12px]`}>
              <p className={`${colors.text} font-medium tracking-[-0.7px]`}>{availability.type}</p>
              {availability.date ? (
                <p className={`leading-[1.43] font-normal ${colors.text} tracking-[-0.14px]`}>
                  до {availability.date}
                </p>
              ) : null}
            </div>
          </div>
          {/*Бэджи перевозимыз грузов*/}
          <div className="flex [scrollbar-width:none] flex-nowrap gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {transport.cargoTypes.map((cargo) => (
              <span
                key={cargo}
                className="inline-flex shrink-0 items-center rounded-pill bg-bg-subtle px-[10px] py-[5px] text-[12px] whitespace-nowrap text-text-secondary"
              >
                {cargo}
              </span>
            ))}
          </div>

          <div className="border-b border-border" />

          {/*Блок с основной инфой*/}
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between text-[14px] tracking-[-0.14px]">
              <span className="flex-none text-text-muted">Тоннаж / объём</span>
              <span className="text-right font-medium text-text-primary tabular-nums">
                {capacity} · {volume}
              </span>
            </div>
            {/*<div className="flex items-baseline justify-between text-[14px] tracking-[-0.14px]">
              <span className="text-text-muted flex-none">НДС</span>
              <span className="text-text-primary font-medium text-right">
                {transport.vatType}
              </span>
            </div>*/}
            <div className="flex items-baseline justify-between text-[14px] tracking-[-0.14px]">
              <span className="flex-none text-text-muted">Мин. ставка за рейс</span>
              <span className="text-right font-medium text-text-primary tabular-nums">
                от {tripRate}
              </span>
            </div>
            <div className="flex items-baseline justify-between text-[14px] tracking-[-0.14px]">
              <span className="flex-none text-text-muted">Мин. ставка</span>
              <span className="text-right font-medium text-accent tabular-nums">от {rate}</span>
            </div>
          </div>

          <div className="border-b border-border" />

          {/*Контакты + btn Подробнее*/}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0 text-[14px]">
              <span className="text-text-secondary tabular-nums"> {transport.contactName}</span>
              <span className="font-medium text-text-primary tabular-nums">
                {transport.contactPhone}
              </span>
            </div>

            {onOpenDetail ? (
              <button
                type="button"
                onClick={onOpenDetail}
                className="mt-auto flex h-9 cursor-pointer items-center justify-center gap-2 rounded-pill border border-outline bg-bg-inverse px-5 text-[14px] font-medium tracking-[-0.16px] text-text-inverse transition-colors duration-150 hover:border-outline-hover hover:text-text-inverse"
              >
                Подробнее
                <ArrowUpRight className="h-4 w-4" />
              </button>
            ) : (
              <a
                href="#"
                className="mt-auto flex h-9 w-full items-center justify-center rounded-pill border border-outline bg-bg-inverse text-[14px] font-medium tracking-[-0.16px] text-text-inverse transition-colors duration-150 hover:border-outline-hover hover:text-text-inverse"
              >
                Подробнее
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
