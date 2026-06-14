"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Input, Select } from "@/components/atoms";
import type { PaginatedResponse } from "@/types";

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  key: string;
  label: string;
  type?: "text" | "number" | "checkbox" | "select";
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  loadOptions?: () => Promise<SelectOption[]>;
}

export interface CrudService<T> {
  list(params: { page?: number; pageSize?: number; search?: string }): Promise<PaginatedResponse<T> | T[]>;
  create(payload: Record<string, unknown>): Promise<T>;
  update(id: string, payload: Record<string, unknown>): Promise<T>;
  remove(id: string): Promise<void>;
}

interface AdminCrudTableProps<T extends { id: string }> {
  title: string;
  columns: Column<T>[];
  fields: FieldConfig[];
  service: CrudService<T>;
  description?: string;
}

export function AdminCrudTable<T extends { id: string }>({
  title,
  columns,
  fields,
  service,
  description,
}: AdminCrudTableProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectOptions, setSelectOptions] = useState<Record<string, SelectOption[]>>({});

  const fetchItems = useCallback(
    async (p = page, s = search) => {
      setLoading(true);
      setError(null);
      try {
        const res = await service.list({ page: p, pageSize: 10, search: s });
        if (Array.isArray(res)) {
          setItems(res);
          setTotalPages(0);
        } else {
          setItems(res?.data ?? []);
          setTotalPages(res?.totalPages ?? 0);
        }
      } catch {
        setError("Erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    },
    [service, page, search],
  );

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    fetchItems(1, value);
  };

  useEffect(() => {
    for (const f of fields) {
      if (f.type === "select" && f.loadOptions && !selectOptions[f.key]) {
        f.loadOptions().then((opts) =>
          setSelectOptions((prev) => ({ ...prev, [f.key]: opts })),
        );
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditing(null);
    const initial: Record<string, unknown> = {};
    for (const f of fields) {
      initial[f.key] = f.type === "checkbox" ? false : "";
    }
    setFormData(initial);
    setModalOpen(true);
  };

  const openEdit = (item: T) => {
    setEditing(item);
    const data: Record<string, unknown> = {};
    for (const f of fields) {
      data[f.key] = (item as Record<string, unknown>)[f.key] ?? (f.type === "checkbox" ? false : "");
    }
    setFormData(data);
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {};
      for (const f of fields) {
        const val = formData[f.key];
        if (f.type === "number" && val !== "" && val != null) {
          payload[f.key] = Number(val);
        } else {
          payload[f.key] = val;
        }
      }
      if (editing) {
        await service.update(editing.id, payload);
      } else {
        await service.create(payload);
      }
      setModalOpen(false);
      fetchItems();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message;
      setError(msg ?? (editing ? "Erro ao atualizar." : "Erro ao criar."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      await service.remove(deleteTarget.id);
      setDeleteTarget(null);
      fetchItems();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message;
      setError(msg ?? "Erro ao excluir.");
    } finally {
      setDeleting(false);
    }
  };

  const setField = (key: string, value: unknown) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-base-content/60 mt-1">{description}</p>
          )}
        </div>
        <Button size="sm" onClick={openCreate} className="gap-1 self-start sm:self-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Novo registro
        </Button>
      </div>

      {/* Search & Count Bar */}
      <div className="card bg-base-200/50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Buscar…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          {!loading && (
            <span className="text-sm text-base-content/50 tabular-nums whitespace-nowrap">
              {items.length} {items.length === 1 ? "registro" : "registros"}
              {search && " encontrado" + (items.length !== 1 ? "s" : "")}
            </span>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div role="alert" className="alert alert-error shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
          <button className="btn btn-ghost btn-xs" onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Table Card */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <span className="loading loading-spinner loading-lg text-primary" />
          <span className="text-sm text-base-content/40">Carregando…</span>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200/60">
                  {columns.map((col) => (
                    <th key={col.key} className="text-xs uppercase tracking-wider font-semibold text-base-content/70">
                      {col.label}
                    </th>
                  ))}
                  <th className="w-24 text-xs uppercase tracking-wider font-semibold text-base-content/70">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="text-center py-16"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="size-16 rounded-full bg-base-200 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="size-8 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-base-content/50">Nenhum registro encontrado</p>
                          <p className="text-sm text-base-content/30 mt-1">
                            {search ? "Tente uma busca diferente." : "Comece criando um novo registro."}
                          </p>
                        </div>
                        {!search && (
                          <Button size="sm" variant="ghost" onClick={openCreate} className="mt-1">
                            + Criar primeiro registro
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-base-200/30 transition-colors">
                      {columns.map((col) => (
                        <td key={col.key}>
                          {col.render
                            ? col.render(item)
                            : String((item as Record<string, unknown>)[col.key] ?? "")}
                        </td>
                      ))}
                      <td>
                        <div className="flex gap-1">
                          <button
                            className="btn btn-ghost btn-xs btn-square tooltip tooltip-left"
                            data-tip="Editar"
                            onClick={() => openEdit(item)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            className="btn btn-ghost btn-xs btn-square text-error tooltip tooltip-left"
                            data-tip="Excluir"
                            onClick={() => setDeleteTarget(item)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-base-200 px-4 py-3">
              <span className="text-xs text-base-content/50">
                Página {page} de {totalPages}
              </span>
              <div className="join">
                <button
                  className="join-item btn btn-sm btn-ghost"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  ‹ Anterior
                </button>
                <button
                  className="join-item btn btn-sm btn-ghost"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Próxima ›
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-lg">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg">
              {editing ? "Editar" : "Novo"} registro
            </h3>
            <p className="text-sm text-base-content/50 mt-1 mb-5">
              {editing
                ? "Altere os campos abaixo e salve."
                : "Preencha os campos abaixo para criar um novo registro."}
            </p>
            <div className="space-y-4">
              {fields.map((f) => {
                if (f.type === "checkbox") {
                  return (
                    <label key={f.key} className="flex items-center gap-3 cursor-pointer py-1">
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={!!formData[f.key]}
                        onChange={(e) => setField(f.key, e.target.checked)}
                      />
                      <span className="label-text">{f.label}</span>
                    </label>
                  );
                }
                if (f.type === "select") {
                  const opts = f.options ?? selectOptions[f.key] ?? [];
                  return (
                    <Select
                      key={f.key}
                      label={f.label}
                      options={opts}
                      placeholder={f.placeholder ?? "Selecione..."}
                      value={String(formData[f.key] ?? "")}
                      required={f.required}
                      onChange={(e) => setField(f.key, e.target.value)}
                    />
                  );
                }
                return (
                  <Input
                    key={f.key}
                    label={f.label}
                    type={f.type ?? "text"}
                    required={f.required}
                    placeholder={f.placeholder}
                    value={String(formData[f.key] ?? "")}
                    onChange={(e) => setField(f.key, e.target.value)}
                  />
                );
              })}
            </div>
            <div className="modal-action">
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button loading={saving} onClick={handleSave}>
                {editing ? "Salvar alterações" : "Criar registro"}
              </Button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setModalOpen(false)}>close</button>
          </form>
        </dialog>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-sm">
            <div className="flex flex-col items-center text-center gap-3 py-2">
              <div className="size-12 rounded-full bg-error/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">Confirmar exclusão</h3>
                <p className="text-sm text-base-content/60 mt-1">
                  Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>
            <div className="modal-action justify-center gap-2">
              <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
                Cancelar
              </Button>
              <Button variant="error" loading={deleting} onClick={handleDelete}>
                Sim, excluir
              </Button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setDeleteTarget(null)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
}
