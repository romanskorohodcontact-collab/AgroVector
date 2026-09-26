"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePopoverDismiss } from "@/shared/lib/usePopoverDismiss";
import {
  POPOVER_PANEL_CHROME,
  resolvePopoverPlacement,
  scrollPopoverIntoView,
  type PopoverPlacement,
} from "@/shared/lib/popoverPlacement";

interface UseAnchoredPopoverOptions {
  panelMaxHeight: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function useAnchoredPopover({
  panelMaxHeight,
  open: controlledOpen,
  onOpenChange,
}: UseAnchoredPopoverOptions) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const anchorRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const measuredHeightRef = useRef<number | null>(null);
  const pendingRef = useRef(false);
  const mountedRef = useRef(true);
  const [placement, setPlacement] = useState<PopoverPlacement>("bottom");

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const setOpen = useCallback(
    (value: boolean) => {
      if (isControlled) {
        onOpenChange?.(value);
      } else {
        setInternalOpen(value);
      }
    },
    [isControlled, onOpenChange]
  );

  const close = useCallback(() => setOpen(false), [setOpen]);
  usePopoverDismiss(open, close);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (panel) measuredHeightRef.current = panel.offsetHeight;
  }, [open]);

  const toggle = useCallback(async () => {
    if (open) {
      setOpen(false);
      return;
    }
    if (pendingRef.current) return;
    pendingRef.current = true;
    try {
      const panelHeight =
        measuredHeightRef.current ?? panelMaxHeight + POPOVER_PANEL_CHROME;
      const { placement: nextPlacement, scrollTarget } =
        resolvePopoverPlacement(anchorRef.current, panelHeight);
      setPlacement(nextPlacement);

      if (scrollTarget !== null) {
        const shouldOpen = await scrollPopoverIntoView(
          scrollTarget,
          () => mountedRef.current
        );
        if (!shouldOpen) return;
      }

      if (!mountedRef.current) return;
      setOpen(true);
    } finally {
      pendingRef.current = false;
    }
  }, [open, panelMaxHeight, setOpen]);

  return { open, setOpen, toggle, anchorRef, panelRef, placement };
}
