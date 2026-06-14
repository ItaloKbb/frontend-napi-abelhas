"use client";

import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/atoms";
import { cidadesIbgeService } from "@/services/cidades-ibge-service";
import type { CidadeIBGE } from "@/types";

export default function CidadesIbgePage() {
  const [cidades, setCidades] = useState<CidadeIBGE[]>([]);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estado, setEstado] = useState("");
  const [filteredCidades, setFilteredCidades] = useState<CidadeIBGE[]>([]);
  const [search, setSearch] = useState("");

  const fetchCidades = useCallback(async (estadoFilter?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await cidadesIbgeService.list({
        pageSize: 10000,
        ...(estadoFilter ? { estado: estadoFilter } : {}),
      });
      setCidades(res);
      setFilteredCidades(res);
    } catch {
      setError("Erro ao carregar cidades.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCidades();
  }, [fetchCidades]);

  useEffect(() => {
    let result = cidades;
    if (estado) {
      result = result.filter((c) => c.estado === estado);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.cidade.toLowerCase().includes(q));
    }
    setFilteredCidades(result);
  }, [cidades, estado, search]);

  const handleSeed = async () => {
    setSeeding(true);
    setError(null);
    try {
      await cidadesIbgeService.seed();
      await fetchCidades();
    } catch {
      setError("Erro ao cadastrar cidades padrão.");
    } finally {
      setSeeding(false);
    }
  };

  const estados = [...new Set(cidades.map((c) => c.estado))].sort();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cidades IBGE</h1>
        <p className="text-sm text-base-content/60 mt-1">
          Dados de referência do IBGE (somente leitura).
        </p>
      </div>

      <div className="card bg-base-200/50 p-4">
        <div className="flex gap-4 flex-wrap items-end">
          <div className="w-64">
            <Input
              type="search"
              placeholder="Buscar cidade…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Estado</legend>
            <select
              className="select"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="">Todos</option>
              {estados.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </fieldset>
          <span className="text-sm text-base-content/50 tabular-nums pb-2">
            {filteredCidades.length} cidade(s)
          </span>
        </div>
      </div>

      {error && (
        <div role="alert" className="alert alert-error shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center gap-2 py-16">
          <span className="loading loading-spinner loading-lg text-primary" />
          <span className="text-sm text-base-content/40">Carregando…</span>
        </div>
      ) : cidades.length === 0 && !error ? (
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="size-16 rounded-full bg-base-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-8 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" /></svg>
          </div>
          <p className="font-medium text-base-content/50">
            Nenhuma cidade cadastrada
          </p>
          <p className="text-sm text-base-content/30">Deseja gerar as capitais padrão do IBGE?</p>
          <button
            className="btn btn-primary"
            onClick={handleSeed}
            disabled={seeding}
          >
            {seeding && <span className="loading loading-spinner loading-sm" />}
            Cadastrar cidades padrão
          </button>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto max-h-[60vh]">
            <table className="table table-pin-rows w-full">
              <thead>
                <tr className="bg-base-200/60">
                  <th className="text-xs uppercase tracking-wider font-semibold text-base-content/70">Cidade</th>
                  <th className="text-xs uppercase tracking-wider font-semibold text-base-content/70">Estado</th>
                  <th className="text-xs uppercase tracking-wider font-semibold text-base-content/70">Região</th>
                  <th className="text-xs uppercase tracking-wider font-semibold text-base-content/70">Bioma</th>
                </tr>
              </thead>
              <tbody>
                {filteredCidades.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8">
                      <p className="font-medium text-base-content/50">Nenhuma cidade encontrada</p>
                      <p className="text-sm text-base-content/30">Tente ajustar os filtros.</p>
                    </td>
                  </tr>
                ) : (
                  filteredCidades.slice(0, 200).map((c) => (
                    <tr key={c.id} className="hover:bg-base-200/30 transition-colors">
                      <td>{c.cidade}</td>
                      <td>{c.estado}</td>
                      <td>{c.regiao}</td>
                      <td>{c.bioma ?? "—"}</td>
                    </tr>
                  ))
                )}
                {filteredCidades.length > 200 && (
                  <tr>
                    <td colSpan={4} className="text-center text-sm text-base-content/50">
                      Mostrando 200 de {filteredCidades.length} — refine a busca para ver mais.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
