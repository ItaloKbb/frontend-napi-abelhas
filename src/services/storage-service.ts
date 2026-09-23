import { api } from "@/services/api";

interface PresignedUploadResponse {
  url: string;
  key: string;
}

interface PresignedDownloadResponse {
  url: string;
}

export const storageService = {
  getUploadUrl: (fileName: string, contentType: string, folder = "uploads") =>
    api.post<PresignedUploadResponse>("/storage/upload-url", {
      fileName,
      contentType,
      folder,
    }),

  getDownloadUrl: (key: string) =>
    api.post<PresignedDownloadResponse>("/storage/download-url", { key }),

  async uploadFile(
    file: File,
    folder = "uploads"
  ): Promise<{ key: string; url: string }> {
    const contentType = file.type || "application/octet-stream";
    const { url, key } = await this.getUploadUrl(
      file.name,
      contentType,
      folder
    );

    const response = await fetch(url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": contentType },
    });

    if (!response.ok) {
      throw new Error(
        `Falha no upload (${response.status} ${response.statusText})`
      );
    }

    return { key, url: key };
  },
};
