import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Transport } from "@/entities/transport/model";
import { getAvailabilityDisplay } from "@/entities/transport/model";
import truck3 from "@/entities/transport/ui/truck3.jpg";
import { EditIcon } from "@/shared/ui/EditIcon";

const AVAILABILITY_COLORS: Record<string, { bg: string; text: string }> = {
  "Свободен": { bg: "bg-success-soft", text: "text-accent" },
  "Занят": { bg: "bg-warning-soft", text: "text-warning" },
};

interface ProfileTransportCardProps {
  transport: Transport;
  onOpenDetail?: () => void;
  editable?: boolean;
}

export function ProfileTransportCard({
  transport,
  onOpenDetail,
  editable = false,
}: ProfileTransportCardProps) {
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
      {/*<div className="absolute top-0 right-0 w-1/2 aspect-square overflow-hidden z-0">
        <img
          src={truck3.src}
          alt=""
          className="h-full w-full object-cover object-left"
        />
      </div>*/}


      <div className="relative z-10">

        <div className="mt- 15 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <h3 className="text-[20px] font-medium text-text-primary tracking-[-0.48px] leading-[1.2]">
                {transport.transportType}
              </h3>
              <p className="text-[14px] text-text-secondary tracking-[-0.14px] leading-[1.43]">
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

          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between text-[14px] tracking-[-0.14px]">
              <span className="text-text-muted flex-none">Тоннаж / объём</span>
              <span className="text-text-primary font-medium text-right tabular-nums">
                {capacity} · {volume}
              </span>
            </div>
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

          <div className="flex justify-between gap-0 text-[14px]">
            <span className="text-text-secondary tabular-nums">
              {transport.contactName}
            </span>
            <span className="font-medium text-text-primary tabular-nums">
              {transport.contactPhone}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            {editable ? (
              <Link
                href={`/transports/${transport.id}/edit`}
                className="flex-1 h-9 px-3 rounded-pill bg-bg-subtle text-[14px] font-medium text-text-primary tracking-[-0.16px] flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors duration-150 hover:bg-bg-hover"
              >
                {/*<EditIcon />*/}
                Редактировать
              </Link>
            ) : null}
            {onOpenDetail ? (
              <button
                type="button"
                onClick={onOpenDetail}
                className="flex-1 h-9 px-3 rounded-pill bg-bg-inverse border border-outline text-[14px] font-medium text-text-inverse tracking-[-0.16px] flex items-center justify-center gap-2 whitespace-nowrap transition-colors duration-150 hover:border-outline-hover hover:text-text-inverse cursor-pointer"
              >
                Подробнее
                <ArrowUpRight className="h-4 w-4" />
              </button>
            ) : (
              <a
                href="#"
                className="flex-1 h-9 px-3 rounded-pill bg-bg-inverse border border-outline text-[14px] font-medium text-text-inverse tracking-[-0.16px] flex items-center justify-center whitespace-nowrap transition-colors duration-150 hover:border-outline-hover hover:text-text-inverse"
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
