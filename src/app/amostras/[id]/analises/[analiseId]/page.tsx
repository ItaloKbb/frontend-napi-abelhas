"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/atoms";
import { FileUpload } from "@/components/organisms/FileUpload";
import { analisesService } from "@/services/analises-service";
import { fileGroupsService } from "@/services/file-groups-service";
import { storageService } from "@/services/storage-service";
import { formatDate, formatDateTime } from "@/utils";
import { FileType, StatusAnalise } from "@/constants";
import type { Analise, AppFile, FileGroup } from "@/types";

const statusLabel: Record<StatusAnalise, string> = {
  [StatusAnalise.PENDENTE]: "Pendente",
  [StatusAnalise.EM_PREPARO]: "Em Preparo",
  [StatusAnalise.AGUARDANDO_RESULTADO]: "Aguardando Resultado",
  [StatusAnalise.EM_REVISAO]: "Em Revisão",
  [StatusAnalise.CONCLUIDA]: "Concluída",
  [StatusAnalise.REJEITADA]: "Rejeitada",
};

const statusVariant: Record<StatusAnalise, string> = {
  [StatusAnalise.PENDENTE]: "badge-warning",
  [StatusAnalise.EM_PREPARO]: "badge-info",
  [StatusAnalise.AGUARDANDO_RESULTADO]: "badge-secondary",
  [StatusAnalise.EM_REVISAO]: "badge-accent",
  [StatusAnalise.CONCLUIDA]: "badge-success",
  [StatusAnalise.REJEITADA]: "badge-error",
};

const statusOrder: StatusAnalise[] = [
  StatusAnalise.PENDENTE,
  StatusAnalise.EM_PREPARO,
  StatusAnalise.AGUARDANDO_RESULTADO,
  StatusAnalise.EM_REVISAO,
  StatusAnalise.CONCLUIDA,
];

