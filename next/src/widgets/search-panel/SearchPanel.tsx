"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function SearchPanel() {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [cargo, setCargo] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (from.trim()) params.set("from", from.trim());
    if (to.trim()) params.set("to", to.trim());
    if (cargo.trim()) params.set("cargo", cargo.trim());
    const query = params.toString();
    router.push(query ? `/search?${query}` : "/search");
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "8px",
        margin: "16px",
        padding: "16px",
        border: "1px solid #000",
      }}
    >
      <input
        value={from}
        onChange={(event) => setFrom(event.target.value)}
        placeholder="Откуда"
        style={inputStyle}
      />
      <input
        value={to}
        onChange={(event) => setTo(event.target.value)}
        placeholder="Куда"
        style={inputStyle}
      />
      <input
        value={cargo}
        onChange={(event) => setCargo(event.target.value)}
        placeholder="Тип груза"
        style={inputStyle}
      />
      <button
        type="submit"
        style={buttonStyle}
      >
        Поиск
      </button>
    </form>
  );
}

const inputStyle = {
  padding: "6px 8px",
  border: "1px solid #000",
};

const buttonStyle = {
  padding: "6px 12px",
  border: "1px solid #000",
  background: "none",
  cursor: "pointer",
};