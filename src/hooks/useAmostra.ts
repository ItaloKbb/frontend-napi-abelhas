"use client";

import { useCallback, useEffect, useState } from "react";
import { amostrasService, type ListAmostrasParams } from "@/services/amostras-service";
import type { Amostra } from "@/types";

interface UseAmostraReturn {
  amostras: Amostra[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  fetchAmostras: (params?: ListAmostrasParams) => Promise<void>;
  setPage: (page: number) => void;
}

export function useAmostra(initialParams: ListAmostrasParams = {}): UseAmostraReturn {
  const [amostras, setAmostras] = useState<Amostra[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<ListAmostrasParams>({
    page: 1,
    pageSize: 10,
    ...initialParams,
  });

  const fetchAmostras = useCallback(
    async (overrideParams?: ListAmostrasParams) => {
      setLoading(true);
      setError(null);
      try {
        const merged = { ...params, ...overrideParams };
        const items = await amostrasService.list(merged);
        setAmostras(items);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Erro ao carregar amostras.";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [params]
  );

  useEffect(() => {
    fetchAmostras();
  }, [fetchAmostras]);

  const setPage = (page: number) =>
    setParams((prev) => ({ ...prev, page }));

  return {
    amostras,
    total: amostras.length,
    page: params.page ?? 1,
    totalPages: 0,
    loading,
    error,
    fetchAmostras,
    setPage,
  };
}
