import type {
  Transport,
  TransportFilters,
  TransportSearchResult,
  TransportSort,
} from "@/entities/transport/model";
import {
  createTransport as repositoryCreateTransport,
  deleteOwnTransport as repositoryDeleteOwnTransport,
  getOwnTransport as repositoryGetOwnTransport,
  getTransportById as repositoryGetTransportById,
  getTransportsByIds as repositoryGetTransportsByIds,
  listTransports as repositoryListTransports,
  listTransportsByUser,
  searchTransports as repositorySearchTransports,
  updateOwnTransport as repositoryUpdateOwnTransport,
} from "@/server/repositories/transports.repository";
import { validateTransportInput } from "@/server/validators/transports.validator";

export function createTransport(input: unknown, userId: string): Promise<Transport> {
  const data = validateTransportInput(input);
  return repositoryCreateTransport({ ...data, userId });
}

export function listTransports(filters?: TransportFilters): Promise<Transport[]> {
  return repositoryListTransports(filters);
}

export function searchTransports(
  filters: TransportFilters,
  page: number,
  limit: number,
  sort?: TransportSort
): Promise<TransportSearchResult> {
  return repositorySearchTransports(filters, page, limit, sort);
}

export function getTransport(id: string): Promise<Transport | null> {
  return repositoryGetTransportById(id);
}

export function listMyTransports(userId: string): Promise<Transport[]> {
  return listTransportsByUser(userId);
}

export function getOwnTransport(id: string, userId: string): Promise<Transport | null> {
  return repositoryGetOwnTransport(id, userId);
}

export function updateTransport(
  input: unknown,
  id: string,
  userId: string
): Promise<Transport | null> {
  const data = validateTransportInput(input);
  return repositoryUpdateOwnTransport(id, userId, data);
}

export function deleteTransport(id: string, userId: string): Promise<boolean> {
  return repositoryDeleteOwnTransport(id, userId);
}

export function getTransportsByIds(ids: string[]): Promise<Transport[]> {
  return repositoryGetTransportsByIds(ids);
}
