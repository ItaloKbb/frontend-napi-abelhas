import { api } from "@/services/api";
import type { Amostra } from "@/types";

export interface ListAmostrasParams {
  page?: number;
  pageSize?: number;
  search?: string;
  tipoAmostraId?: string;
  produtorId?: string;
  abelhaId?: string;
  pontoColetaId?: string;
}

export interface CreateAmostraPayload {
  nome: string;
  dataColeta: string;
  pontoColetaId: string;
  abelhaId: string;
  produtorId: string;
  tipoAmostraId: string;
}

export type UpdateAmostraPayload = Partial<CreateAmostraPayload>;

function buildQuery(params: ListAmostrasParams): string {
  const searchParams = new URLSearchParams();
  if (params.page != null) searchParams.set("page", String(params.page));
  if (params.pageSize != null) searchParams.set("pageSize", String(params.pageSize));
  if (params.search) searchParams.set("search", params.search);
  if (params.tipoAmostraId) searchParams.set("tipoAmostraId", params.tipoAmostraId);
  if (params.produtorId) searchParams.set("produtorId", params.produtorId);
  if (params.abelhaId) searchParams.set("abelhaId", params.abelhaId);
  if (params.pontoColetaId) searchParams.set("pontoColetaId", params.pontoColetaId);
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const amostrasService = {
  list: (params: ListAmostrasParams = {}) =>
    api.get<Amostra[]>(`/amostras${buildQuery(params)}`),  

  getById: (id: string) => api.get<Amostra>(`/amostras/${id}`),

  create: (payload: CreateAmostraPayload) =>
    api.post<Amostra>("/amostras", payload),

  update: (id: string, payload: UpdateAmostraPayload) =>
    api.patch<Amostra>(`/amostras/${id}`, payload),

  remove: (id: string) => api.delete<void>(`/amostras/${id}`),
};
