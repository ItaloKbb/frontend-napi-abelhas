"use client";

import { useCallback, useState } from "react";
import { storageService } from "@/services/storage-service";
import { FileType } from "@/constants";
import type { AppFile } from "@/types";

function detectFileType(mime: string): FileType {
  if (mime.startsWith("image/")) return FileType.IMAGE;
  if (mime === "application/pdf") return FileType.PDF;
  if (mime.startsWith("text/")) return FileType.TEXTO;
  return FileType.OUTROS;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface UploadingFile {
  id: string;
  name: string;
  size: number;
  type: FileType;
  progress: number;
  status: "uploading" | "done" | "error";
  key?: string;
  errorMsg?: string;
}

interface FileUploadProps {
  folder?: string;
  existingFiles?: AppFile[];
  onFileUploaded: (file: { url: string; type: FileType }) => void;
  onFileRemoved?: (fileId: string) => void;
  accept?: string;
  maxSizeMB?: number;
}

export function FileUpload({
  folder = "analises",
  existingFiles = [],
  onFileUploaded,
  onFileRemoved,
  accept,
  maxSizeMB = 25,
}: FileUploadProps) {
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const incoming = Array.from(files);
      const maxBytes = maxSizeMB * 1024 * 1024;

      const entries: UploadingFile[] = incoming.map((f) => ({
        id: crypto.randomUUID(),
        name: f.name,
        size: f.size,
        type: detectFileType(f.type),
        progress: 0,
        status: f.size > maxBytes ? "error" : "uploading",
        errorMsg: f.size > maxBytes ? `Excede ${maxSizeMB} MB` : undefined,
      }));

      setUploading((prev) => [...prev, ...entries]);

      for (let i = 0; i < incoming.length; i++) {
        const file = incoming[i];
        const entry = entries[i];
        if (entry.status === "error") continue;

        try {
          const { key } = await storageService.uploadFile(file, folder);
          setUploading((prev) =>
            prev.map((u) =>
              u.id === entry.id
                ? { ...u, status: "done", progress: 100, key }
                : u
            )
          );
          onFileUploaded({ url: key, type: entry.type });
        } catch {
          setUploading((prev) =>
            prev.map((u) =>
              u.id === entry.id
                ? { ...u, status: "error", errorMsg: "Falha no upload" }
                : u
            )
          );
        }
      }
    },
    [folder, maxSizeMB, onFileUploaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const removeUploading = (id: string) =>
    setUploading((prev) => prev.filter((u) => u.id !== id));

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <label
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-colors ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-base-300 hover:border-primary/50 hover:bg-base-200/30"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="size-12 rounded-full bg-base-200 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-6 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
        </div>
        <div className="text-center">
          <p className="font-medium text-base-content/70">
            Arraste arquivos aqui ou <span className="text-primary">clique para selecionar</span>
          </p>
          <p className="text-xs text-base-content/40 mt-1">
            Máximo {maxSizeMB} MB por arquivo • PDF, imagens, documentos
          </p>
        </div>
        <input
          type="file"
          className="hidden"
          multiple
          accept={accept}
          onChange={(e) => {
            if (e.target.files?.length) processFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      {/* Upload progress list */}
      {uploading.length > 0 && (
        <div className="space-y-2">
          {uploading.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-3 rounded-lg bg-base-200/40 px-4 py-3"
            >
              <FileIcon type={u.type} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{u.name}</p>
                <p className="text-xs text-base-content/40">{formatSize(u.size)}</p>
                {u.status === "uploading" && (
                  <progress className="progress progress-primary w-full h-1 mt-1" />
                )}
              </div>
              {u.status === "done" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="size-5 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
              {u.status === "error" && (
                <span className="text-xs text-error">{u.errorMsg}</span>
              )}
              <button
                type="button"
                className="btn btn-ghost btn-xs btn-square"
                onClick={() => removeUploading(u.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Existing files */}
      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-base-content/50 uppercase tracking-wider font-semibold">
            Arquivos anexados
          </p>
          {existingFiles.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-3 rounded-lg bg-base-200/40 px-4 py-3"
            >
              <FileIcon type={f.type} />
              <p className="text-sm font-medium truncate flex-1">
                {f.url.split("/").pop()}
              </p>
              <span className="badge badge-sm badge-ghost">{f.type}</span>
              {onFileRemoved && (
                <button
                  type="button"
                  className="btn btn-ghost btn-xs btn-square text-error"
                  onClick={() => onFileRemoved(f.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FileIcon({ type }: { type: FileType }) {
  const base = "size-8 rounded-lg flex items-center justify-center shrink-0";
  switch (type) {
    case FileType.IMAGE:
      return (
        <div className={`${base} bg-info/10 text-info`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
      );
    case FileType.PDF:
      return (
        <div className={`${base} bg-error/10 text-error`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
        </div>
      );
    case FileType.TEXTO:
      return (
        <div className={`${base} bg-success/10 text-success`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </div>
      );
    default:
      return (
        <div className={`${base} bg-base-200 text-base-content/40`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
        </div>
      );
  }
}
