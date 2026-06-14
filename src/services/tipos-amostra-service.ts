import { api } from "@/services/api";
import type { TipoAmostra } from "@/types";

export interface ListTiposAmostraParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface CreateTipoAmostraPayload {
  nome: string;
  descricao?: string;
}

export type UpdateTipoAmostraPayload = Partial<CreateTipoAmostraPayload>;

function buildQuery(params: ListTiposAmostraParams): string {
  const searchParams = new URLSearchParams();
  if (params.page != null) searchParams.set("page", String(params.page));
  if (params.pageSize != null) searchParams.set("pageSize", String(params.pageSize));
  if (params.search) searchParams.set("search", params.search);
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const tiposAmostraService = {
  list: (params: ListTiposAmostraParams = {}) =>
    api.get<TipoAmostra[]>(`/tipos-amostra${buildQuery(params)}`),  

  getById: (id: string) => api.get<TipoAmostra>(`/tipos-amostra/${id}`),

  create: (payload: CreateTipoAmostraPayload) =>
    api.post<TipoAmostra>("/tipos-amostra", payload),

  update: (id: string, payload: UpdateTipoAmostraPayload) =>
    api.patch<TipoAmostra>(`/tipos-amostra/${id}`, payload),

  remove: (id: string) => api.delete<void>(`/tipos-amostra/${id}`),
};
