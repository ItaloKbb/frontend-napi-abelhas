import { api } from "@/services/api";
import type { TipoAnalise } from "@/types";

export interface ListTiposAnaliseParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface CreateTipoAnalisePayload {
  nome: string;
}

export type UpdateTipoAnalisePayload = Partial<CreateTipoAnalisePayload>;

function buildQuery(params: ListTiposAnaliseParams): string {
  const searchParams = new URLSearchParams();
  if (params.page != null) searchParams.set("page", String(params.page));
  if (params.pageSize != null) searchParams.set("pageSize", String(params.pageSize));
  if (params.search) searchParams.set("search", params.search);
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const tiposAnaliseService = {
  list: (params: ListTiposAnaliseParams = {}) =>
    api.get<TipoAnalise[]>(`/tipos-analise${buildQuery(params)}`),  

  getById: (id: string) => api.get<TipoAnalise>(`/tipos-analise/${id}`),

  create: (payload: CreateTipoAnalisePayload) =>
    api.post<TipoAnalise>("/tipos-analise", payload),

  update: (id: string, payload: UpdateTipoAnalisePayload) =>
    api.patch<TipoAnalise>(`/tipos-analise/${id}`, payload),

  remove: (id: string) => api.delete<void>(`/tipos-analise/${id}`),
};
