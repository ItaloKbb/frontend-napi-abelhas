import { api } from "@/services/api";
import type { StatusAnalise } from "@/constants";
import type { Analise } from "@/types";

export interface ListAnalisesParams {
  page?: number;
  pageSize?: number;
  amostraId?: string;
  tipoAnaliseId?: string;
  responsavelId?: string;
}

export interface CreateAnalisePayload {
  amostraId: string;
  tipoAnaliseId: string;
  responsavelId: string;
  status?: StatusAnalise;
}

export type UpdateAnalisePayload = Partial<CreateAnalisePayload>;

function buildQuery(params: ListAnalisesParams): string {
  const searchParams = new URLSearchParams();
  if (params.page != null) searchParams.set("page", String(params.page));
  if (params.pageSize != null) searchParams.set("pageSize", String(params.pageSize));
  if (params.amostraId) searchParams.set("amostraId", params.amostraId);
  if (params.tipoAnaliseId) searchParams.set("tipoAnaliseId", params.tipoAnaliseId);
  if (params.responsavelId) searchParams.set("responsavelId", params.responsavelId);
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const analisesService = {
  list: (params: ListAnalisesParams = {}) =>
    api.get<Analise[]>(`/analises${buildQuery(params)}`),  

  getById: (id: string) => api.get<Analise>(`/analises/${id}`),

  create: (payload: CreateAnalisePayload) =>
    api.post<Analise>("/analises", payload),

  update: (id: string, payload: UpdateAnalisePayload) =>
    api.patch<Analise>(`/analises/${id}`, payload),

  remove: (id: string) => api.delete<void>(`/analises/${id}`),
};
