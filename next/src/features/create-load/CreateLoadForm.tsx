"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import type { GeoPoint } from "@/entities/load/model";
import { MapPicker } from "@/features/map";

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const inputStyle: React.CSSProperties = {
  padding: "6px 8px",
  border: "1px solid #000",
};

export function CreateLoadForm() {
  const router = useRouter();
  const [location, setLocation] = useState<GeoPoint | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

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
    mutation.mutate({
      loadingPlace: form.get("loadingPlace"),
      loadingLocation: location,
      unloadingPlace: form.get("unloadingPlace"),
      distance: Number(form.get("distance")),
      rate: Number(form.get("rate")),
      tonnage: Number(form.get("tonnage")),
      cargo: form.get("cargo"),
      additionalInfo: form.get("additionalInfo"),
      customerName: form.get("customerName"),
      customerPhone: form.get("customerPhone"),
      companyName: form.get("companyName"),
    });
  }

  const error = formError ?? (mutation.isError ? mutation.error.message : null);

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxWidth: "560px",
        margin: "24px auto",
        padding: "16px",
        border: "1px solid #000",
      }}
    >
      <fieldset style={{ border: "1px solid #000", padding: "12px" }}>
        <legend>Место погрузки</legend>
        <label style={labelStyle}>
          Текстовое описание
          <input name="loadingPlace" required style={inputStyle} />
        </label>
        <div className="mt-3">
          <p className="mb-1">Точка на карте</p>
          <MapPicker initialLocation={null} onSelect={setLocation} />
        </div>
      </fieldset>
      <label style={labelStyle}>
        Место выгрузки
        <input name="unloadingPlace" required style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Расстояние, км
        <input name="distance" type="number" required style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Ставка
        <input name="rate" type="number" required style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Тоннаж, т
        <input name="tonnage" type="number" required style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Груз
        <input name="cargo" required style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Доп. информация
        <input name="additionalInfo" style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Имя заказчика
        <input name="customerName" required style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Телефон заказчика
        <input name="customerPhone" required style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Название компании
        <input name="companyName" required style={inputStyle} />
      </label>
      {error ? <p style={{ color: "red" }}>{error}</p> : null}
      <button
        type="submit"
        disabled={mutation.isPending}
        style={{
          padding: "6px 12px",
          border: "1px solid #000",
          background: "none",
          cursor: "pointer",
        }}
      >
        {mutation.isPending ? "Создание…" : "Создать заявку"}
      </button>
    </form>
  );
}