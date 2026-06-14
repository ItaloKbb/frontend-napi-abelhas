"use client";

import { useState } from "react";
import { useProdutor } from "@/hooks/useProdutor";
import { SearchBar } from "@/components/molecules";
import { formatDate } from "@/utils";

export default function ProdutoresPage() {
  const [search, setSearch] = useState("");
  const {
    produtores,
    loading,
    error,
    page,
    totalPages,
    setPage,
    fetchProdutores,
  } = useProdutor();

  const handleSearch = (value: string) => {
    setSearch(value);
    fetchProdutores({ search: value, page: 1 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Produtores</h1>
        <a href="/produtores/novo" className="btn btn-primary btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Novo Produtor
        </a>
      </div>

      <div className="card bg-base-200/50 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Buscar produtores…"
              value={search}
              onSearch={handleSearch}
            />
          </div>
          <span className="text-sm text-base-content/50 tabular-nums whitespace-nowrap">
            {produtores.length} resultado(s)
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
      ) : produtores.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <div className="size-16 rounded-full bg-base-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-8 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128H5.228A2 2 0 013 17.208V17.13a4.002 4.002 0 014.125-3.89A9.344 9.344 0 0112 12c1.696 0 3.294.45 4.672 1.24" /></svg>
          </div>
          <p className="font-medium text-base-content/50">Nenhum produtor encontrado</p>
          <p className="text-sm text-base-content/30">Tente ajustar os filtros ou cadastre um novo produtor.</p>
        </div>
      ) : (
        <>
          <div className="card bg-base-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="bg-base-200/60">
                    <th className="text-xs uppercase tracking-wider font-semibold text-base-content/70">Nome</th>
                    <th className="text-xs uppercase tracking-wider font-semibold text-base-content/70">Cidade</th>
                  </tr>
                </thead>
                <tbody>
                  {produtores.map((p) => (
                    <tr key={p.id} className="hover:bg-base-200/30 transition-colors">
                      <td className="font-medium">{p.nome}</td>
                      <td>
                        {p.cidade
                          ? `${p.cidade.cidade} – ${p.cidade.estado}`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-base-200 px-4 py-3">
                <span className="text-sm text-base-content/50">
                  Página {page} de {totalPages}
                </span>
                <div className="join">
                  <button
                    className="join-item btn btn-sm"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                  >
                    ‹ Anterior
                  </button>
                  <button
                    className="join-item btn btn-sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Próxima ›
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
