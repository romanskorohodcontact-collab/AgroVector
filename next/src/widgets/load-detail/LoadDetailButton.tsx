"use client";

import { useState } from "react";
import type { Load } from "@/entities/load/model";
import { LoadDetailWindow } from "./LoadDetailWindow";
import { ArrowUpRight } from "lucide-react";

const buttonClass =
  // bg-accent text-text-inverse
  // bg-black text-text-inverse
  "inline-flex items-center justify-center rounded-pill bg-[#E4F7EC] text-accent px-4 h-9 gap-2 text-sm font-normal text-center leading-[1.43] tracking-[-0.14px] whitespace-nowrap cursor-pointer transition-colors duration-150 hover:border-outline-hover max-md:w-full w-full";

interface LoadDetailButtonProps {
  load: Load;
}

export function LoadDetailButton({ load }: LoadDetailButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={buttonClass}>
        Подробнее
        <ArrowUpRight className="h-4 w-4" />
      </button>
      {open ? <LoadDetailWindow load={load} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
