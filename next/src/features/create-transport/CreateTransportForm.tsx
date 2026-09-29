"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { TransportCard } from "@/entities/transport";
import type { Transport } from "@/entities/transport/model";
import { TransportDetailButton } from "@/widgets/transport-detail";
import {
  TRANSPORT_TYPES,
  BODY_TYPES,
  CARGO_TYPES,
  LOADING_TYPES,
  UNLOADING_TYPES,
  VAT_TYPES,
  AVAILABILITY_TYPES,
  AVAILABILITY_DATE_TYPES,
} from "@/entities/transport/model";
import { MapPicker } from "@/features/map";
import type { GeoPoint } from "@/entities/load/model";
import { ChipGroup } from "@/shared/ui/ChipGroup";
import { FormInput, FormSelect, FormTextarea, FIELD_LABEL_INLINE, FIELD_ROW, FIELD_ROW_TOP } from "@/shared/ui/FormInput";
import { DistrictRegionSelector } from "@/shared/ui/DistrictRegionSelector";
import { deriveDistrictsFromRegions, WORK_DISTRICTS_REGIONS } from "@/shared/data/rfRegions";
import type { User } from "@/entities/user";

const formGridClass = "grid grid-cols-1 gap-3";

const sectionTitleClass =
  "text-base font-medium leading-[1.5] text-text-primary tracking-[-0.16px] mb-4";

interface CreateTransportFormProps {
  user?: User;
}

