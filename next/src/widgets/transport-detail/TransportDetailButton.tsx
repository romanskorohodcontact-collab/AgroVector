"use client";

import { useState } from "react";
import type { Transport } from "@/entities/transport/model";
import { TransportCard } from "@/entities/transport/ui";
import { TransportDetailWindow } from "./TransportDetailWindow";

interface TransportDetailButtonProps {
  transport: Transport;
}

export function TransportDetailButton({ transport }: TransportDetailButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TransportCard
        transport={transport}
        onOpenDetail={() => setOpen(true)}
      />
      {open ? (
        <TransportDetailWindow
          transport={transport}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
