import { api } from "@/services/api";
import type { Responsavel } from "@/types";

export interface ListResponsaveisParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface CreateResponsavelPayload {
  nome: string;
  instituicaoId: string;
  cidadeId?: string;
}

export type UpdateResponsavelPayload = Partial<CreateResponsavelPayload>;

function buildQuery(params: ListResponsaveisParams): string {
  const searchParams = new URLSearchParams();
  if (params.page != null) searchParams.set("page", String(params.page));
  if (params.pageSize != null) searchParams.set("pageSize", String(params.pageSize));
  if (params.search) searchParams.set("search", params.search);
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const responsaveisService = {
  list: (params: ListResponsaveisParams = {}) =>
    api.get<Responsavel[]>(`/responsaveis${buildQuery(params)}`),  

  getById: (id: string) => api.get<Responsavel>(`/responsaveis/${id}`),

  create: (payload: CreateResponsavelPayload) =>
    api.post<Responsavel>("/responsaveis", payload),

  update: (id: string, payload: UpdateResponsavelPayload) =>
    api.patch<Responsavel>(`/responsaveis/${id}`, payload),

  remove: (id: string) => api.delete<void>(`/responsaveis/${id}`),
};
