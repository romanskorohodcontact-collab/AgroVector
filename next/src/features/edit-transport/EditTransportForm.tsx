"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import type { Transport } from "@/entities/transport/model";
import { TransportDetailButton } from "@/widgets/transport-detail";
import {
  TRANSPORT_TYPES,
  BODY_TYPES,
  CARGO_TYPES,
  CARGO_TYPE_DESCRIPTIONS,
  LOADING_TYPES,
  UNLOADING_TYPES,
  VAT_TYPES,
  AVAILABILITY_TYPES,
  AVAILABILITY_DATE_TYPES,
} from "@/entities/transport/model";
import { MapPicker } from "@/features/map";
import type { GeoPoint } from "@/entities/load/model";
import { ChipGroup } from "@/shared/ui/ChipGroup";
import { DescriptiveMultiSelect } from "@/shared/ui/DescriptiveMultiSelect";
import {
  FormInput,
  FormSelect,
  FormTextarea,
  FIELD_LABEL_INLINE,
  FIELD_ROW,
  FIELD_ROW_TOP,
} from "@/shared/ui/FormInput";
import { DistrictRegionSelectorPopover } from "@/shared/ui/DistrictRegionSelectorPopover";
import { ToggleField } from "@/shared/ui/ToggleField";
import { deriveDistrictsFromRegions, WORK_DISTRICTS_REGIONS } from "@/shared/data/rfRegions";

const formGridClass = "grid grid-cols-1 gap-3";

const sectionTitleClass =
  "text-base font-medium leading-[1.5] text-text-primary tracking-[-0.16px] mb-4";

interface EditTransportFormProps {
  transport: Transport;
}