export function CreateTransportForm({ user }: CreateTransportFormProps) {
  const router = useRouter();
  const [location, setLocation] = useState<GeoPoint | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [draft, setDraft] = useState({
    transportType: "",
    bodyType: "",
    loadCapacityTons: "",
    bodyVolumeM3: "",
    cargoTypes: [] as string[],
    loadingType: [] as string[],
    unloadingType: [] as string[],
    workRegions: [] as string[],
    minRatePerKm: "",
    minTripRate: "",
    vatType: "",
    availabilityType: "Свободен",
    availabilityDate: "",
    additionalInfo: "",
    contactName: user?.name ?? "",
    contactPhone: user?.phone ?? "",
  });

  const mutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const response = await fetch("/api/transports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Не удалось создать заявку");
      }
      return response.json();
    },
    onSuccess: () => {
      router.push("/");
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    if (!location) {
      setFormError("Выберите точку на карте");
      return;
    }

    const form = new FormData(event.currentTarget);
    const availabilityType = form.get("availabilityType") as string;
    const isDateType = (AVAILABILITY_DATE_TYPES as readonly string[]).includes(
      availabilityType,
    );
    const date =
      isDateType && form.get("availabilityDate")
        ? new Date(form.get("availabilityDate") as string)
        : null;

    mutation.mutate({
      transportType: form.get("transportType"),
      bodyType: form.get("bodyType"),
      loadCapacityTons: form.get("loadCapacityTons")
        ? Number(form.get("loadCapacityTons"))
        : null,
      bodyVolumeM3: form.get("bodyVolumeM3")
        ? Number(form.get("bodyVolumeM3"))
        : null,
      cargoTypes: draft.cargoTypes,
      loadingType: draft.loadingType.length > 0 ? draft.loadingType : null,
      unloadingType:
        draft.unloadingType.length > 0 ? draft.unloadingType : null,
      workRegions: draft.workRegions.length > 0 ? draft.workRegions : null,
      workDistricts: deriveDistrictsFromRegions(draft.workRegions),
      minRatePerKm: form.get("minRatePerKm")
        ? Number(form.get("minRatePerKm"))
        : null,
      minTripRate: form.get("minTripRate")
        ? Number(form.get("minTripRate"))
        : null,
      vatType: form.get("vatType"),
      availability: { type: availabilityType, date },
      transportLocation: location,
      additionalInfo: form.get("additionalInfo"),
      contactName: form.get("contactName"),
      contactPhone: form.get("contactPhone"),
    });
  }

  const error = formError ?? (mutation.isError ? mutation.error.message : null);

  function handleFieldChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  }

  function toggleArrayItem(
    key: "cargoTypes" | "loadingType" | "unloadingType" | "workRegions",
    item: string
  ) {
    setDraft((prev) => {
      const arr = prev[key];
      const next = arr.includes(item)
        ? arr.filter((x) => x !== item)
        : [...arr, item];
      return { ...prev, [key]: next };
    });
  }

  function toggleDistrict(district: string) {
    const districtRegions = WORK_DISTRICTS_REGIONS[district];
    if (!districtRegions) return;
    setDraft((prev) => {
      const allSelected = districtRegions.every((r) =>
        prev.workRegions.includes(r)
      );
      const next = allSelected
        ? prev.workRegions.filter((r) => !districtRegions.includes(r))
        : [...new Set([...prev.workRegions, ...districtRegions])];
      return { ...prev, workRegions: next };
    });
  }

  const previewTransport: Transport = {
    id: "—",
    transportType: draft.transportType || "Тип транспорта",
    bodyType: draft.bodyType || "Тип кузова",
    loadCapacityTons: draft.loadCapacityTons
      ? Number(draft.loadCapacityTons)
      : null,
    bodyVolumeM3: draft.bodyVolumeM3 ? Number(draft.bodyVolumeM3) : null,
    cargoTypes:
      draft.cargoTypes.length > 0 ? draft.cargoTypes : ["Типы грузов"],
    loadingType: draft.loadingType.length > 0 ? draft.loadingType : null,
    unloadingType:
      draft.unloadingType.length > 0 ? draft.unloadingType : null,
    workRegions: draft.workRegions.length > 0 ? draft.workRegions : null,
    workDistricts: deriveDistrictsFromRegions(draft.workRegions),
    minRatePerKm: draft.minRatePerKm ? Number(draft.minRatePerKm) : null,
    minTripRate: draft.minTripRate ? Number(draft.minTripRate) : null,
    vatType: draft.vatType || "НДС",
    availability: {
      type: draft.availabilityType || "Свободен",
      date:
        (AVAILABILITY_DATE_TYPES as readonly string[]).includes(
          draft.availabilityType,
        ) && draft.availabilityDate
          ? new Date(draft.availabilityDate)
          : null,
    },
    transportLocation: location ?? { lat: 55.7558, lng: 37.6173 },
    additionalInfo: draft.additionalInfo,
    contactName: draft.contactName || "Контактное лицо",
    contactPhone: draft.contactPhone || "+7 (___) ___-__-__",
    createdAt: new Date(),
  };

  const isDateType = (AVAILABILITY_DATE_TYPES as readonly string[]).includes(
    draft.availabilityType,
  );

  return (
    <div className="container-app pb-14 grid grid-cols-[60fr_40fr] gap-6 items-start max-[960px]:grid-cols-1 max-[640px]:pb-10">
      <form
        onSubmit={handleSubmit}
        className="border border-border rounded-[20px] bg-bg-surface p-6 flex flex-col gap-8 max-[640px]:p-4"
      >
        <section>
          <h2 className={sectionTitleClass}>Транспорт</h2>
          <div className="w-full h-1 border-b border-bg-subtle mb-4" />

          <div className={formGridClass}>
            <div className={FIELD_ROW}>
              <label className={FIELD_LABEL_INLINE} htmlFor="f-transport-type">
                Тип транспорта
              </label>
              <FormSelect
                id="f-transport-type"
                name="transportType"
                value={draft.transportType}
                onChange={handleFieldChange}
                required
              >
                <option value="">Выберите тип</option>
                {TRANSPORT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </FormSelect>
            </div>
            <div className="w-full h-1 border-b border-bg-subtle" />

            <div className={FIELD_ROW}>
              <label className={FIELD_LABEL_INLINE} htmlFor="f-body-type">
                Тип кузова
              </label>
              <FormSelect
                id="f-body-type"
                name="bodyType"
                value={draft.bodyType}
                onChange={handleFieldChange}
                required
              >
                <option value="">Выберите тип</option>
                {BODY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </FormSelect>
            </div>
            <div className="w-full h-1 border-b border-bg-subtle" />

            <div className={FIELD_ROW}>
              <label className={FIELD_LABEL_INLINE} htmlFor="f-capacity">
                Грузоподъёмность
              </label>
              <FormInput
                id="f-capacity"
                type="number"
                name="loadCapacityTons"
                value={draft.loadCapacityTons}
                onChange={handleFieldChange}
                placeholder="тонн"
                inputMode="numeric"
                min="0"
                autoComplete="off"
              />
            </div>
            <div className="w-full h-1 border-b border-bg-subtle" />

            <div className={FIELD_ROW}>
              <label className={FIELD_LABEL_INLINE} htmlFor="f-volume">
                Объём кузова
              </label>
              <FormInput
                id="f-volume"
                type="number"
                name="bodyVolumeM3"
                value={draft.bodyVolumeM3}
                onChange={handleFieldChange}
                placeholder="м³"
                inputMode="numeric"
                min="0"
                autoComplete="off"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className={sectionTitleClass}>Грузы и погрузка</h2>
          <div className="w-full h-1 border-b border-bg-subtle mb-4" />

          <div className={formGridClass}>
            <div className={`${FIELD_ROW} items-start`}>
              <span className={FIELD_LABEL_INLINE}>Перевозимые типы груза *</span>
              <ChipGroup
                label="Перевозимые типы груза"
                options={CARGO_TYPES}
                selected={draft.cargoTypes}
                onToggle={(item) => toggleArrayItem("cargoTypes", item)}
                hideLabel
              />
            </div>
            <div className="w-full h-1 border-b border-bg-subtle" />

            <div className={`${FIELD_ROW} items-start`}>
              <span className={FIELD_LABEL_INLINE}>Способы загрузки</span>
              <ChipGroup
                label="Способы загрузки"
                options={LOADING_TYPES}
                selected={draft.loadingType}
                onToggle={(item) => toggleArrayItem("loadingType", item)}
                hideLabel
              />
            </div>
            <div className="w-full h-1 border-b border-bg-subtle" />

            <div className={`${FIELD_ROW} items-start`}>
              <span className={FIELD_LABEL_INLINE}>Способы выгрузки</span>
              <ChipGroup
                label="Способы выгрузки"
                options={UNLOADING_TYPES}
                selected={draft.unloadingType}
                onToggle={(item) => toggleArrayItem("unloadingType", item)}
                hideLabel
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className={sectionTitleClass}>Работа и ставка</h2>
          <div className="w-full h-1 border-b border-bg-subtle mb-4" />

          <div className={formGridClass}>
            <div className={FIELD_ROW}>
              <label className={FIELD_LABEL_INLINE} htmlFor="f-rate-km">
                Ставка за км
              </label>
              <FormInput
                id="f-rate-km"
                type="number"
                name="minRatePerKm"
                value={draft.minRatePerKm}
                onChange={handleFieldChange}
                placeholder="₽/км"
                inputMode="numeric"
                min="0"
                autoComplete="off"
              />
            </div>
            <div className="w-full h-1 border-b border-bg-subtle" />

            <div className={FIELD_ROW}>
              <label className={FIELD_LABEL_INLINE} htmlFor="f-trip-rate">
                Стоимость рейса
              </label>
              <FormInput
                id="f-trip-rate"
                type="number"
                name="minTripRate"
                value={draft.minTripRate}
                onChange={handleFieldChange}
                placeholder="₽ за рейс"
                inputMode="numeric"
                min="0"
                autoComplete="off"
              />
            </div>
            <div className="w-full h-1 border-b border-bg-subtle" />

            <div className={FIELD_ROW}>
              <label className={FIELD_LABEL_INLINE} htmlFor="f-vat">
                Условия НДС
              </label>
              <FormSelect
                id="f-vat"
                name="vatType"
                value={draft.vatType}
                onChange={handleFieldChange}
                required
              >
                <option value="">Выберите условие</option>
                {VAT_TYPES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </FormSelect>
            </div>
            <div className="w-full h-1 border-b border-bg-subtle" />

            <div className={FIELD_ROW}>
              <label className={FIELD_LABEL_INLINE} htmlFor="f-availability">
                Доступность
              </label>
              <FormSelect
                id="f-availability"
                name="availabilityType"
                value={draft.availabilityType}
                onChange={handleFieldChange}
                required
              >
                {AVAILABILITY_TYPES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </FormSelect>
            </div>
            {isDateType ? (
              <>
                <div className="w-full h-1 border-b border-bg-subtle" />
                <div className={FIELD_ROW}>
                  <label className={FIELD_LABEL_INLINE} htmlFor="f-busy-until">
                    Работает до
                  </label>
                  <FormInput
                    id="f-busy-until"
                    type="date"
                    name="availabilityDate"
                    value={draft.availabilityDate}
                    onChange={handleFieldChange}
                    required
                  />
                </div>
              </>
            ) : null}
            <div className="w-full h-1 border-b border-bg-subtle" />

            <div className={`${FIELD_ROW} items-start`}>
              <span className={FIELD_LABEL_INLINE}>Регионы работы</span>
              <DistrictRegionSelector
                selectedRegions={draft.workRegions}
                onToggleRegion={(region) =>
                  toggleArrayItem("workRegions", region)
                }
                onToggleDistrict={toggleDistrict}
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className={sectionTitleClass}>Доп. информация</h2>
          <div className="w-full h-1 border-b border-bg-subtle mb-4" />

          <div className={formGridClass}>
            <div className={FIELD_ROW_TOP}>
              <FormTextarea
                id="f-note"
                name="additionalInfo"
                value={draft.additionalInfo}
                onChange={handleFieldChange}
                placeholder="Особые условия, требования к перевозке…"
                rows={4}
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className={sectionTitleClass}>Контакты</h2>
          <div className="w-full h-1 border-b border-bg-subtle mb-4" />

          <div className={formGridClass}>
            <div className={FIELD_ROW}>
              <label className={FIELD_LABEL_INLINE} htmlFor="f-name">
                Контактное лицо
              </label>
              <FormInput
                id="f-name"
                type="text"
                name="contactName"
                value={draft.contactName}
                onChange={handleFieldChange}
                placeholder="Имя и фамилия"
                autoComplete="name"
                required
              />
            </div>
            <div className="w-full h-1 border-b border-bg-subtle" />

            <div className={FIELD_ROW}>
              <label className={FIELD_LABEL_INLINE} htmlFor="f-phone">
                Телефон
              </label>
              <FormInput
                id="f-phone"
                type="tel"
                name="contactPhone"
                value={draft.contactPhone}
                onChange={handleFieldChange}
                placeholder="+7 (___) ___-__-__"
                autoComplete="tel"
                required
              />
            </div>
          </div>
        </section>

        {error ? (
          <p className="text-sm text-danger text-center tracking-[-0.14px]">
            {error}
          </p>
        ) : null}

        <div className="flex gap-3 pt-6 max-[640px]:flex-col">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex items-center justify-center flex-1 gap-1.5 h-12 px-[21px] rounded-pill bg-accent text-base font-medium text-text-inverse tracking-[-0.16px] leading-none whitespace-nowrap transition-colors duration-150 hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <PlusIcon />
            {mutation.isPending ? "Публикация…" : "Опубликовать заявку"}
          </button>
          <Link
            href="/profile"
            role="button"
            className="inline-flex items-center justify-center flex-1 h-12 px-[21px] rounded-pill bg-bg-subtle text-base font-medium text-text-primary tracking-[-0.16px] leading-none whitespace-nowrap transition-colors duration-150 hover:bg-bg-hover"
          >
            Отмена
          </Link>
        </div>
      </form>

      <aside className="sticky top-3 self-start max-[960px]:static">

        <div className="rounded-[20px] border border-border overflow-hidden">
          <MapPicker
            className="h-[320px] w-full max-[960px]:h-60"
            initialLocation={null}
            onSelect={setLocation}
          />

        </div>

        <div className="mt-4" aria-label="Предпросмотр заявки">
          <h3 className="text-lg font-medium leading-[1.33] text-text-primary tracking-[-0.18px] mb-3">
            Предпросмотр заявки
          </h3>
          <TransportDetailButton transport={previewTransport} />
        </div>
      </aside>
    </div>
  );
}

function PlusIcon() {
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
      <path d="M12 5v14"></path>
      <path d="M5 12h14"></path>
    </svg>
  );
}
