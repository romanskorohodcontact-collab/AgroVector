import type {
  Load,
  LoadFilters,
  LoadSearchResult,
  LoadSort,
} from "@/entities/load/model";
import {
  createLoad as repositoryCreateLoad,
  getLoadById as repositoryGetLoadById,
  getOwnLoad as repositoryGetOwnLoad,
  listLoads as repositoryListLoads,
  listLoadsByUser,
  searchLoads as repositorySearchLoads,
  updateOwnLoad as repositoryUpdateOwnLoad,
} from "@/server/repositories/loads.repository";
import { validateLoadInput } from "@/server/validators/loads.validator";

export function createLoad(input: unknown, userId: string): Promise<Load> {
  const data = validateLoadInput(input);
  return repositoryCreateLoad({ ...data, userId });
}

export function listLoads(filters?: LoadFilters): Promise<Load[]> {
  return repositoryListLoads(filters);
}

export function searchLoads(
  filters: LoadFilters,
  page: number,
  limit: number,
  sort?: LoadSort
): Promise<LoadSearchResult> {
  return repositorySearchLoads(filters, page, limit, sort);
}

export function getLoad(id: string): Promise<Load | null> {
  return repositoryGetLoadById(id);
}

export function listMyLoads(userId: string): Promise<Load[]> {
  return listLoadsByUser(userId);
}

export function getOwnLoad(id: string, userId: string): Promise<Load | null> {
  return repositoryGetOwnLoad(id, userId);
}

export function updateLoad(
  input: unknown,
  id: string,
  userId: string
): Promise<Load | null> {
  const data = validateLoadInput(input);
  return repositoryUpdateOwnLoad(id, userId, data);
}