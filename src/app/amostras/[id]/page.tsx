"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/atoms";
import { amostrasService } from "@/services/amostras-service";
import { analisesService } from "@/services/analises-service";
import { formatDate, formatDateTime } from "@/utils";
import { StatusAmostra, StatusAnalise } from "@/constants";
import type { Amostra, Analise } from "@/types";

const statusVariant: Record<StatusAmostra, "info" | "warning" | "success" | "error"> = {
  [StatusAmostra.PENDENTE]: "warning",
  [StatusAmostra.EM_ANALISE]: "info",
  [StatusAmostra.CONCLUIDA]: "success",
  [StatusAmostra.REJEITADA]: "error",
};

const statusLabel: Record<StatusAmostra, string> = {
  [StatusAmostra.PENDENTE]: "Pendente",
  [StatusAmostra.EM_ANALISE]: "Em Análise",
  [StatusAmostra.CONCLUIDA]: "Concluída",
  [StatusAmostra.REJEITADA]: "Rejeitada",
};

const analiseStatusLabel: Record<StatusAnalise, string> = {
  [StatusAnalise.PENDENTE]: "Pendente",
  [StatusAnalise.EM_PREPARO]: "Em Preparo",
  [StatusAnalise.AGUARDANDO_RESULTADO]: "Aguardando",
  [StatusAnalise.EM_REVISAO]: "Em Revisão",
  [StatusAnalise.CONCLUIDA]: "Concluída",
  [StatusAnalise.REJEITADA]: "Rejeitada",
};

const analiseStatusBadge: Record<StatusAnalise, string> = {
  [StatusAnalise.PENDENTE]: "badge-warning",
  [StatusAnalise.EM_PREPARO]: "badge-info",
  [StatusAnalise.AGUARDANDO_RESULTADO]: "badge-secondary",
  [StatusAnalise.EM_REVISAO]: "badge-accent",
  [StatusAnalise.CONCLUIDA]: "badge-success",
  [StatusAnalise.REJEITADA]: "badge-error",
};

export default function AmostraDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [amostra, setAmostra] = useState<Amostra | null>(null);
  const [analises, setAnalises] = useState<Analise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [am, an] = await Promise.all([
          amostrasService.getById(params.id),
          analisesService.list({ amostraId: params.id, pageSize: 100 }),
        ]);
        setAmostra(am);
        setAnalises(an);
      } catch {
        setError("Erro ao carregar dados da amostra.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-2 py-16">
        <span className="loading loading-spinner loading-lg text-primary" />
        <span className="text-sm text-base-content/40">Carregando…</span>
      </div>
    );
  }

  if (error || !amostra) {
    return (
      <div role="alert" className="alert alert-error shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{error ?? "Amostra não encontrada."}</span>
        <button className="btn btn-ghost btn-xs" onClick={() => router.push("/amostras")}>Voltar</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button className="btn btn-ghost btn-sm btn-square" onClick={() => router.push("/amostras")}>
          <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{amostra.nome}</h1>
          <p className="text-sm text-base-content/60">
            {amostra.dataColeta ? `Coletada em ${formatDate(amostra.dataColeta)}` : ""}
            {amostra.createdAt ? ` • Criada em ${formatDateTime(amostra.createdAt)}` : ""}
          </p>
        </div>
        <Badge label={statusLabel[amostra.status]} variant={statusVariant[amostra.status]} />
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body p-4">
            <p className="text-xs text-base-content/50 uppercase tracking-wider">Tipo de Amostra</p>
            <p className="font-semibold">{amostra.tipoAmostra?.nome ?? "—"}</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body p-4">
            <p className="text-xs text-base-content/50 uppercase tracking-wider">Abelha</p>
            <p className="font-semibold">{amostra.abelha?.nomeCientifico ?? "—"}</p>
            {amostra.abelha?.nomePopular && (
              <p className="text-xs text-base-content/50">{amostra.abelha.nomePopular}</p>
            )}
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body p-4">
            <p className="text-xs text-base-content/50 uppercase tracking-wider">Produtor</p>
            <p className="font-semibold">{amostra.produtor?.nome ?? "—"}</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body p-4">
            <p className="text-xs text-base-content/50 uppercase tracking-wider">Ponto de Coleta</p>
            <p className="font-semibold">{amostra.pontoColeta?.nome ?? "—"}</p>
            {amostra.pontoColeta?.cidade && (
              <p className="text-xs text-base-content/50">
                {amostra.pontoColeta.cidade.cidade} – {amostra.pontoColeta.cidade.estado}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Analyses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Análises Laboratoriais</h2>
            <p className="text-sm text-base-content/60">
              {analises.length} análise(s) registrada(s) para esta amostra
            </p>
          </div>
          <Link
            href={`/amostras/${amostra.id}/analises/nova`}
            className="btn btn-primary btn-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Nova Análise
          </Link>
        </div>

        {analises.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <div className="size-16 rounded-full bg-base-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-8 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a3.37 3.37 0 01-.888.56l-3.142 1.396-3.142-1.396a3.37 3.37 0 01-.888-.56L6 14.5m13 0V19a2.25 2.25 0 01-2.25 2.25H7.25A2.25 2.25 0 015 19v-4.5" /></svg>
            </div>
            <p className="font-medium text-base-content/50">Nenhuma análise registrada</p>
            <p className="text-sm text-base-content/30">Crie a primeira análise laboratorial para esta amostra.</p>
            <Link href={`/amostras/${amostra.id}/analises/nova`} className="btn btn-ghost btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Criar análise
            </Link>
          </div>
        ) : (
          <div className="card bg-base-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="bg-base-200/60">
                    <th className="text-xs uppercase tracking-wider font-semibold text-base-content/70">Tipo de Análise</th>
                    <th className="text-xs uppercase tracking-wider font-semibold text-base-content/70">Responsável</th>
                    <th className="text-xs uppercase tracking-wider font-semibold text-base-content/70">Status</th>
                    <th className="text-xs uppercase tracking-wider font-semibold text-base-content/70">Documentos</th>
                    <th className="text-xs uppercase tracking-wider font-semibold text-base-content/70">Data</th>
                    <th className="text-xs uppercase tracking-wider font-semibold text-base-content/70 w-24">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {analises.map((analise) => {
                    const fileCount = analise.fileGroups?.reduce(
                      (acc, fg) => acc + (fg.files?.length ?? 0), 0
                    ) ?? 0;
                    return (
                      <tr key={analise.id} className="hover:bg-base-200/30 transition-colors">
                        <td className="font-medium">
                          {analise.tipoAnalise?.nome ?? analise.tipoAnaliseId}
                        </td>
                        <td>{analise.responsavel?.nome ?? analise.responsavelId}</td>
                        <td>
                          {analise.status ? (
                            <span className={`badge badge-sm ${analiseStatusBadge[analise.status]}`}>
                              {analiseStatusLabel[analise.status]}
                            </span>
                          ) : (
                            <span className="text-base-content/40 text-sm">—</span>
                          )}
                        </td>
                        <td>
                          {fileCount > 0 ? (
                            <span className="badge badge-sm badge-info gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                              {fileCount} arquivo(s)
                            </span>
                          ) : (
                            <span className="text-base-content/40 text-sm">—</span>
                          )}
                        </td>
                        <td className="text-sm">
                          {analise.createdAt ? formatDate(analise.createdAt) : "—"}
                        </td>
                        <td>
                          <Link
                            href={`/amostras/${amostra.id}/analises/${analise.id}`}
                            className="btn btn-ghost btn-xs btn-square"
                            data-tip="Ver detalhes"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
