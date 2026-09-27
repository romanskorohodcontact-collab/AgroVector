"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { LoadCard } from "@/entities/load";
import type { GeoPoint, Load, LoadCustomProperty } from "@/entities/load/model";
import { ANY_WAY, LOADING_TYPES_WITH_ANY, UNLOADING_TYPES_WITH_ANY } from "@/entities/load/model";
import { CARGO_FORMS, CARGO_TYPE_DESCRIPTIONS, CARGO_TYPES, LOAD_VAT_TYPES, BODY_TYPES } from "@/entities/transport/model";
import { MapPicker } from "@/features/map";
import { ChipGroup } from "@/shared/ui/ChipGroup";
import { DescriptiveSelectPopover } from "@/shared/ui/DescriptiveSelectPopover";
import {
  FormInput,
  FormSelect,
  FormTextarea,
  FIELD_LABEL_INLINE,
  FIELD_ROW,
  FIELD_ROW_TOP,
} from "@/shared/ui/FormInput";
import { DistrictRegionSelectorPopover } from "@/shared/ui/DistrictRegionSelectorPopover";
import { deriveDistrictsFromRegions, WORK_DISTRICTS_REGIONS } from "@/shared/data/rfRegions";

const formGridClass = "grid grid-cols-1 gap-3";

const sectionTitleClass =
  "text-base font-medium leading-[1.5] text-text-primary tracking-[-0.16px] mb-4";

interface EditLoadFormProps {
  load: Load;
}

