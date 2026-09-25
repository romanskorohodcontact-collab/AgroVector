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
import { DescriptiveSelect } from "@/shared/ui/DescriptiveSelect";
import { FormInput, FormSelect, FormTextarea } from "@/shared/ui/FormInput";
import { DistrictRegionSelectorDropdown } from "@/shared/ui/DistrictRegionSelectorDropdown";
import { deriveDistrictsFromRegions } from "@/shared/data/rfRegions";
import type { User } from "@/entities/user";

const labelClass = "mb-1.5 block text-[13px] font-medium text-text-muted tracking-[-0.13px]";

const formGridClass = "grid grid-cols-2 gap-4 max-[640px]:grid-cols-1";

const sectionTitleClass =
  "text-base font-semibold leading-[1.5] text-text-primary tracking-[-0.16px] mb-4";

interface CreateLoadFormProps {
  user?: User;
}

export function CreateLoadForm({ user }: CreateLoadFormProps) {
  const router = useRouter();
  const [location, setLocation] = useState<GeoPoint | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    loadingPlace: "",
    unloadingPlace: "",
    distance: "",
    rate: "",
    ratePerKm: "",
    tonnage: "",
    tonnageUnit: "ton",
    bodyType: "",
    cargo: "",
    cargoForm: "",
    cargoTypes: [] as string[],
    additionalInfo: "",
    customerName: user?.name ?? "",
    customerPhone: user?.phone ?? "",
    companyName: user?.companyName ?? "",
    loadingRegions: [] as string[],
    unloadingRegions: [] as string[],
    loadingTypes: [ANY_WAY] as string[],
    unloadingTypes: [ANY_WAY] as string[],
    vatType: "",
    loadingDate: "",
    customProperties: [] as LoadCustomProperty[],
  });

  const mutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const response = await fetch("/api/loads", {
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
    id: "—",
    loadingPlace: draft.loadingPlace || "Город отправки",
    loadingLocation: location ?? { lat: 55.7558, lng: 37.6173 },
    unloadingPlace: draft.unloadingPlace || "Город назначения",
    distance: Number(draft.distance) || 0,
    rate: Number(draft.rate) || 0,
    ratePerKm: Number(draft.ratePerKm) || 0,
    tonnage: {
      tonnageWeight: Number(draft.tonnage) || 0,
      tonnageUnit: draft.tonnageUnit as "kg" | "ton",
    },
    bodyType: draft.bodyType || "Тип кузова",
    cargo: draft.cargo || "Название груза",
    cargoForm: draft.cargoForm || "Тип загрузки груза",
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
    vatType: draft.vatType || "НДС",
    loadingDate: draft.loadingDate ? new Date(draft.loadingDate) : new Date(),
    customProperties: draft.customProperties.filter(
      (p) => p.name.trim() && p.value.trim()
    ),
  };

  return (
    <div className="container-app pb-14 grid grid-cols-[60fr_40fr] gap-6 items-start max-[960px]:grid-cols-1 max-[640px]:pb-10">
      <form
        onSubmit={handleSubmit}
        className="border border-border rounded-[20px] bg-white p-8 flex flex-col gap-8 max-[640px]:px-4 max-[640px]:py-6"
      >
        <section>
          <h2 className={sectionTitleClass}>Маршрут</h2>
          <div className={formGridClass}>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass} htmlFor="f-from">
                Погрузка
              </label>
              <FormInput
                id="f-from"
                type="text"
                name="loadingPlace"
                onChange={handleFieldChange}
                placeholder="Город отправки"
                autoComplete="off"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass} htmlFor="f-to">
                Выгрузка
              </label>
              <FormInput
                id="f-to"
                type="text"
                name="unloadingPlace"
                onChange={handleFieldChange}
                placeholder="Город назначения"
                autoComplete="off"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass} htmlFor="f-distance">
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
            <div className="flex flex-col gap-1.5">
              <label className={labelClass} htmlFor="f-rate">
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
            <div className="flex flex-col gap-1.5">
              <label className={labelClass} htmlFor="f-trip-rate">
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
          <h2 className={sectionTitleClass}>Место погрузки и выгрузки</h2>
          <div className="flex justify-between gap-4">
            <DistrictRegionSelectorDropdown
              label="Выберите регион погрузки вашего груза"
              selectedRegions={draft.loadingRegions}
              onToggleRegion={(region) => toggleArrayItem("loadingRegions", region)}
              align="left"
            />
            <DistrictRegionSelectorDropdown
              label="Выберите регион выгрузки вашего груза"
              selectedRegions={draft.unloadingRegions}
              onToggleRegion={(region) => toggleArrayItem("unloadingRegions", region)}
              align="right"
            />
          </div>
        </section>

        <section>
          <h2 className={sectionTitleClass}>Параметры перевозки</h2>
          <div className={formGridClass}>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass} htmlFor="f-loading-date">
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
            <div className="flex flex-col gap-1.5">
              <label className={labelClass} htmlFor="f-vat">
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
            <div className="flex flex-col gap-1.5">
              <label className={labelClass} htmlFor="f-body-type">
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
          </div>
          <div className="mt-4">
            <ChipGroup
              label="Требуемый способ загрузки"
              options={LOADING_TYPES_WITH_ANY}
              selected={draft.loadingTypes}
              onToggle={(item) => toggleArrayItem("loadingTypes", item)}
            />
          </div>
          <div className="mt-4">
            <ChipGroup
              label="Требуемый способ выгрузки"
              options={UNLOADING_TYPES_WITH_ANY}
              selected={draft.unloadingTypes}
              onToggle={(item) => toggleArrayItem("unloadingTypes", item)}
            />
          </div>
        </section>

        <section>
          <h2 className={sectionTitleClass}>Груз</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <DescriptiveSelect
                label="Тип груза"
                name="cargoTypes"
                options={CARGO_TYPES}
                descriptions={CARGO_TYPE_DESCRIPTIONS}
                value={draft.cargoTypes[0] ?? ""}
                onChange={handleCargoTypeChange}
                placeholder="Выберите тип груза"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass} htmlFor="f-cargo-form">
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
            <div className={formGridClass}>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass} htmlFor="f-cargo">
                  Название груза
                </label>
                <FormInput
                  id="f-cargo"
                  type="text"
                  name="cargo"
                  onChange={handleFieldChange}
                  placeholder="Пшеница, кукуруза…"
                  autoComplete="off"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass} htmlFor="f-tonnage">
                  Тоннаж
                </label>
                <div className="flex gap-2">
                  <FormInput
                    id="f-tonnage"
                    type="number"
                    name="tonnage"
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
          </div>
        </section>

        <section>
          <h2 className={sectionTitleClass}>Доп. информация</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1.5">
              <FormTextarea
                id="f-note"
                name="additionalInfo"
                onChange={handleFieldChange}
                placeholder="Особые условия загрузки, тип транспорта, требования к перевозке…"
                rows={4}
              />
            </div>

            {draft.customProperties.map((prop, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_1fr_40px] gap-2 max-[640px]:grid-cols-1"
              >
                <FormInput
                  type="text"
                  placeholder="Название свойства"
                  autoComplete="off"
                  value={prop.name}
                  onChange={(e) =>
                    updateCustomProperty(index, "name", e.target.value)
                  }
                />
                <FormInput
                  type="text"
                  placeholder="Значение свойства"
                  autoComplete="off"
                  value={prop.value}
                  onChange={(e) =>
                    updateCustomProperty(index, "value", e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => removeCustomProperty(index)}
                  className="inline-flex items-center justify-center h-[38px] w-[40px] rounded-2xl border-[1.2px] border-[#0D0D0D0D] bg-bg-subtle text-text-muted transition-colors duration-150 hover:text-red-600"
                  aria-label="Удалить свойство"
                >
                  <CloseIcon />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addCustomProperty}
            className="inline-flex items-center gap-1.5 h-11 px-4 mt-4 rounded-pill bg-bg-subtle text-sm font-medium text-text-primary tracking-[-0.14px] whitespace-nowrap transition-colors duration-150 hover:bg-[#EFEFEF]"
          >
            <PlusIcon />
            Добавить своё свойство
          </button>
        </section>

        <section>
          <h2 className={sectionTitleClass}>Контакты</h2>
          <div className={formGridClass}>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass} htmlFor="f-name">
                Имя заказчика
              </label>
              <FormInput
                id="f-name"
                type="text"
                name="customerName"
                defaultValue={draft.customerName}
                onChange={handleFieldChange}
                placeholder="Имя и фамилия"
                autoComplete="name"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass} htmlFor="f-phone">
                Телефон
              </label>
              <FormInput
                id="f-phone"
                type="tel"
                name="customerPhone"
                defaultValue={draft.customerPhone}
                onChange={handleFieldChange}
                placeholder="+7 (___) ___-__-__"
                autoComplete="tel"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5 col-span-2 max-[640px]:col-span-1">
              <label className={labelClass} htmlFor="f-company">
                Название компании
              </label>
              <FormInput
                id="f-company"
                type="text"
                name="companyName"
                defaultValue={draft.companyName}
                onChange={handleFieldChange}
                placeholder="ООО «Компания»"
                autoComplete="organization"
                required
              />
            </div>
          </div>
        </section>

        {error ? (
          <p className="text-sm text-red-600 text-center tracking-[-0.14px]">
            {error}
          </p>
        ) : null}

        <div className="flex gap-3 pt-6 border-t border-border max-[640px]:flex-col">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex items-center justify-center flex-1 gap-1.5 h-12 px-[21px] rounded-pill bg-accent text-base font-medium text-text-inverse tracking-[-0.16px] whitespace-nowrap transition-colors duration-150 hover:bg-[#1E6834] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <PlusIcon />
            {mutation.isPending ? "Создание…" : "Создать заявку"}
          </button>
          <Link
            href="/profile"
            role="button"
            className="inline-flex items-center justify-center flex-1 h-12 px-[21px] rounded-pill bg-bg-subtle text-base font-medium text-text-primary tracking-[-0.16px] whitespace-nowrap transition-colors duration-150 hover:bg-[#EFEFEF]"
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
          <h3 className="text-sm font-semibold text-text-primary tracking-[-0.14px] mb-3">
            Предпросмотр заявки
          </h3>
          <LoadCard load={previewLoad} />
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
