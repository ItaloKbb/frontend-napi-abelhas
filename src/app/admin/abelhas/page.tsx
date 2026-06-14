"use client";

import { AdminCrudTable, type Column, type FieldConfig, type CrudService } from "@/components/organisms/AdminCrudTable";
import { abelhasService } from "@/services/abelhas-service";
import { Badge } from "@/components/atoms";
import type { Abelha } from "@/types";

const columns: Column<Abelha>[] = [
  { key: "nomeCientifico", label: "Nome Científico" },
  { key: "nomePopular", label: "Nome Popular", render: (item) => item.nomePopular ?? "—" },
  {
    key: "semFerrao",
    label: "Sem Ferrão",
    render: (item) => (
      <Badge variant={item.semFerrao ? "success" : "ghost"} label={item.semFerrao ? "Sim" : "Não"} />
    ),
  },
  {
    key: "nativa",
    label: "Nativa",
    render: (item) => (
      <Badge variant={item.nativa ? "success" : "ghost"} label={item.nativa ? "Sim" : "Não"} />
    ),
  },
];

const fields: FieldConfig[] = [
  { key: "nomeCientifico", label: "Nome Científico", required: true, placeholder: "Ex: Apis mellifera" },
  { key: "nomePopular", label: "Nome Popular", placeholder: "Ex: Abelha europeia" },
  { key: "semFerrao", label: "Sem Ferrão", type: "checkbox" },
  { key: "nativa", label: "Nativa", type: "checkbox" },
  { key: "descricao", label: "Descrição", placeholder: "Descrição (opcional)" },
];

export default function AbelhasPage() {
  return (
    <AdminCrudTable<Abelha>
      title="Abelhas"
      columns={columns}
      fields={fields}
      service={abelhasService as unknown as CrudService<Abelha>}
    />
  );
}
