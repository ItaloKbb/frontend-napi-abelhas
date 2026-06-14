"use client";

import { useCallback, useEffect, useState } from "react";
import {
  produtoresService,
  type ListProdutoresParams,
} from "@/services/produtores-service";
import type { Produtor } from "@/types";

interface UseProdutorReturn {
  produtores: Produtor[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  fetchProdutores: (params?: ListProdutoresParams) => Promise<void>;
  setPage: (page: number) => void;
}

export function useProdutor(
  initialParams: ListProdutoresParams = {}
): UseProdutorReturn {
  const [produtores, setProdutores] = useState<Produtor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<ListProdutoresParams>({
    page: 1,
    pageSize: 10,
    ...initialParams,
  });

  const fetchProdutores = useCallback(
    async (overrideParams?: ListProdutoresParams) => {
      setLoading(true);
      setError(null);
      try {
        const merged = { ...params, ...overrideParams };
        const items = await produtoresService.list(merged);
        setProdutores(items);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Erro ao carregar produtores.";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [params]
  );

  useEffect(() => {
    fetchProdutores();
  }, [fetchProdutores]);

  const setPage = (page: number) =>
    setParams((prev) => ({ ...prev, page }));

  return {
    produtores,
    total: produtores.length,
    page: params.page ?? 1,
    totalPages: 0,
    loading,
    error,
    fetchProdutores,
    setPage,
  };
}
