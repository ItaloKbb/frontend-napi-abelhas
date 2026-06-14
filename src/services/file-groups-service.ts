import { api } from "@/services/api";
import type { FileType } from "@/constants";
import type { FileGroup, AppFile } from "@/types";

export interface ListFileGroupsParams {
  page?: number;
  pageSize?: number;
  amostraId?: string;
  analiseId?: string;
}

export interface CreateFileGroupPayload {
  amostraId?: string;
  analiseId?: string;
}

export type UpdateFileGroupPayload = Partial<CreateFileGroupPayload>;

export interface AddFilePayload {
  url: string;
  type?: FileType;
  uploadedByUserId?: string;
  uploadedByName?: string;
}

function buildQuery(params: ListFileGroupsParams): string {
  const searchParams = new URLSearchParams();
  if (params.page != null) searchParams.set("page", String(params.page));
  if (params.pageSize != null) searchParams.set("pageSize", String(params.pageSize));
  if (params.amostraId) searchParams.set("amostraId", params.amostraId);
  if (params.analiseId) searchParams.set("analiseId", params.analiseId);
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const fileGroupsService = {
  list: (params: ListFileGroupsParams = {}) =>
    api.get<FileGroup[]>(`/file-groups${buildQuery(params)}`),  

  getById: (id: string) => api.get<FileGroup>(`/file-groups/${id}`),

  create: (payload: CreateFileGroupPayload) =>
    api.post<FileGroup>("/file-groups", payload),

  update: (id: string, payload: UpdateFileGroupPayload) =>
    api.patch<FileGroup>(`/file-groups/${id}`, payload),

  remove: (id: string) => api.delete<void>(`/file-groups/${id}`),

  addFile: (groupId: string, payload: AddFilePayload) =>
    api.post<AppFile>(`/file-groups/${groupId}/files`, payload),

  removeFile: (groupId: string, fileId: string) =>
    api.delete<void>(`/file-groups/${groupId}/files/${fileId}`),
};
