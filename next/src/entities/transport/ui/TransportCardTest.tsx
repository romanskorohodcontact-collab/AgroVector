import truck3 from "./truck3.jpg";
import type { Transport } from "../model";
import { getAvailabilityDisplay } from "../model";
import { ArrowUpRight } from "lucide-react";

// Не используются: id, userId, loadingType, unloadingType, workRegions, additionalInfo

const AVAILABILITY_COLORS: Record<string, { bg: string; text: string }> = {
  "Свободен": { bg: "bg-success-soft", text: "text-accent" },
  "Занят": { bg: "bg-warning-soft", text: "text-warning" },
};

interface TransportCardProps {
  transport: Transport;
  onOpenDetail?: () => void;
}

export function TransportCardTest({ transport, onOpenDetail }: TransportCardProps) {
  const availability = getAvailabilityDisplay(
    transport.availability.type,
    transport.availability.date,
  );

  const colors = AVAILABILITY_COLORS[availability.type] ?? AVAILABILITY_COLORS["Свободен"];

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
    <article className="relative flex flex-col overflow-hidden gap-4 items-stretch bg-bg-surface border border-border rounded-3xl p-5">
      <div className="absolute top-0 right-0 w-1/2 aspect-square overflow-hidden z-0">
        <img
          src={truck3.src}
          alt=""
          className="h-full w-full object-cover object-left"
        />
      </div>

      <div className="relative z-10">
        {/*Бэйдж отредактировать стили под STYLEDv2.md + убрать хардкор переменные*/}
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

        {/*Основная инфа*/}
        <div className="mt-15 flex flex-col gap-3">
          {/*Тип транспорта*/}
          <div className="flex flex-col gap-1">
            <h3 className="text-[20px] font-medium text-text-primary tracking-[-0.48px] leading-[1.2]">
              {/*text-[24px]*/}
              {transport.transportType}
            </h3>
            <p className="text-[14px] text-text-secondary tracking-[-0.14px] leading-[1.43]">
              {transport.bodyType}
            </p>
          </div>
          {/*Бэджи перевозимыз грузов*/}
          <div className="flex flex-nowrap gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {transport.cargoTypes.map((cargo) => (
              <span
                key={cargo}
                className="inline-flex items-center px-[10px] py-[5px] rounded-pill bg-bg-subtle text-[12px] text-text-secondary whitespace-nowrap shrink-0"
              >
                {cargo}
              </span>
            ))}
          </div>

          <div className="border-b border-border" />

          {/*Блок с основной инфой*/}
          <div className="flex flex-col gap-2 ">
            <div className="flex items-baseline justify-between text-[14px] tracking-[-0.14px]">
              <span className="text-text-muted flex-none">Тоннаж / объём</span>
              <span className="text-text-primary font-medium text-right tabular-nums">
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
              <span className="text-text-muted flex-none">Мин. ставка за рейс</span>
              <span className="text-text-primary font-medium text-right tabular-nums">
                от {tripRate}
              </span>
            </div>
            <div className="flex items-baseline justify-between text-[14px] tracking-[-0.14px]">
              <span className="text-text-muted flex-none">Мин. ставка</span>
              <span className="text-accent font-medium text-right tabular-nums">
                от {rate}
              </span>
            </div>
          </div>

          <div className="border-b border-border" />

          {/*Контакты + btn Подробнее*/}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0 text-[14px]">
              <span className="text-text-secondary tabular-nums"> {transport.contactName}</span>
              <span className="font-medium text-text-primary tabular-nums">{transport.contactPhone}</span>
            </div>

            {onOpenDetail ? (
              <button
                type="button"
                onClick={onOpenDetail}
                className="flex gap-2 mt-auto px-5 h-9 rounded-pill bg-bg-inverse border border-outline text-[14px] font-medium text-text-inverse tracking-[-0.16px] items-center justify-center transition-colors duration-150 hover:border-outline-hover hover:text-text-inverse cursor-pointer"
              >
                Подробнее
                <ArrowUpRight className="h-4 w-4" />
              </button>
            ) : (
              <a
                href="#"
                className="mt-auto w-full h-9 rounded-pill bg-bg-inverse border border-outline text-[14px] font-medium text-text-inverse tracking-[-0.16px] flex items-center justify-center transition-colors duration-150 hover:border-outline-hover hover:text-text-inverse"
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



//     <div className="flex items-center justify-between gap-4 flex-wrap mt-4">
//       <div className="flex items-center gap-2 text-[14px] text-text-secondary tracking-[-0.14px] leading-[1.43]">
//         <svg
//           viewBox="0 0 24 24"
//           fill="currentColor"
//           className="w-4 h-4 text-text-muted flex-none mr-2"
//         >

//           <path d="M6.6 10.8c1.5 2.7 3.9 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4c0-.6.4-1 1-1h3.3c.6 0 1 .4 1 1 0 1.2.2 2.4.7 3.5.1.3.1.7-.3 1z" />
//         </svg>



//   <div className="flex flex-col gap-0.5">
//     <div className="aspect-square bg-bg-subtle rounded-[16px] flex items-center justify-center overflow-hidden">
//       <img
//         src="/photoTr1.png"
//         alt=""
//         className="max-w-full max-h-full object-contain"
//       />

//     </div>
// <div className={`${colors.bg} rounded-[14px] p-[14px] flex flex-col gap-0 mt-3 text-center mb-2`}>
//   <p className={`text-[20px] font-medium leading-[1.25] ${colors.text} tracking-[-0.7px]`}>
//     {availability.type}
//   </p>
//   {availability.date ? (
//     <p className={`text-[14px] font-normal leading-[1.43] ${colors.text} tracking-[-0.14px]`}>
//       до {availability.date}
//     </p>
//   ) : null}
// </div>
//
//   </div>
// </article>
