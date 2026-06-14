import { api } from "@/services/api";
import type { CidadeIBGE } from "@/types";

export interface ListCidadesIbgeParams {
  page?: number;
  pageSize?: number;
  estado?: string;
  regiao?: string;
  bioma?: string;
}

function buildQuery(params: ListCidadesIbgeParams): string {
  const searchParams = new URLSearchParams();
  if (params.page != null) searchParams.set("page", String(params.page));
  if (params.pageSize != null) searchParams.set("pageSize", String(params.pageSize));
  if (params.estado) searchParams.set("estado", params.estado);
  if (params.regiao) searchParams.set("regiao", params.regiao);
  if (params.bioma) searchParams.set("bioma", params.bioma);
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const cidadesIbgeService = {
  list: (params: ListCidadesIbgeParams = {}) =>
    api.get<CidadeIBGE[]>(`/cidades-ibge${buildQuery(params)}`),  

  getById: (id: string) => api.get<CidadeIBGE>(`/cidades-ibge/${id}`),

  seed: () => api.post<{ message: string }>("/cidades-ibge/seed", {}),
};
