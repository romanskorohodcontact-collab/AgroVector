import type { YmapsPlacemarkOptions } from "@/features/map/loadYmaps";

/**
 * Геометрия иконок скопирована дословно из `lucide-react@1.47.0`
 * (`dist/esm/icons/package.mjs`, `dist/esm/icons/truck.mjs`).
 * Импортировать их из пакета нельзя: `lucide-react` отдаёт только React-компонент,
 * а `ymaps` в `iconLayout` принимает готовый SVG или data-URI.
 */
const PACKAGE_SHAPES = [
  '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/>',
  '<path d="M12 22V12"/>',
  '<polyline points="3.29 7 12 12 20.71 7"/>',
  '<path d="m7.5 4.27 9 5.15"/>',
];

const TRUCK_SHAPES = [
  '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>',
  '<path d="M15 18H9"/>',
  '<path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>',
  '<circle cx="17" cy="18" r="2"/>',
  '<circle cx="7" cy="18" r="2"/>',
];

/**
 * Токены `--color-accent` и `--color-accent-orange` из `app/globals.css`.
 * В data-URI SVG (iconLayout у `ymaps`) CSS-переменные не резолвятся,
 * поэтому значения продублированы здесь.
 */
const LOAD_FILL = "#0BB552";
const TRANSPORT_FILL = "#E95420";

const MAP_MARKER_SIZE = 32;
const MAP_MARKER_ICON_SIZE = 16;
const MAP_MARKER_ICON_COLOR = "#FFFFFF";

/** Исходная система координат и толщина штриха иконок lucide. */
const LUCIDE_VIEWBOX_SIZE = 24;
const LUCIDE_STROKE_WIDTH = 2;

export const MAP_CLUSTER_SIZE = 40;
export const MAP_MARKER_SHADOW_ALPHA = 0.1;

export const LOAD_MARKER_FILL = LOAD_FILL;
export const TRANSPORT_MARKER_FILL = TRANSPORT_FILL;

function buildMarkerSvg(shapes: string[], fill: string): string {
  const center = MAP_MARKER_SIZE / 2;
  const scale = MAP_MARKER_ICON_SIZE / LUCIDE_VIEWBOX_SIZE;
  const iconOrigin = center - MAP_MARKER_ICON_SIZE / 2;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${MAP_MARKER_SIZE}" height="${MAP_MARKER_SIZE}" viewBox="0 0 ${MAP_MARKER_SIZE} ${MAP_MARKER_SIZE}">`,
    `<circle cx="${center}" cy="${center + 1}" r="${center - 1}" fill="rgba(0,0,0,${MAP_MARKER_SHADOW_ALPHA})"/>`,
    `<circle cx="${center}" cy="${center}" r="${center - 1}" fill="${fill}"/>`,
    `<g fill="none" stroke="${MAP_MARKER_ICON_COLOR}" stroke-width="${LUCIDE_STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round" transform="translate(${iconOrigin} ${iconOrigin}) scale(${scale})">`,
    shapes.join(""),
    "</g>",
    "</svg>",
  ].join("");
}

function toDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function buildMarkerOptions(shapes: string[], fill: string): YmapsPlacemarkOptions {
  return {
    iconLayout: {
      image: toDataUri(buildMarkerSvg(shapes, fill)),
      iconSize: [MAP_MARKER_SIZE, MAP_MARKER_SIZE],
      iconOffset: [-MAP_MARKER_SIZE / 2, -MAP_MARKER_SIZE / 2],
    },
  };
}

export const LOAD_MARKER_OPTIONS = buildMarkerOptions(PACKAGE_SHAPES, LOAD_FILL);
export const TRANSPORT_MARKER_OPTIONS = buildMarkerOptions(
  TRUCK_SHAPES,
  TRANSPORT_FILL
);
