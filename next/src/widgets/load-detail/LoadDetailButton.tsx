"use client";

import { useState } from "react";
import type { Load } from "@/entities/load/model";
import { LoadDetailWindow } from "./LoadDetailWindow";

const buttonClass =
  // bg-accent text-white
  // bg-black text-white
  "inline-flex items-center justify-center rounded-pill border-[0.8px] border-[#0D0D0D1A] bg-[#333333] text-white px-4 h-9 gap-2 text-sm font-normal text-center leading-[1.43] tracking-[-0.14px] whitespace-nowrap cursor-pointer transition-colors duration-150 hover:border-[#0D0D0D33] max-md:w-full w-full";

interface LoadDetailButtonProps {
  load: Load;
}

export function LoadDetailButton({ load }: LoadDetailButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={buttonClass}>
        Подробнее
      </button>
      {open ? <LoadDetailWindow load={load} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
