import type {
  Load,
  LoadFilters,
  LoadSearchResult,
} from "@/entities/load/model";
import {
  createLoad as repositoryCreateLoad,
  listLoads as repositoryListLoads,
  searchLoads as repositorySearchLoads,
} from "@/server/repositories/loads.repository";
import { validateLoadInput } from "@/server/validators/loads.validator";

export function createLoad(input: unknown): Promise<Load> {
  const data = validateLoadInput(input);
  return repositoryCreateLoad(data);
}

export function listLoads(filters?: LoadFilters): Promise<Load[]> {
  return repositoryListLoads(filters);
}

export function searchLoads(
  filters: LoadFilters,
  page: number,
  limit: number
): Promise<LoadSearchResult> {
  return repositorySearchLoads(filters, page, limit);
}