export default function AnaliseDetailPage() {
  const params = useParams<{ id: string; analiseId: string }>();
  const router = useRouter();
  const { user } = useUser();

  const [analise, setAnalise] = useState<Analise | null>(null);
  const [fileGroups, setFileGroups] = useState<FileGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, groups] = await Promise.all([
        analisesService.getById(params.analiseId),
        fileGroupsService.list({ analiseId: params.analiseId }),
      ]);
      setAnalise(data);
      setFileGroups(groups);
    } catch {
      setError("Erro ao carregar análise.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.analiseId]);

  const allFiles: (AppFile & { groupId: string })[] =
    fileGroups.flatMap((fg) =>
      (fg.files ?? []).map((f) => ({ ...f, groupId: fg.id }))
    );

  const handleFileUploaded = async (file: { url: string; type: FileType }) => {
    if (!analise) return;
    try {
      let groupId = fileGroups[0]?.id;
      if (!groupId) {
        const group = await fileGroupsService.create({ analiseId: analise.id });
        groupId = group.id;
      }
      await fileGroupsService.addFile(groupId, {
        url: file.url,
        type: file.type,
        uploadedByUserId: user?.id,
        uploadedByName: user?.fullName ?? user?.primaryEmailAddress?.emailAddress,
      });
      await load();
    } catch {
      setError("Erro ao vincular arquivo.");
    }
  };

  const handleStatusChange = async (status: StatusAnalise) => {
    if (!analise) return;
    setUpdatingStatus(true);
    try {
      await analisesService.update(analise.id, { status });
      setAnalise({ ...analise, status });
    } catch {
      setError("Erro ao atualizar status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleRemoveFile = async (fileId: string) => {
    const file = allFiles.find((f) => f.id === fileId);
    if (!file) return;
    try {
      await fileGroupsService.removeFile(file.groupId, fileId);
      await load();
    } catch {
      setError("Erro ao remover arquivo.");
    }
  };

  const handleDownload = async (key: string) => {
    try {
      const { url } = await storageService.getDownloadUrl(key);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      setError("Erro ao obter link de download.");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await analisesService.remove(params.analiseId);
      router.push(`/amostras/${params.id}`);
    } catch {
      setError("Erro ao excluir análise.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-2 py-16">
        <span className="loading loading-spinner loading-lg text-primary" />
        <span className="text-sm text-base-content/40">Carregando…</span>
      </div>
    );
  }

  if (error && !analise) {
    return (
      <div role="alert" className="alert alert-error shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{error}</span>
        <button className="btn btn-ghost btn-xs" onClick={() => router.push(`/amostras/${params.id}`)}>Voltar</button>
      </div>
    );
  }

  if (!analise) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          className="btn btn-ghost btn-sm btn-square"
          onClick={() => router.push(`/amostras/${params.id}`)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {analise.tipoAnalise?.nome ?? "Análise"}
            </h1>
            <span className={`badge ${statusVariant[analise.status]} badge-sm`}>
              {statusLabel[analise.status]}
            </span>
          </div>
          <p className="text-sm text-base-content/60">
            Amostra: {analise.amostra?.nome ?? params.id}
            {analise.createdAt ? ` • Criada em ${formatDateTime(analise.createdAt)}` : ""}
          </p>
        </div>
        <button
          className="btn btn-error btn-sm btn-outline"
          onClick={() => setConfirmDelete(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          Excluir
        </button>
      </div>

      {error && (
        <div role="alert" className="alert alert-error shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
          <button className="btn btn-ghost btn-xs" onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analysis Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body p-4">
                <p className="text-xs text-base-content/50 uppercase tracking-wider">Tipo de Análise</p>
                <p className="font-semibold text-lg">{analise.tipoAnalise?.nome ?? "—"}</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body p-4">
                <p className="text-xs text-base-content/50 uppercase tracking-wider">Responsável</p>
                <p className="font-semibold text-lg">{analise.responsavel?.nome ?? "—"}</p>
                {analise.responsavel?.cidade && (
                  <p className="text-xs text-base-content/50">
                    {analise.responsavel.cidade.cidade} – {analise.responsavel.cidade.estado}
                  </p>
                )}
              </div>
            </div>
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body p-4">
                <p className="text-xs text-base-content/50 uppercase tracking-wider">Status da Análise</p>
                <select
                  className="select select-bordered select-sm w-full mt-1"
                  value={analise.status}
                  onChange={(e) => handleStatusChange(e.target.value as StatusAnalise)}
                  disabled={updatingStatus}
                >
                  {Object.values(StatusAnalise).map((s) => (
                    <option key={s} value={s}>{statusLabel[s]}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body p-4">
                <p className="text-xs text-base-content/50 uppercase tracking-wider">Documentos</p>
                <p className="font-semibold">{allFiles.length} arquivo(s)</p>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-lg">Documentos e Laudos</h2>
                  <p className="text-sm text-base-content/50">
                    Arquivos anexados a esta análise laboratorial
                  </p>
                </div>
              </div>

              {allFiles.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-10">
                  <div className="size-14 rounded-full bg-base-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-7 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                  </div>
                  <p className="font-medium text-base-content/50">Nenhum documento anexado</p>
                  <p className="text-sm text-base-content/30">Envie laudos, relatórios ou fotos abaixo.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {allFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 rounded-lg bg-base-200/40 px-4 py-3 hover:bg-base-200/60 transition-colors"
                    >
                      <FileTypeIcon type={file.type} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.url.split("/").pop()}</p>
                        <p className="text-xs text-base-content/40">
                          {file.type}
                          {file.createdAt ? ` • ${formatDate(file.createdAt)}` : ""}
                          {file.uploadedByName ? ` • Enviado por ${file.uploadedByName}` : ""}
                        </p>
                      </div>
                      <button
                        className="btn btn-ghost btn-xs btn-square"
                        data-tip="Download"
                        onClick={() => handleDownload(file.url)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </button>
                      <button
                        className="btn btn-ghost btn-xs btn-square text-error"
                        data-tip="Remover"
                        onClick={() => handleRemoveFile(file.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="divider text-xs text-base-content/30">Enviar novos arquivos</div>

              <FileUpload
                folder="analises"
                onFileUploaded={handleFileUploaded}
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx,.csv,.txt"
                maxSizeMB={25}
              />
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Quick info */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body p-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-base-content/50 mb-3">
                Amostra Vinculada
              </h3>
              {analise.amostra ? (
                <div className="space-y-2">
                  <p className="font-semibold">{analise.amostra.nome}</p>
                  <p className="text-sm text-base-content/60">
                    {analise.amostra.tipoAmostra?.nome ?? ""}
                    {analise.amostra.dataColeta ? ` • ${formatDate(analise.amostra.dataColeta)}` : ""}
                  </p>
                  <Link
                    href={`/amostras/${params.id}`}
                    className="btn btn-ghost btn-xs mt-1"
                  >
                    Ver amostra →
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-base-content/50">Dados não disponíveis</p>
              )}
            </div>
          </div>

          {/* Status Progress */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body p-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-base-content/50 mb-3">
                Progresso
              </h3>
              {analise.status === StatusAnalise.REJEITADA ? (
                <div className="flex items-center gap-2 text-error">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="font-medium text-sm">Análise Rejeitada</span>
                </div>
              ) : (
                <ul className="steps steps-vertical text-xs">
                  {statusOrder.map((step) => {
                    const currentIdx = statusOrder.indexOf(analise.status);
                    const stepIdx = statusOrder.indexOf(step);
                    const isDone = stepIdx <= currentIdx;
                    return (
                      <li key={step} className={`step ${isDone ? "step-primary" : ""}`}>
                        <div className="text-left">
                          <p className={`font-medium ${!isDone ? "text-base-content/40" : ""}`}>
                            {statusLabel[step]}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body p-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-base-content/50 mb-3">
                Histórico
              </h3>
              <ul className="steps steps-vertical text-xs">
                <li className="step step-primary">
                  <div className="text-left">
                    <p className="font-medium">Análise criada</p>
                    <p className="text-base-content/40">
                      {analise.createdAt ? formatDateTime(analise.createdAt) : "—"}
                    </p>
                  </div>
                </li>
                {allFiles.length > 0 && (
                  <li className="step step-primary">
                    <div className="text-left">
                      <p className="font-medium">{allFiles.length} documento(s) anexado(s)</p>
                      <p className="text-base-content/40">
                        Último em{" "}
                        {allFiles[allFiles.length - 1].createdAt
                          ? formatDate(allFiles[allFiles.length - 1].createdAt)
                          : "—"}
                      </p>
                    </div>
                  </li>
                )}
                {analise.status === StatusAnalise.CONCLUIDA ? (
                  <li className="step step-success">
                    <div className="text-left">
                      <p className="font-medium text-success">Concluída</p>
                    </div>
                  </li>
                ) : analise.status === StatusAnalise.REJEITADA ? (
                  <li className="step step-error">
                    <div className="text-left">
                      <p className="font-medium text-error">Rejeitada</p>
                    </div>
                  </li>
                ) : (
                  <li className="step">
                    <div className="text-left">
                      <p className="font-medium text-base-content/40">Laudo final</p>
                      <p className="text-base-content/30">Pendente</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <dialog className="modal modal-open" onClose={() => setConfirmDelete(false)}>
          <div className="modal-box max-w-sm">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
              onClick={() => setConfirmDelete(false)}
            >
              ✕
            </button>
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="size-16 rounded-full bg-error/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z" /></svg>
              </div>
              <h3 className="font-bold text-lg">Excluir análise?</h3>
              <p className="text-sm text-base-content/60 text-center">
                Esta ação é irreversível. Todos os documentos vinculados também serão removidos.
              </p>
            </div>
            <div className="modal-action">
              <Button variant="ghost" onClick={() => setConfirmDelete(false)} disabled={deleting}>
                Cancelar
              </Button>
              <Button variant="error" onClick={handleDelete} loading={deleting}>
                Excluir
              </Button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setConfirmDelete(false)}>Fechar</button>
          </form>
        </dialog>
      )}
    </div>
  );
}

function FileTypeIcon({ type }: { type: FileType }) {
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
    default:
      return (
        <div className={`${base} bg-base-200 text-base-content/40`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
        </div>
      );
  }
}
