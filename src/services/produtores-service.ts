import { api } from "@/services/api";
import type { Produtor } from "@/types";

export interface ListProdutoresParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface CreateProdutorPayload {
  nome: string;
  cidadeId?: string;
}

export type UpdateProdutorPayload = Partial<CreateProdutorPayload>;

function buildQuery(params: ListProdutoresParams): string {
  const searchParams = new URLSearchParams();
  if (params.page != null) searchParams.set("page", String(params.page));
  if (params.pageSize != null) searchParams.set("pageSize", String(params.pageSize));
  if (params.search) searchParams.set("search", params.search);
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const produtoresService = {
  list: (params: ListProdutoresParams = {}) =>
    api.get<Produtor[]>(`/produtores${buildQuery(params)}`),  

  getById: (id: string) => api.get<Produtor>(`/produtores/${id}`),

  create: (payload: CreateProdutorPayload) =>
    api.post<Produtor>("/produtores", payload),

  update: (id: string, payload: UpdateProdutorPayload) =>
    api.patch<Produtor>(`/produtores/${id}`, payload),

  remove: (id: string) => api.delete<void>(`/produtores/${id}`),
};