function toDateInputValue(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

function numberToString(value: number | null): string {
  return value != null ? String(value) : "";
}

export function EditTransportForm({ transport }: EditTransportFormProps) {
  const router = useRouter();
  const [location, setLocation] = useState<GeoPoint | null>(transport.transportLocation);
  const [formError, setFormError] = useState<string | null>(null);
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const [draft, setDraft] = useState({
    transportType: transport.transportType,
    bodyType: transport.bodyType,
    loadCapacityTons: numberToString(transport.loadCapacityTons),
    bodyVolumeM3: numberToString(transport.bodyVolumeM3),
    cargoTypes: [...transport.cargoTypes],
    loadingType: transport.loadingType ?? [],
    unloadingType: transport.unloadingType ?? [],
    workRegions: transport.workRegions ?? [],
    minRatePerKm: numberToString(transport.minRatePerKm),
    minTripRate: numberToString(transport.minTripRate),
    showTripRate: transport.minTripRate != null,
    vatType: transport.vatType,
    availabilityType: transport.availability.type,
    availabilityDate: toDateInputValue(transport.availability.date),
    additionalInfo: transport.additionalInfo ?? "",
    contactName: transport.contactName,
    contactPhone: transport.contactPhone,
  });

  const mutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const response = await fetch(`/api/transports/${transport.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Не удалось обновить заявку");
      }
      return response.json();
    },
    onSuccess: () => {
      router.push("/profile");
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
    const isDateType = (AVAILABILITY_DATE_TYPES as readonly string[]).includes(availabilityType);
    const date =
      isDateType && form.get("availabilityDate")
        ? new Date(form.get("availabilityDate") as string)
        : null;

    mutation.mutate({
      transportType: form.get("transportType"),
      bodyType: form.get("bodyType"),
      loadCapacityTons: form.get("loadCapacityTons") ? Number(form.get("loadCapacityTons")) : null,
      bodyVolumeM3: form.get("bodyVolumeM3") ? Number(form.get("bodyVolumeM3")) : null,
      cargoTypes: draft.cargoTypes,
      loadingType: draft.loadingType.length > 0 ? draft.loadingType : null,
      unloadingType: draft.unloadingType.length > 0 ? draft.unloadingType : null,
      workRegions: draft.workRegions.length > 0 ? draft.workRegions : null,
      workDistricts: deriveDistrictsFromRegions(draft.workRegions),
      minRatePerKm: form.get("minRatePerKm") ? Number(form.get("minRatePerKm")) : null,
      minTripRate:
        draft.showTripRate && form.get("minTripRate") ? Number(form.get("minTripRate")) : null,
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
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  }

  function toggleArrayItem(
    key: "cargoTypes" | "loadingType" | "unloadingType" | "workRegions",
    item: string,
  ) {
    setDraft((prev) => {
      const arr = prev[key];
      const next = arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
      return { ...prev, [key]: next };
    });
  }

  function toggleDistrict(district: string) {
    const districtRegions = WORK_DISTRICTS_REGIONS[district];
    if (!districtRegions) return;
    setDraft((prev) => {
      const allSelected = districtRegions.every((r) => prev.workRegions.includes(r));
      const next = allSelected
        ? prev.workRegions.filter((r) => !districtRegions.includes(r))
        : [...new Set([...prev.workRegions, ...districtRegions])];
      return { ...prev, workRegions: next };
    });
  }

  const previewTransport: Transport = {
    ...transport,
    transportType: draft.transportType || transport.transportType,
    bodyType: draft.bodyType || transport.bodyType,
    loadCapacityTons: draft.loadCapacityTons ? Number(draft.loadCapacityTons) : null,
    bodyVolumeM3: draft.bodyVolumeM3 ? Number(draft.bodyVolumeM3) : null,
    cargoTypes: draft.cargoTypes.length > 0 ? draft.cargoTypes : transport.cargoTypes,
    loadingType: draft.loadingType.length > 0 ? draft.loadingType : null,
    unloadingType: draft.unloadingType.length > 0 ? draft.unloadingType : null,
    workRegions: draft.workRegions.length > 0 ? draft.workRegions : null,
    workDistricts: deriveDistrictsFromRegions(draft.workRegions),
    minRatePerKm: draft.minRatePerKm ? Number(draft.minRatePerKm) : null,
    minTripRate: draft.showTripRate && draft.minTripRate ? Number(draft.minTripRate) : null,
    vatType: draft.vatType || transport.vatType,
    availability: {
      type: draft.availabilityType || transport.availability.type,
      date:
        (AVAILABILITY_DATE_TYPES as readonly string[]).includes(draft.availabilityType) &&
        draft.availabilityDate
          ? new Date(draft.availabilityDate)
          : null,
    },
    transportLocation: location ?? transport.transportLocation,
    additionalInfo: draft.additionalInfo,
    contactName: draft.contactName || transport.contactName,
    contactPhone: draft.contactPhone || transport.contactPhone,
  };

  const isDateType = (AVAILABILITY_DATE_TYPES as readonly string[]).includes(
    draft.availabilityType,
  );

  return (
    <div className="container-app grid grid-cols-[60fr_40fr] items-start gap-6 pb-14 max-[960px]:grid-cols-1 max-[640px]:pb-10">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 rounded-[20px] border border-border bg-bg-surface p-6 max-[640px]:p-4"
      >
        <section>
          <h2 className={sectionTitleClass}>Транспорт</h2>
          <div className="mb-4 h-1 w-full border-b border-bg-subtle" />

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
            <div className="h-1 w-full border-b border-bg-subtle" />

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
            <div className="h-1 w-full border-b border-bg-subtle" />

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
            <div className="h-1 w-full border-b border-bg-subtle" />

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
          <div className="mb-4 h-1 w-full border-b border-bg-subtle" />

          <div className={formGridClass}>
            <div className={FIELD_ROW}>
              <span className={FIELD_LABEL_INLINE}>Перевозимые типы груза *</span>
              <DescriptiveMultiSelect
                label="Перевозимые типы груза"
                options={CARGO_TYPES}
                descriptions={CARGO_TYPE_DESCRIPTIONS}
                selected={draft.cargoTypes}
                onToggle={(item) => toggleArrayItem("cargoTypes", item)}
                placeholder="Выберите типы груза"
                panelWidthClass="w-full sm:w-[420px]"
                open={openFilter === "cargoTypes"}
                onOpenChange={(v) => setOpenFilter(v ? "cargoTypes" : null)}
                hideLabel
              />
            </div>
            <div className="h-1 w-full border-b border-bg-subtle" />

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
            <div className="h-1 w-full border-b border-bg-subtle" />

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
          <div className="mb-4 h-1 w-full border-b border-bg-subtle" />

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
            <div className="h-1 w-full border-b border-bg-subtle" />

            <ToggleField
              label="Указать мин. ставку за рейс"
              checked={draft.showTripRate}
              onChange={(checked) =>
                setDraft((prev) => ({
                  ...prev,
                  showTripRate: checked,
                  minTripRate: checked ? prev.minTripRate : "",
                }))
              }
            >
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
            </ToggleField>
            <div className="h-1 w-full border-b border-bg-subtle" />

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
            <div className="h-1 w-full border-b border-bg-subtle" />

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
                <div className="h-1 w-full border-b border-bg-subtle" />
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
            <div className="h-1 w-full border-b border-bg-subtle" />

            <div className={FIELD_ROW}>
              <span className={FIELD_LABEL_INLINE}>Регионы работы</span>
              <DistrictRegionSelectorPopover
                label="Регионы работы"
                selectedRegions={draft.workRegions}
                onToggleRegion={(region) => toggleArrayItem("workRegions", region)}
                onToggleDistrict={toggleDistrict}
                onReset={() => setDraft((prev) => ({ ...prev, workRegions: [] }))}
                panelWidthClass="w-full sm:w-[420px]"
                open={openFilter === "workRegions"}
                onOpenChange={(v) => setOpenFilter(v ? "workRegions" : null)}
                hideLabel
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className={sectionTitleClass}>Доп. информация</h2>
          <div className="mb-4 h-1 w-full border-b border-bg-subtle" />

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
          <div className="mb-4 h-1 w-full border-b border-bg-subtle" />

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
            <div className="h-1 w-full border-b border-bg-subtle" />

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
          <p className="text-center text-sm tracking-[-0.14px] text-danger">{error}</p>
        ) : null}

        <div className="flex gap-3 pt-6 max-[640px]:flex-col">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex h-12 flex-1 items-center justify-center gap-1.5 rounded-pill bg-accent px-[21px] text-base leading-none font-medium tracking-[-0.16px] whitespace-nowrap text-text-inverse transition-colors duration-150 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <EditIcon />
            {mutation.isPending ? "Сохранение…" : "Отредактировать заявку"}
          </button>
          <Link
            href="/profile"
            role="button"
            className="inline-flex h-12 flex-1 items-center justify-center rounded-pill bg-bg-subtle px-[21px] text-base leading-none font-medium tracking-[-0.16px] whitespace-nowrap text-text-primary transition-colors duration-150 hover:bg-bg-hover"
          >
            Отмена
          </Link>
        </div>
      </form>

      <aside className="sticky top-3 self-start max-[960px]:static">
        <div className="overflow-hidden rounded-[20px] border border-border">
          <MapPicker
            className="h-[320px] w-full max-[960px]:h-60"
            initialLocation={location}
            onSelect={setLocation}
          />
        </div>

        <div className="mt-4" aria-label="Предпросмотр заявки">
          <h3 className="mb-3 text-lg leading-[1.33] font-medium tracking-[-0.18px] text-text-primary">
            Предпросмотр заявки
          </h3>
          <TransportDetailButton transport={previewTransport} />
        </div>
      </aside>
    </div>
  );
}

function EditIcon() {
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
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
