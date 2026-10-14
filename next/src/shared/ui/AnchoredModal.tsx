"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
  type ReactNode,
} from "react";
import { FilterPopover } from "./FilterPopover";

interface AnchoredModalProps {
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLElement | null>;
  title: string;
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
  panelWidthClass = "min-w-[360px] max-w-[90vw]",
  children,
}: AnchoredModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const panelWidth = panelRef.current?.offsetWidth ?? 0;
    const maxLeft = window.innerWidth - VIEWPORT_MARGIN - panelWidth;
    const left = Math.max(VIEWPORT_MARGIN, Math.min(rect.left, maxLeft));
    const top = rect.bottom + PANEL_GAP;
    setPosition((prev) => (prev && prev.top === top && prev.left === left ? prev : { top, left }));
  }, [triggerRef]);

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }
    updatePosition();
  }, [open, updatePosition]);

  useLayoutEffect(() => {
    if (open && position) updatePosition();
  }, [open, position, updatePosition]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    function onReflow() {
      updatePosition();
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onReflow);
    window.addEventListener("scroll", onReflow, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onReflow);
      window.removeEventListener("scroll", onReflow, true);
    };
  }, [open, onClose, updatePosition]);

  if (!open || !position) return null;

  const panelStyle: CSSProperties = {
    position: "fixed",
    top: position.top,
    left: position.left,
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 z-40 bg-bg-overlay" onClick={onClose} aria-hidden="true" />

      <FilterPopover
        label={title}
        panelWidthClass={panelWidthClass}
        panelStyle={panelStyle}
        panelRef={panelRef}
      >
        {children}
      </FilterPopover>
    </div>
  );
}
