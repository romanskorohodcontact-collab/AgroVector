"use client";

export const POPOVER_GAP = 8;
export const POPOVER_VIEWPORT_MARGIN = 16;
export const POPOVER_PANEL_CHROME = 48;

export type PopoverPlacement = "bottom" | "top";

interface PopoverPlacementResult {
  placement: PopoverPlacement;
  scrollTarget: number | null;
}

let activeRequest: symbol | null = null;

export function resolvePopoverPlacement(
  anchor: HTMLElement | null,
  panelHeight: number,
): PopoverPlacementResult {
  if (!anchor) return { placement: "bottom", scrollTarget: null };

  const rect = anchor.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const gapAndMargin = POPOVER_GAP + POPOVER_VIEWPORT_MARGIN;
  const availableBelow = viewportHeight - rect.bottom - gapAndMargin;

  if (panelHeight <= availableBelow) {
    return { placement: "bottom", scrollTarget: null };
  }

  const maxScroll = document.documentElement.scrollHeight - viewportHeight;
  const needed = panelHeight - availableBelow;
  const target = Math.max(0, Math.min(window.scrollY + needed, maxScroll));
  const shift = target - window.scrollY;

  if (shift > 0 && panelHeight <= availableBelow + shift) {
    return { placement: "bottom", scrollTarget: target };
  }

  const availableAbove = rect.top - gapAndMargin;
  if (panelHeight <= availableAbove) {
    return { placement: "top", scrollTarget: null };
  }

  return {
    placement: availableBelow >= availableAbove ? "bottom" : "top",
    scrollTarget: shift > 0 && availableBelow >= availableAbove ? target : null,
  };
}

function prefersReducedMotion(): boolean {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function waitForScrollEnd(target: number): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    let raf = 0;
    let last = window.scrollY;
    let stableFrames = 0;

    const cleanup = () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scrollend", onScrollEnd);
      window.clearTimeout(timeout);
    };
    const finish = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    };
    const tick = () => {
      const y = window.scrollY;
      if (Math.abs(y - target) < 1) {
        finish();
        return;
      }
      stableFrames = Math.abs(y - last) < 0.5 ? stableFrames + 1 : 0;
      if (stableFrames > 4) {
        finish();
        return;
      }
      last = y;
      raf = window.requestAnimationFrame(tick);
    };
    const onScrollEnd = () => finish();
    const timeout = window.setTimeout(finish, 900);

    window.addEventListener("scrollend", onScrollEnd);
    raf = window.requestAnimationFrame(tick);
  });
}

export async function scrollPopoverIntoView(
  target: number,
  isActive: () => boolean,
): Promise<boolean> {
  if (Math.abs(window.scrollY - target) < 1) return isActive();

  if (prefersReducedMotion()) {
    window.scrollTo({ top: target, behavior: "auto" });
    return isActive();
  }

  const token = Symbol("popover-scroll");
  activeRequest = token;
  window.scrollTo({ top: target, behavior: "smooth" });
  await waitForScrollEnd(target);

  if (activeRequest !== token) return false;
  return isActive();
}
