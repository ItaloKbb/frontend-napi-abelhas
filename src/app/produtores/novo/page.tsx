"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Select } from "@/components/atoms";
import { produtoresService, type CreateProdutorPayload } from "@/services/produtores-service";
import { cidadesIbgeService } from "@/services/cidades-ibge-service";
import type { CidadeIBGE } from "@/types";
import { ROUTES } from "@/constants";

export default function NovoProdutorPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [cidadeId, setCidadeId] = useState("");

  const [cidades, setCidades] = useState<CidadeIBGE[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCidades, setLoadingCidades] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCidades() {
      try {
        const res = await cidadesIbgeService.list({ pageSize: 5000 });
        setCidades(res);
      } catch {
        setError("Erro ao carregar cidades.");
      } finally {
        setLoadingCidades(false);
      }
    }
    loadCidades();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload: CreateProdutorPayload = { nome };
    if (cidadeId) payload.cidadeId = cidadeId;

    try {
      await produtoresService.create(payload);
      router.push(ROUTES.PRODUTORES);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao criar produtor.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (loadingCidades) {
    return (
      <div className="flex flex-col items-center gap-2 py-16">
        <span className="loading loading-spinner loading-lg text-primary" />
        <span className="text-sm text-base-content/40">Carregando…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Novo Produtor</h1>

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
              placeholder="Nome do produtor"
            />

            <Select
              label="Cidade"
              options={[
                { value: "", label: "Nenhuma" },
                ...cidades.map((c) => ({ value: c.id, label: `${c.cidade} – ${c.estado}` })),
              ]}
              value={cidadeId}
              onChange={(e) => setCidadeId(e.target.value)}
            />

            <div className="flex gap-2 mt-4">
              <Button type="submit" loading={loading}>
                Criar produtor
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push(ROUTES.PRODUTORES)}
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
