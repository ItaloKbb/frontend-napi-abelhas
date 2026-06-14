import { api } from "@/services/api";
import type { PontoColeta } from "@/types";

export interface ListPontosColetaParams {
  page?: number;
  pageSize?: number;
  search?: string;
  cidadeId?: string;
}

export interface CreatePontoColetaPayload {
  nome: string;
  latitude: number;
  longitude: number;
  raio?: number;
  cidadeId: string;
}

export type UpdatePontoColetaPayload = Partial<CreatePontoColetaPayload>;

function buildQuery(params: ListPontosColetaParams): string {
  const searchParams = new URLSearchParams();
  if (params.page != null) searchParams.set("page", String(params.page));
  if (params.pageSize != null) searchParams.set("pageSize", String(params.pageSize));
  if (params.search) searchParams.set("search", params.search);
  if (params.cidadeId) searchParams.set("cidadeId", params.cidadeId);
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const pontosColetaService = {
  list: (params: ListPontosColetaParams = {}) =>
    api.get<PontoColeta[]>(`/pontos-coleta${buildQuery(params)}`),  

  getById: (id: string) => api.get<PontoColeta>(`/pontos-coleta/${id}`),

  create: (payload: CreatePontoColetaPayload) =>
    api.post<PontoColeta>("/pontos-coleta", payload),

  update: (id: string, payload: UpdatePontoColetaPayload) =>
    api.patch<PontoColeta>(`/pontos-coleta/${id}`, payload),

  remove: (id: string) => api.delete<void>(`/pontos-coleta/${id}`),
};
