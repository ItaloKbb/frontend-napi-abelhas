"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Select } from "@/components/atoms";
import { FileUpload } from "@/components/organisms/FileUpload";
import { analisesService, type CreateAnalisePayload } from "@/services/analises-service";
import { fileGroupsService } from "@/services/file-groups-service";
import { tiposAnaliseService } from "@/services/tipos-analise-service";
import { responsaveisService } from "@/services/responsaveis-service";
import { amostrasService } from "@/services/amostras-service";
import type { TipoAnalise, Responsavel, Amostra } from "@/types";
import { FileType } from "@/constants";

interface PendingFile {
  url: string;
  type: FileType;
}

export default function NovaAnalisePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [amostra, setAmostra] = useState<Amostra | null>(null);
  const [tiposAnalise, setTiposAnalise] = useState<TipoAnalise[]>([]);
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);

  const [tipoAnaliseId, setTipoAnaliseId] = useState("");
  const [responsavelId, setResponsavelId] = useState("");
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOptions() {
      try {
        const [am, ta, resp] = await Promise.all([
          amostrasService.getById(params.id),
          tiposAnaliseService.list({ pageSize: 200 }),
          responsaveisService.list({ pageSize: 200 }),
        ]);
        setAmostra(am);
        setTiposAnalise(ta);
        setResponsaveis(resp);
      } catch {
        setError("Erro ao carregar opções do formulário.");
      } finally {
        setLoadingOptions(false);
      }
    }
    loadOptions();
  }, [params.id]);

  const handleFileUploaded = (file: { url: string; type: FileType }) => {
    setPendingFiles((prev) => [...prev, file]);
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: CreateAnalisePayload = {
        amostraId: params.id,
        tipoAnaliseId,
        responsavelId,
      };

      const analise = await analisesService.create(payload);

      // Attach files via file group if any files were uploaded
      if (pendingFiles.length > 0) {
        const group = await fileGroupsService.create({ analiseId: analise.id });
        await Promise.all(
          pendingFiles.map((f) =>
            fileGroupsService.addFile(group.id, { url: f.url, type: f.type })
          )
        );
      }

      router.push(`/amostras/${params.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao criar análise.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (loadingOptions) {
    return (
      <div className="flex flex-col items-center gap-2 py-16">
        <span className="loading loading-spinner loading-lg text-primary" />
        <span className="text-sm text-base-content/40">Carregando…</span>
      </div>
    );
  }

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
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nova Análise Laboratorial</h1>
          {amostra && (
            <p className="text-sm text-base-content/60">
              Amostra: <span className="font-medium text-base-content">{amostra.nome}</span>
              {" "}• {amostra.tipoAmostra?.nome ?? ""}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="font-bold text-lg mb-1">Dados da Análise</h2>
              <p className="text-sm text-base-content/50 mb-5">
                Selecione o tipo de análise e o responsável pelo laudo.
              </p>

              {error && (
                <div role="alert" className="alert alert-error shadow-sm mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{error}</span>
                  <button className="btn btn-ghost btn-xs" onClick={() => setError(null)}>✕</button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Select
                  label="Tipo de Análise"
                  placeholder="Selecione o tipo…"
                  options={tiposAnalise.map((t) => ({ value: t.id, label: t.nome }))}
                  value={tipoAnaliseId}
                  onChange={(e) => setTipoAnaliseId(e.target.value)}
                  required
                />

                <Select
                  label="Responsável"
                  placeholder="Selecione o responsável…"
                  options={responsaveis.map((r) => ({
                    value: r.id,
                    label: r.nome + (r.cidade ? ` – ${r.cidade.cidade}/${r.cidade.estado}` : ""),
                  }))}
                  value={responsavelId}
                  onChange={(e) => setResponsavelId(e.target.value)}
                  required
                />

                <div className="flex gap-2 mt-4">
                  <Button type="submit" loading={loading}>
                    Criar análise
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.push(`/amostras/${params.id}`)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* File Upload Sidebar */}
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="font-bold text-lg mb-1">Documentos</h2>
              <p className="text-sm text-base-content/50 mb-4">
                Laudos, relatórios, fotos e outros arquivos da análise.
              </p>
              <FileUpload
                folder="analises"
                onFileUploaded={handleFileUploaded}
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx,.csv,.txt"
                maxSizeMB={25}
              />
              {pendingFiles.length > 0 && (
                <p className="text-xs text-base-content/50 mt-3 tabular-nums">
                  {pendingFiles.length} arquivo(s) pronto(s) para vincular
                </p>
              )}
            </div>
          </div>

          {/* Info tips */}
          <div className="card bg-base-200/50 shadow-sm">
            <div className="card-body p-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Dicas
              </h3>
              <ul className="text-xs text-base-content/50 mt-2 space-y-1 list-disc list-inside">
                <li>Envie laudos em PDF para melhor compatibilidade</li>
                <li>Fotos ajudam na documentação visual</li>
                <li>Você pode adicionar mais documentos depois</li>
                <li>Tamanho máximo: 25 MB por arquivo</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
