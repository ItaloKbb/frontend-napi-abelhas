"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Select } from "@/components/atoms";
import { amostrasService, type CreateAmostraPayload } from "@/services/amostras-service";
import { pontosColetaService } from "@/services/pontos-coleta-service";
import { abelhasService } from "@/services/abelhas-service";
import { produtoresService } from "@/services/produtores-service";
import { tiposAmostraService } from "@/services/tipos-amostra-service";
import type { PontoColeta, Abelha, Produtor, TipoAmostra } from "@/types";
import { ROUTES } from "@/constants";

export default function NovaAmostraPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [dataColeta, setDataColeta] = useState("");
  const [pontoColetaId, setPontoColetaId] = useState("");
  const [abelhaId, setAbelhaId] = useState("");
  const [produtorId, setProdutorId] = useState("");
  const [tipoAmostraId, setTipoAmostraId] = useState("");

  const [pontosColeta, setPontosColeta] = useState<PontoColeta[]>([]);
  const [abelhas, setAbelhas] = useState<Abelha[]>([]);
  const [produtores, setProdutores] = useState<Produtor[]>([]);
  const [tiposAmostra, setTiposAmostra] = useState<TipoAmostra[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOptions() {
      try {
        const [pc, ab, pr, ta] = await Promise.all([
          pontosColetaService.list({ pageSize: 200 }),
          abelhasService.list({ pageSize: 200 }),
          produtoresService.list({ pageSize: 200 }),
          tiposAmostraService.list({ pageSize: 200 }),
        ]);
        setPontosColeta(pc);
        setAbelhas(ab);
        setProdutores(pr);
        setTiposAmostra(ta);
      } catch {
        setError("Erro ao carregar opções do formulário.");
      } finally {
        setLoadingOptions(false);
      }
    }
    loadOptions();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload: CreateAmostraPayload = {
      nome,
      dataColeta,
      pontoColetaId,
      abelhaId,
      produtorId,
      tipoAmostraId,
    };

    try {
      await amostrasService.create(payload);
      router.push(ROUTES.AMOSTRAS);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao criar amostra.";
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
      <h1 className="text-2xl font-bold tracking-tight">Nova Amostra</h1>

      <div className="card bg-base-100 shadow-sm max-w-xl">
        <div className="card-body">
          {error && (
            <div role="alert" className="alert alert-error shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
              <button className="btn btn-ghost btn-xs" onClick={() => setError(null)}>✕</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              placeholder="Nome da amostra"
            />

            <Input
              label="Data de Coleta"
              type="date"
              value={dataColeta}
              onChange={(e) => setDataColeta(e.target.value)}
              required
            />

            <Select
              label="Tipo de Amostra"
              placeholder="Selecione…"
              options={tiposAmostra.map((t) => ({ value: t.id, label: t.nome }))}
              value={tipoAmostraId}
              onChange={(e) => setTipoAmostraId(e.target.value)}
              required
            />

            <Select
              label="Abelha"
              placeholder="Selecione…"
              options={abelhas.map((a) => ({
                value: a.id,
                label: a.nomeCientifico + (a.nomePopular ? ` (${a.nomePopular})` : ""),
              }))}
              value={abelhaId}
              onChange={(e) => setAbelhaId(e.target.value)}
              required
            />

            <Select
              label="Produtor"
              placeholder="Selecione…"
              options={produtores.map((p) => ({ value: p.id, label: p.nome }))}
              value={produtorId}
              onChange={(e) => setProdutorId(e.target.value)}
              required
            />

            <Select
              label="Ponto de Coleta"
              placeholder="Selecione…"
              options={pontosColeta.map((pc) => ({
                value: pc.id,
                label: pc.nome + (pc.cidade ? ` – ${pc.cidade.cidade}/${pc.cidade.estado}` : ""),
              }))}
              value={pontoColetaId}
              onChange={(e) => setPontoColetaId(e.target.value)}
              required
            />

            <div className="flex gap-2 mt-4">
              <Button type="submit" loading={loading}>
                Criar amostra
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push(ROUTES.AMOSTRAS)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
