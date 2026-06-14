"use client";

import { useAmostra } from "@/hooks/useAmostra";
import { AmostraTable } from "@/components/organisms";
import { SearchBar } from "@/components/molecules";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AmostraPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { amostras, loading, error, page, totalPages, setPage, fetchAmostras } =
    useAmostra();

  const handleSearch = (value: string) => {
    setSearch(value);
    fetchAmostras({ search: value, page: 1 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Amostras</h1>
        <a href="/amostras/nova" className="btn btn-primary btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nova Amostra
        </a>
      </div>

      <div className="card bg-base-200/50 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Buscar amostras…"
              value={search}
              onSearch={handleSearch}
            />
          </div>
          <span className="text-sm text-base-content/50 tabular-nums whitespace-nowrap">
            {amostras.length} resultado(s)
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
      ) : (
        <>
          <AmostraTable amostras={amostras} onSelect={(a) => router.push(`/amostras/${a.id}`)} />

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
        </>
      )}
    </div>
  );
}
