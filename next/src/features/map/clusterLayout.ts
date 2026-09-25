import {
  MAP_CLUSTER_SIZE,
  MAP_MARKER_SHADOW_ALPHA,
} from "@/features/map/markerIcons";
import type { YmapsApi } from "@/features/map/loadYmaps";

interface ClusterLike {
  getGeoObjects?: () => unknown[];
}

interface ClusterLayoutState {
  label: HTMLSpanElement | null;
}

const LABEL_FONT_SIZE = 14;
const LABEL_LINE_HEIGHT = 1;
const LABEL_TRACKING = -0.14;

function countMembers(geoObjects: ClusterLike[] | undefined): number {
  let count = 0;
  for (const cluster of geoObjects ?? []) {
    const members = cluster?.getGeoObjects?.();
    count += Array.isArray(members) ? members.length : 0;
  }
  return count;
}

/**
 * Свой layout кластера: круг `MAP_CLUSTER_SIZE` с числом заявок внутри.
 * Заменяет пресет `islands#redClusterIcons`, чтобы цвет кластера совпадал
 * с цветом одиночных меток.
 */
export function createClusterLayout(ymaps: YmapsApi, fill: string): unknown {
  const size = `${MAP_CLUSTER_SIZE}px`;

  return ymaps.templateLayoutFactory.createClass("request-cluster", {
    create(this: ClusterLayoutState, geoObjects: ClusterLike[]) {
      const container = document.createElement("div");
      container.style.cssText = `position:relative;width:${size};height:${size};`;

      const shadow = document.createElement("div");
      shadow.style.cssText =
        "position:absolute;left:0;right:0;top:1px;bottom:0;" +
        `border-radius:9999px;background:rgba(0,0,0,${MAP_MARKER_SHADOW_ALPHA});`;

      const circle = document.createElement("div");
      circle.style.cssText =
        "position:relative;display:flex;align-items:center;justify-content:center;" +
        `width:${size};height:${size};border-radius:9999px;background:${fill};`;

      const label = document.createElement("span");
      label.style.cssText =
        "color:var(--color-text-inverse,#FFFFFF);" +
        `font-size:${LABEL_FONT_SIZE}px;font-weight:600;` +
        `line-height:${LABEL_LINE_HEIGHT};letter-spacing:${LABEL_TRACKING}px;`;
      label.textContent = String(countMembers(geoObjects));

      circle.appendChild(label);
      container.appendChild(shadow);
      container.appendChild(circle);

      this.label = label;

      return container;
    },
    update(this: ClusterLayoutState, geoObjects: ClusterLike[]) {
      if (this.label) {
        this.label.textContent = String(countMembers(geoObjects));
      }
    },
    getShape() {
      return {
        type: "Rectangle",
        coordinates: [0, 0, MAP_CLUSTER_SIZE, MAP_CLUSTER_SIZE],
        fill,
      };
    },
  });
}