function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function EditLoadForm({ load }: EditLoadFormProps) {
  const router = useRouter();
  const [location, setLocation] = useState<GeoPoint | null>(load.loadingLocation);
  const [formError, setFormError] = useState<string | null>(null);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    loadingPlace: load.loadingPlace,
    unloadingPlace: load.unloadingPlace,
    distance: String(load.distance),
    rate: String(load.rate),
    ratePerKm: String(load.ratePerKm),
    tonnage: String(load.tonnage.tonnageWeight),
    tonnageUnit: load.tonnage.tonnageUnit,
    bodyType: load.bodyType,
    cargo: load.cargo,
    cargoForm: load.cargoForm,
    cargoTypes: [...load.cargoTypes],
    additionalInfo: load.additionalInfo,
    customerName: load.customerName,
    customerPhone: load.customerPhone,
    companyName: load.companyName,
    loadingRegions: load.loadingRegion ?? [],
    unloadingRegions: load.unloadingRegion ?? [],
    loadingTypes: load.loadingType ?? [],
    unloadingTypes: load.unloadingType ?? [],
    vatType: load.vatType,
    loadingDate: toDateInputValue(load.loadingDate),
    customProperties: load.customProperties.map((p) => ({ ...p })),
  });

  const mutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const response = await fetch(`/api/loads/${load.id}`, {
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
      router.push("/");
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    if (!location) {
      setFormError("Выберите точку погрузки на карте");
      return;
    }

    const form = new FormData(event.currentTarget);
    const distance = Number(form.get("distance"));
    const ratePerKmRaw = form.get("ratePerKm");
    const rateRaw = form.get("rate");

    let rate: number;
    let ratePerKm: number;

    if (ratePerKmRaw) {
      ratePerKm = Number(ratePerKmRaw);
      rate = Math.round(ratePerKm * distance);
    } else if (rateRaw) {
      rate = Number(rateRaw);
      ratePerKm = distance > 0 ? Math.round(rate / distance) : 0;
    } else {
      rate = 0;
      ratePerKm = 0;
    }

    mutation.mutate({
      loadingPlace: form.get("loadingPlace"),
      loadingLocation: location,
      unloadingPlace: form.get("unloadingPlace"),
      distance,
      rate,
      ratePerKm,
      tonnage: {
        tonnageWeight: Number(form.get("tonnage")),
        tonnageUnit: form.get("tonnageUnit") as "kg" | "ton",
      },
      bodyType: form.get("bodyType"),
      cargo: form.get("cargo"),
      cargoForm: form.get("cargoForm"),
      cargoTypes: draft.cargoTypes,
      additionalInfo: form.get("additionalInfo"),
      customerName: form.get("customerName"),
      customerPhone: form.get("customerPhone"),
      companyName: form.get("companyName"),
      loadingRegion: draft.loadingRegions.length > 0 ? draft.loadingRegions : null,
      loadingDistrict: deriveDistrictsFromRegions(draft.loadingRegions),
      unloadingDistrict: deriveDistrictsFromRegions(draft.unloadingRegions),
      unloadingRegion: draft.unloadingRegions.length > 0 ? draft.unloadingRegions : null,
      loadingType: draft.loadingTypes.length > 0 ? draft.loadingTypes : null,
      unloadingType: draft.unloadingTypes.length > 0 ? draft.unloadingTypes : null,
      vatType: form.get("vatType"),
      loadingDate: form.get("loadingDate"),
      customProperties: draft.customProperties.filter(
        (p) => p.name.trim() && p.value.trim()
      ),
    });
  }

  const error = formError ?? (mutation.isError ? mutation.error.message : null);

  function handleFieldChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;
    setDraft((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "ratePerKm" || name === "rate" || name === "distance") {
        const distance = Number(next.distance) || 0;
        const ratePerKm = Number(next.ratePerKm) || 0;
        const rate = Number(next.rate) || 0;

        if (name === "ratePerKm" && ratePerKm > 0 && distance > 0) {
          next.rate = String(Math.round(ratePerKm * distance));
        } else if (name === "rate" && rate > 0 && distance > 0) {
          next.ratePerKm = String(Math.round(rate / distance));
        } else if (name === "distance" && distance > 0) {
          if (ratePerKm > 0) {
            next.rate = String(Math.round(ratePerKm * distance));
          } else if (rate > 0) {
            next.ratePerKm = String(Math.round(rate / distance));
          }
        }
      }

      return next;
    });
  }

  function handleCargoTypeChange(value: string) {
    setDraft((prev) => ({ ...prev, cargoTypes: value ? [value] : [] }));
  }

  function toggleArrayItem(
    key: "loadingRegions" | "unloadingRegions" | "loadingTypes" | "unloadingTypes",
    item: string
  ) {
    setDraft((prev) => {
      const arr = prev[key];
      if (key === "loadingTypes" || key === "unloadingTypes") {
        if (item === ANY_WAY) {
          const next = arr.includes(ANY_WAY) ? [] : [ANY_WAY];
          return { ...prev, [key]: next };
        }
        const withoutAny = arr.filter((x) => x !== ANY_WAY);
        const next = withoutAny.includes(item)
          ? withoutAny.filter((x) => x !== item)
          : [...withoutAny, item];
        return { ...prev, [key]: next };
      }
      const next = arr.includes(item)
        ? arr.filter((x) => x !== item)
        : [...arr, item];
      return { ...prev, [key]: next };
    });
  }

  function toggleDistrict(
    key: "loadingRegions" | "unloadingRegions",
    district: string
  ) {
    const districtRegions = WORK_DISTRICTS_REGIONS[district];
    if (!districtRegions) return;
    setDraft((prev) => {
      const current = prev[key];
      const allSelected = districtRegions.every((r) => current.includes(r));
      const next = allSelected
        ? current.filter((r) => !districtRegions.includes(r))
        : [...new Set([...current, ...districtRegions])];
      return { ...prev, [key]: next };
    });
  }

  function addCustomProperty() {
    setDraft((prev) => ({
      ...prev,
      customProperties: [...prev.customProperties, { name: "", value: "" }],
    }));
  }

  function removeCustomProperty(index: number) {
    setDraft((prev) => ({
      ...prev,
      customProperties: prev.customProperties.filter((_, i) => i !== index),
    }));
  }

  function updateCustomProperty(
    index: number,
    field: keyof LoadCustomProperty,
    value: string
  ) {
    setDraft((prev) => ({
      ...prev,
      customProperties: prev.customProperties.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      ),
    }));
  }

  const previewLoad: Load = {
    ...load,
    loadingPlace: draft.loadingPlace || "Город отправки",
    loadingLocation: location ?? load.loadingLocation,
    unloadingPlace: draft.unloadingPlace || "Город назначения",
    distance: Number(draft.distance) || 0,
    rate: Number(draft.rate) || 0,
    ratePerKm: Number(draft.ratePerKm) || 0,
    tonnage: {
      tonnageWeight: Number(draft.tonnage) || 0,
      tonnageUnit: draft.tonnageUnit as "kg" | "ton",
    },
    bodyType: draft.bodyType || load.bodyType,
    cargo: draft.cargo || "Название груза",
    cargoForm: draft.cargoForm || load.cargoForm,
    cargoTypes: draft.cargoTypes,
    additionalInfo: draft.additionalInfo,
    customerName: draft.customerName || "Имя заказчика",
    customerPhone: draft.customerPhone || "+7 (___) ___-__-__",
    companyName: draft.companyName,
    loadingRegion: draft.loadingRegions.length > 0 ? draft.loadingRegions : null,
    loadingDistrict: deriveDistrictsFromRegions(draft.loadingRegions),
    unloadingDistrict: deriveDistrictsFromRegions(draft.unloadingRegions),
    unloadingRegion: draft.unloadingRegions.length > 0 ? draft.unloadingRegions : null,
    loadingType: draft.loadingTypes.length > 0 ? draft.loadingTypes : null,
    unloadingType: draft.unloadingTypes.length > 0 ? draft.unloadingTypes : null,
    vatType: draft.vatType || load.vatType,
    loadingDate: draft.loadingDate ? new Date(draft.loadingDate) : load.loadingDate,
    customProperties: draft.customProperties.filter(
      (p) => p.name.trim() && p.value.trim()
    ),
  };

  return (
    <div className="container-app pb-14 grid grid-cols-[60fr_40fr] gap-6 items-start max-[960px]:grid-cols-1 max-[640px]:pb-10">
      <form
        onSubmit={handleSubmit}
        className="border border-border rounded-[20px] bg-bg-surface p-6 flex flex-col gap-8 max-[640px]:p-4"
      >
        <section>
          <h2 className={sectionTitleClass}>Параметры груза</h2>
          <div className="w-full h-1 border-b border-bg-subtle mb-4" />

          <div className={formGridClass}>
            <div className={FIELD_ROW}>
              <span className={FIELD_LABEL_INLINE}>Тип груза</span>
              <DescriptiveSelectPopover
                label="Тип груза"
                options={CARGO_TYPES}
                descriptions={CARGO_TYPE_DESCRIPTIONS}
                value={draft.cargoTypes[0] ?? ""}
                onChange={handleCargoTypeChange}
                onReset={() => handleCargoTypeChange("")}
                placeholder="Выберите тип груза"
                panelWidthClass="w-full sm:w-[420px]"
                open={openFilter === "cargoType"}
                onOpenChange={(v) => setOpenFilter(v ? "cargoType" : null)}
                hideLabel
              />
            </div>
            <div className="w-full h-1 border-b border-bg-subtle" />

            <div className={FIELD_ROW}>
              <label className={FIELD_LABEL_INLINE} htmlFor="f-cargo-form">
                Тип загрузки груза
              </label>
              <FormSelect
                id="f-cargo-form"
                name="cargoForm"
                value={draft.cargoForm}
                onChange={handleFieldChange}
                required
              >
                <option value="">Выберите тип загрузки</option>
                {CARGO_FORMS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </FormSelect>
            </div>
            <div className="w-full h-1 border-b border-bg-subtle" />

            <div className={FIELD_ROW}>
              <label className={FIELD_LABEL_INLINE} htmlFor="f-cargo">
                Название груза
              </label>
              <FormInput
                id="f-cargo"
                type="text"
                name="cargo"
                value={draft.cargo}
                onChange={handleFieldChange}
                placeholder="Пшеница, кукуруза…"
                autoComplete="off"
                required
              />
            </div>
            <div className="w-full h-1 border-b border-bg-subtle" />

            <div className={FIELD_ROW}>
              <label className={FIELD_LABEL_INLINE} htmlFor="f-tonnage">
                Тоннаж
              </label>
              <div className="flex gap-2 w-full">
                <FormInput
                  id="f-tonnage"
                  type="number"
                  name="tonnage"
                  value={draft.tonnage}
                  onChange={handleFieldChange}
                  placeholder="вес"
                  inputMode="numeric"
                  min="0"
                  autoComplete="off"
                  required
                />
                <FormSelect
                  name="tonnageUnit"
                  value={draft.tonnageUnit}
                  onChange={handleFieldChange}
                  required
                >
                  <option value="ton">т</option>
                  <option value="kg">кг</option>
                </FormSelect>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className={sectionTitleClass}>Информация о маршруте</h2>
          <div className="w-full h-1 border-b border-bg-subtle mb-4" />

          <div className={formGridClass}>
            <div className={FIELD_ROW}>
              <label className={FIELD_LABEL_INLINE} htmlFor="f-from">
                Погрузка
              </label>
              <FormInput
                id="f-from"
                type="text"
                name="loadingPlace"
                value={draft.loadingPlace}
                onChange={handleFieldChange}
                placeholder="Город отправки"
                autoComplete="off"
                required
              />
            </div>
            <div className="w-full h-1 border-b border-bg-subtle" />

            <div className={FIELD_ROW}>
              <label className={FIELD_LABEL_INLINE} htmlFor="f-to">
                Выгрузка
              </label>
              <FormInput
                id="f-to"
                type="text"
                name="unloadingPlace"
                value={draft.unloadingPlace}
                onChange={handleFieldChange}
                placeholder="Город назначения"
                autoComplete="off"
                required
              />
            </div>
            <div className="w-full h-1 border-b border-bg-subtle" />

            <div className={FIELD_ROW}>
              <span className={FIELD_LABEL_INLINE}>Регион погрузки</span>
              <DistrictRegionSelectorPopover
                label="Регион погрузки"
                selectedRegions={draft.loadingRegions}
                onToggleRegion={(region) => toggleArrayItem("loadingRegions", region)}
                onToggleDistrict={(district) => toggleDistrict("loadingRegions", district)}
                onReset={() =>
                  setDraft((prev) => ({ ...prev, loadingRegions: [] }))
                }
                panelWidthClass="w-full sm:w-[420px]"
                open={openFilter === "loadingRegions"}
                onOpenChange={(v) => setOpenFilter(v ? "loadingRegions" : null)}
                hideLabel
              />
            </div>
            <div className="w-full h-1 border-b border-bg-subtle" />

            <div className={FIELD_ROW}>
              <span className={FIELD_LABEL_INLINE}>Регион выгрузки</span>
              <DistrictRegionSelectorPopover
                label="Регион выгрузки"
                selectedRegions={draft.unloadingRegions}
                onToggleRegion={(region) => toggleArrayItem("unloadingRegions", region)}
                onToggleDistrict={(district) => toggleDistrict("unloadingRegions", district)}
                onReset={() =>
                  setDraft((prev) => ({ ...prev, unloadingRegions: [] }))
                }
                panelWidthClass="w-full sm:w-[420px]"
                open={openFilter === "unloadingRegions"}
                onOpenChange={(v) => setOpenFilter(v ? "unloadingRegions" : null)}
                hideLabel
              />
            </div>
            <div className="w-full h-1 border-b border-bg-subtle" />

            <div className={FIELD_ROW}>
              <label className={FIELD_LABEL_INLINE} htmlFor="f-distance">
                Расстояние
              </label>
              <FormInput
                id="f-distance"
                type="number"
                name="distance"
                value={draft.distance}
                onChange={handleFieldChange}
                placeholder="км"
                inputMode="numeric"
                min="0"
                autoComplete="off"
                required
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className={sectionTitleClass}>Требования к транспорту</h2>
          <div className="w-full h-1 border-b border-bg-subtle mb-4" />

          <div className={formGridClass}>
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
                <option value="">Выберите тип кузова</option>
                {BODY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </FormSelect>
            </div>
            <div className="w-full h-1 border-b border-bg-subtle" />

            <div className={`${FIELD_ROW} items-start`}>
              <span className={FIELD_LABEL_INLINE}>Требуемый способ <br />загрузки</span>
              <ChipGroup
                label="Требуемый способ загрузки"
                options={LOADING_TYPES_WITH_ANY}
                selected={draft.loadingTypes}
                onToggle={(item) => toggleArrayItem("loadingTypes", item)}
                hideLabel
              />
            </div>
            <div className="w-full h-1 border-b border-bg-subtle" />
            <div className={`${FIELD_ROW} items-start`}>
              <span className={FIELD_LABEL_INLINE}>Требуемый способ <br />выгрузки</span>
              <ChipGroup
                label="Требуемый способ выгрузки"
                options={UNLOADING_TYPES_WITH_ANY}
                selected={draft.unloadingTypes}
                onToggle={(item) => toggleArrayItem("unloadingTypes", item)}
                hideLabel
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className={sectionTitleClass}>Условия перевозки</h2>
          <div className="w-full h-1 border-b border-bg-subtle mb-4" />

          <div className={formGridClass}>
            <div className={FIELD_ROW}>
              <label className={FIELD_LABEL_INLINE} htmlFor="f-loading-date">
                Дата погрузки
              </label>
              <FormInput
                id="f-loading-date"
                type="date"
                name="loadingDate"
                value={draft.loadingDate}
                onChange={handleFieldChange}
                required
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
                {LOAD_VAT_TYPES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </FormSelect>
            </div>
            <div className="w-full h-1 border-b border-bg-subtle" />

            <div className={FIELD_ROW}>
              <label className={FIELD_LABEL_INLINE} htmlFor="f-rate">
                Ставка за км
              </label>
              <FormInput
                id="f-rate"
                type="number"
                name="ratePerKm"
                value={draft.ratePerKm}
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
                Ставка за рейс
              </label>
              <FormInput
                id="f-trip-rate"
                type="number"
                name="rate"
                value={draft.rate}
                onChange={handleFieldChange}
                placeholder="₽ за рейс"
                inputMode="numeric"
                min="0"
                autoComplete="off"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className={sectionTitleClass}>Дополнительная информация</h2>
          <div className="w-full h-1 border-b border-bg-subtle mb-4" />

          <div className={formGridClass}>
            <div className={FIELD_ROW_TOP}>
              <FormTextarea
                id="f-note"
                name="additionalInfo"
                value={draft.additionalInfo}
                onChange={handleFieldChange}
                placeholder="Особые условия загрузки, тип транспорта, требования к перевозке…"
                rows={4}
              />
            </div>

            {draft.customProperties.map((prop, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_200px_40px] items-center gap-x-4 gap-y-1.5 max-[640px]:grid-cols-1"
              >

                <div className="min-w-0 max-[640px]:order-2">
                  <FormInput
                    id={`f-prop-name-${index}`}
                    type="text"
                    placeholder="Название свойства"
                    autoComplete="off"
                    value={prop.name}
                    onChange={(e) =>
                      updateCustomProperty(index, "name", e.target.value)
                    }
                  />
                </div>
                <label
                  className={`${FIELD_LABEL_INLINE} max-[640px]:order-1`}
                  htmlFor={`f-prop-name-${index}`}
                >
                  Название свойства
                </label>
                <button
                  type="button"
                  onClick={() => removeCustomProperty(index)}
                  className="row-span-2 self-start inline-flex items-center justify-center h-[38px] w-[40px] rounded-2xl border-[1.2px] border-outline-input bg-bg-subtle text-text-muted transition-colors duration-150 hover:text-danger max-[640px]:row-span-1 max-[640px]:order-last max-[640px]:w-full"
                  aria-label="Удалить свойство"
                >
                  <CloseIcon />
                </button>
                <div className="min-w-0 max-[640px]:order-4">
                  <FormInput
                    id={`f-prop-value-${index}`}
                    type="text"
                    placeholder="Значение свойства"
                    autoComplete="off"
                    value={prop.value}
                    onChange={(e) =>
                      updateCustomProperty(index, "value", e.target.value)
                    }
                  />
                </div>
                <label
                  className={`${FIELD_LABEL_INLINE} max-[640px]:order-3`}
                  htmlFor={`f-prop-value-${index}`}
                >
                  Значение свойства
                </label>

              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addCustomProperty}
            className="inline-flex items-center gap-1.5 h-11 px-4 mt-4 rounded-pill bg-bg-subtle text-sm font-medium text-text-primary tracking-[-0.16px] leading-none whitespace-nowrap transition-colors duration-150 hover:bg-bg-hover"
          >
            <PlusIcon />
            Добавить своё свойство
          </button>
        </section>

        <section>
          <h2 className={sectionTitleClass}>Контакты для связи</h2>
          <div className="w-full h-1 border-b border-bg-subtle mb-4" />

          <div className={formGridClass}>
            <div className={FIELD_ROW}>
              <label className={FIELD_LABEL_INLINE} htmlFor="f-name">
                Имя заказчика
              </label>
              <FormInput
                id="f-name"
                type="text"
                name="customerName"
                value={draft.customerName}
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
                name="customerPhone"
                value={draft.customerPhone}
                onChange={handleFieldChange}
                placeholder="+7 (___) ___-__-__"
                autoComplete="tel"
                required
              />
            </div>
            <div className="w-full h-1 border-b border-bg-subtle" />

            <div className={FIELD_ROW}>
              <label className={FIELD_LABEL_INLINE} htmlFor="f-company">
                Название компании
              </label>
              <FormInput
                id="f-company"
                type="text"
                name="companyName"
                value={draft.companyName}
                onChange={handleFieldChange}
                placeholder="ООО «Компания»"
                autoComplete="organization"
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
            <EditIcon />
            {mutation.isPending ? "Сохранение…" : "Отредактировать заявку"}
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
            initialLocation={location}
            onSelect={setLocation}
          />
        </div>

        <div className="mt-4" aria-label="Предпросмотр заявки">
          <h3 className="text-lg font-medium leading-[1.33] text-text-primary tracking-[-0.18px] mb-3">
            Предпросмотр заявки
          </h3>
          <LoadCard load={previewLoad} />
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

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18"></path>
      <path d="m6 6 12 12"></path>
    </svg>
  );
}
