"use client";

import { useEffect, useLayoutEffect, useState, type RefObject, type ReactNode } from "react";

interface AnchoredModalProps {
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLElement | null>;
  title?: string;
  panelWidthClass?: string;
  children?: ReactNode;
}

const PANEL_GAP = 8;
const VIEWPORT_MARGIN = 16;

export function AnchoredModal({
  open,
  onClose,
  triggerRef,
  title,
  panelWidthClass = "min-w-[360px]",
  children,
}: AnchoredModalProps) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const el = triggerRef.current;
    if (!el) return;
    function updatePosition() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const left = Math.min(
        rect.left,
        window.innerWidth - VIEWPORT_MARGIN * 2
      );
      setPosition({ top: rect.bottom + PANEL_GAP, left });
    }
    updatePosition();
  }, [open, triggerRef]);

  useEffect(() => {
    if (!open) return;
    function onScroll() {
      onClose();
    }
    function onResize() {
      onClose();
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open || !position) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ top: position.top, left: position.left }}
        className={`absolute max-w-[calc(100vw-32px)] bg-white border border-[#ECECEC] rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.16)] overflow-hidden ${panelWidthClass}`}
      >
        {title ? (
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[#0D0D0D0F]">
            <h2 className="text-sm font-semibold text-text-primary tracking-[-0.14px]">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className="flex items-center justify-center w-7 h-7 shrink-0 rounded-pill bg-bg-subtle text-text-secondary transition-colors duration-150 hover:bg-[#EFEFEF] hover:text-text-primary"
            >
              <CloseIcon />
            </button>
          </div>
        ) : null}
        <div className="p-5 min-h-[120px]">{children}</div>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
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