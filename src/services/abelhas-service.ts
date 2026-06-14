import { api } from "@/services/api";
import type { Abelha } from "@/types";

export interface ListAbelhasParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface CreateAbelhaPayload {
  nomeCientifico: string;
  nomePopular?: string;
  semFerrao?: boolean;
  nativa?: boolean;
  descricao?: string;
}

export type UpdateAbelhaPayload = Partial<CreateAbelhaPayload>;

function buildQuery(params: ListAbelhasParams): string {
  const searchParams = new URLSearchParams();
  if (params.page != null) searchParams.set("page", String(params.page));
  if (params.pageSize != null) searchParams.set("pageSize", String(params.pageSize));
  if (params.search) searchParams.set("search", params.search);
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const abelhasService = {
  list: (params: ListAbelhasParams = {}) =>
    api.get<Abelha[]>(`/abelhas${buildQuery(params)}`),  

  getById: (id: string) => api.get<Abelha>(`/abelhas/${id}`),

  create: (payload: CreateAbelhaPayload) =>
    api.post<Abelha>("/abelhas", payload),

  update: (id: string, payload: UpdateAbelhaPayload) =>
    api.patch<Abelha>(`/abelhas/${id}`, payload),

  remove: (id: string) => api.delete<void>(`/abelhas/${id}`),
};
