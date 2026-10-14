"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePopoverDismiss } from "@/shared/lib/usePopoverDismiss";
import {
  POPOVER_PANEL_CHROME,
  POPOVER_VIEWPORT_MARGIN,
  resolvePopoverPlacement,
  scrollPopoverIntoView,
  type PopoverPlacement,
} from "@/shared/lib/popoverPlacement";

interface UseAnchoredPopoverOptions {
  panelMaxHeight: number;
  alignAnchorTop?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function useAnchoredPopover({
  panelMaxHeight,
  alignAnchorTop = false,
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
    [isControlled, onOpenChange],
  );

  const close = useCallback(() => setOpen(false), [setOpen]);
  usePopoverDismiss(open, close);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (panel) measuredHeightRef.current = panel.offsetHeight;
  }, [open]);

  const openWithScroll = useCallback(async () => {
    if (open) return;
    if (pendingRef.current) return;
    pendingRef.current = true;
    try {
      const panelHeight = measuredHeightRef.current ?? panelMaxHeight + POPOVER_PANEL_CHROME;
      const anchor = anchorRef.current;
      const resolved = resolvePopoverPlacement(anchor, panelHeight);

      let scrollTarget = resolved.scrollTarget;
      let nextPlacement = resolved.placement;

      if (alignAnchorTop && anchor) {
        const rect = anchor.getBoundingClientRect();
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        scrollTarget = Math.max(
          0,
          Math.min(window.scrollY + rect.top - POPOVER_VIEWPORT_MARGIN, maxScroll),
        );
        nextPlacement = "bottom";
      }

      setPlacement(nextPlacement);

      if (scrollTarget !== null) {
        const shouldOpen = await scrollPopoverIntoView(scrollTarget, () => mountedRef.current);
        if (!shouldOpen) return;
      }

      if (!mountedRef.current) return;
      setOpen(true);
    } finally {
      pendingRef.current = false;
    }
  }, [open, panelMaxHeight, alignAnchorTop, setOpen]);

  const toggle = useCallback(async () => {
    if (open) {
      setOpen(false);
      return;
    }
    await openWithScroll();
  }, [open, openWithScroll, setOpen]);

  return { open, setOpen, toggle, openWithScroll, anchorRef, panelRef, placement };
}
