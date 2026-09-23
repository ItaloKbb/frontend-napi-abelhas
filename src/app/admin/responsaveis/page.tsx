"use client";

import {
  AdminCrudTable,
  type Column,
  type FieldConfig,
  type SelectOption,
  type CrudService,
} from "@/components/organisms/AdminCrudTable";
import { responsaveisService } from "@/services/responsaveis-service";
import { cidadesIbgeService } from "@/services/cidades-ibge-service";
import type { Responsavel } from "@/types";

const loadOrganizacoes = async (): Promise<SelectOption[]> => {
  const response = await fetch("/api/clerk/organizations");
  const data = (await response.json()) as
    | Array<{ id: string; name: string; slug: string | null }>
    | { message?: string };
  if (!response.ok || !Array.isArray(data)) {
    throw new Error(
      "message" in data && data.message
        ? data.message
        : "Erro ao carregar organizações.",
    );
  }
  return data.map((organization) => ({
    value: organization.id,
    label: organization.slug
      ? organization.name + " — " + organization.slug
      : organization.name,
  }));
};

const loadCidades = async (): Promise<SelectOption[]> => {
  const cidades = await cidadesIbgeService.list({ pageSize: 10000 });
  return cidades.map((c) => ({
    value: c.id,
    label: `${c.cidade} - ${c.estado}`,
  }));
};

const columns: Column<Responsavel>[] = [
  { key: "nome", label: "Nome" },
  {
    key: "cidade",
    label: "Cidade",
    render: (item) =>
      item.cidade ? `${item.cidade.cidade} - ${item.cidade.estado}` : "—",
  },
];

const fields: FieldConfig[] = [
  {
    key: "nome",
    label: "Nome",
    required: true,
    placeholder: "Nome do responsável",
  },
  {
    key: "instituicaoId",
    label: "Instituição",
    type: "searchable-select",
    required: true,
    placeholder: "Digite para pesquisar uma organização…",
    loadOptions: loadOrganizacoes,
  },
  {
    key: "cidadeId",
    label: "Cidade",
    type: "select",
    placeholder: "Selecione a cidade (opcional)",
    loadOptions: loadCidades,
  },
];

export default function ResponsaveisPage() {
  return (
    <AdminCrudTable<Responsavel>
      title="Responsáveis"
      columns={columns}
      fields={fields}
      service={responsaveisService as unknown as CrudService<Responsavel>}
    />
  );
}
