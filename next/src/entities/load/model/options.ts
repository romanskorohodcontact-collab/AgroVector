import { LOADING_TYPES, UNLOADING_TYPES } from "@/entities/transport/model";

export const ANY_WAY = "Не имеет значения";

export const LOADING_TYPES_WITH_ANY = [...LOADING_TYPES, ANY_WAY] as const;

export const UNLOADING_TYPES_WITH_ANY = [...UNLOADING_TYPES, ANY_WAY] as const;

export const ADVANCE_TYPES = ["Аванс есть", "Аванса нет", "Аванс обсуждается"] as const;
