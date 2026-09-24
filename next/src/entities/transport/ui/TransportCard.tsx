import type { Transport } from "../model";
import { getAvailabilityDisplay } from "../model";

// Не используются: id, userId, loadingType, unloadingType, workRegions, additionalInfo

const AVAILABILITY_COLORS: Record<string, { bg: string; text: string }> = {
  "Свободен": { bg: "bg-[#E9F3EC]", text: "text-[#23793D]" },
  "Занят": { bg: "bg-[#FFF4E5]", text: "text-[#A86400]" },
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
    <article className="grid grid-cols-[2fr_1fr] gap-6 items-stretch bg-white border border-[#ECECEC] rounded-[24px] p-5 max-[640px]:grid-cols-1">

      <div className="flex flex-col justify-between">
        <div>

          <div>
            <h3 className="text-[24px] font-medium text-text-primary tracking-[-0.48px] leading-[1.2]">
              {transport.transportType}
            </h3>
            <p className="text-[14px] text-text-secondary tracking-[-0.14px] leading-[1.43] mt-[3px]">
              {transport.bodyType}
            </p>
          </div>

          <div className="flex flex-nowrap gap-2 my-3.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {transport.cargoTypes.map((cargo) => (
              <span
                key={cargo}
                className="inline-flex items-center px-[10px] py-[5px] rounded-pill bg-bg-subtle text-[12px] text-text-secondary whitespace-nowrap shrink-0"
              >
                {cargo}
              </span>
            ))}
          </div>

          <div className="flex items-baseline justify-between gap-4 py-[7px] border-b border-[#0D0D0D0F] text-[14px] tracking-[-0.14px]">
            <span className="text-text-muted flex-none">Тоннаж / объём</span>
            <span className="text-text-primary font-medium text-right tabular-nums">
              {capacity} · {volume}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-[7px] border-b border-[#0D0D0D0F] text-[14px] tracking-[-0.14px]">
            <span className="text-text-muted flex-none">НДС</span>
            <span className="text-text-primary font-medium text-right">
              {transport.vatType}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-[7px] border-b border-[#0D0D0D0F] text-[14px] tracking-[-0.14px]">
            <span className="text-text-muted flex-none">Минимальная ставка</span>
            <span className="text-accent font-medium text-right tabular-nums">
              от {rate}
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-4 py-[7px] border-b border-[#0D0D0D0F] text-[14px] tracking-[-0.14px]">
            <span className="text-text-muted flex-none">Минимальная ставка за рейс</span>
            <span className="text-text-primary font-medium text-right tabular-nums">
              от {tripRate}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap mt-4">
          <div className="flex items-center gap-2 text-[14px] text-text-secondary tracking-[-0.14px] leading-[1.43]">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 text-text-muted flex-none mr-2"
            >

              <path d="M6.6 10.8c1.5 2.7 3.9 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4c0-.6.4-1 1-1h3.3c.6 0 1 .4 1 1 0 1.2.2 2.4.7 3.5.1.3.1.7-.3 1z" />
            </svg>

            <span>
              {transport.contactName} ·{" "}
              <a
                href={`tel:${transport.contactPhone}`}
                className="font-medium text-text-primary tabular-nums"
              >
                {transport.contactPhone}
              </a>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        <div className="aspect-square bg-[#F6F6F6] rounded-[16px] flex items-center justify-center overflow-hidden">
          <img
            src="/photoTr1.png"
            alt=""
            className="max-w-full max-h-full object-contain"
          />

        </div>
        <div className={`${colors.bg} rounded-[14px] p-[14px] flex flex-col gap-0 mt-3 text-center mb-2`}>
          <p className={`text-[20px] font-medium leading-[1.25] ${colors.text} tracking-[-0.7px]`}>
            {availability.type}
          </p>
          {availability.date ? (
            <p className={`text-[14px] font-normal leading-[1.43] ${colors.text} tracking-[-0.14px]`}>
              до {availability.date}
            </p>
          ) : null}
        </div>
        {onOpenDetail ? (
          <button
            type="button"
            onClick={onOpenDetail}
            className="mt-auto w-full h-9 rounded-pill bg-[#333333] border border-[#0D0D0D1A] text-[14px] font-medium text-white tracking-[-0.16px] flex items-center justify-center transition-colors duration-150 hover:border-[#0D0D0D2E] hover:text-text-primary cursor-pointer"
          >
            Подробнее
          </button>
        ) : (
          <a
            href="#"
            className="mt-auto w-full h-9 rounded-pill bg-[#333333] border border-[#0D0D0D1A] text-[14px] font-medium text-white tracking-[-0.16px] flex items-center justify-center transition-colors duration-150 hover:border-[#0D0D0D2E] hover:text-text-primary"
          >
            Подробнее
          </a>
        )}
      </div>
    </article>
  );
}
