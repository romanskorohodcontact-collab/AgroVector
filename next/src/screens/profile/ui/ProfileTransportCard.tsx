import Link from "next/link";
import type { Transport } from "@/entities/transport/model";
import { getAvailabilityDisplay } from "@/entities/transport/model";
import { EditIcon } from "@/shared/ui/EditIcon";

const AVAILABILITY_COLORS: Record<string, { bg: string; text: string }> = {
  "Свободен": { bg: "bg-[#E9F3EC]", text: "text-[#23793D]" },
  "Занят": { bg: "bg-[#FFF4E5]", text: "text-[#A86400]" },
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
    <article className="gap-6 items-stretch bg-white border border-[#ECECEC] rounded-[24px] p-5 max-[640px]:grid-cols-1">

      <div className="flex flex-col justify-between">


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

      {/*Добавить удобную кнопку изменить статус*/}
      {availability.type}!!!

      <div className="flex gap-2 mt-4">
        {editable ? (
          <Link
            href={`/transports/${transport.id}/edit`}
            className="w-full h-9 rounded-pill bg-bg-subtle text-[14px] font-medium text-text-primary tracking-[-0.16px] flex items-center justify-center gap-1.5 transition-colors duration-150 hover:bg-[#EFEFEF]"
          >
            <EditIcon />
            Редактировать
          </Link>
        ) : null}
        {onOpenDetail ? (
          <button
            type="button"
            onClick={onOpenDetail}
            className="w-full h-9 rounded-pill bg-[#333333] border border-[#0D0D0D1A] text-[14px] font-medium text-white tracking-[-0.16px] flex items-center justify-center transition-colors duration-150 hover:border-[#0D0D0D2E] hover:text-white cursor-pointer"
          >
            Подробнее
          </button>
        ) : (
          <a
            href="#"
            className="w-full h-9 rounded-pill bg-[#333333] border border-[#0D0D0D1A] text-[14px] font-medium text-white tracking-[-0.16px] flex items-center justify-center transition-colors duration-150 hover:border-[#0D0D0D2E] hover:text-white"
          >
            Подробнее
          </a>
        )}
      </div>


    </article>
  );
}
