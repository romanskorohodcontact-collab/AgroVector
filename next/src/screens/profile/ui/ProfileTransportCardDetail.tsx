"use client";

import { useState } from "react";
import type { Transport } from "@/entities/transport/model";
import { TransportDetailWindow } from "@/widgets/transport-detail";
import { ProfileTransportCard } from "./ProfileTransportCard";

interface ProfileTransportCardDetailProps {
  transport: Transport;
}

export function ProfileTransportCardDetail({
  transport,
}: ProfileTransportCardDetailProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ProfileTransportCard
        transport={transport}
        editable
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