"use client";

import { AdminCrudTable, type Column, type FieldConfig, type CrudService } from "@/components/organisms/AdminCrudTable";
import { tiposAmostraService } from "@/services/tipos-amostra-service";
import type { TipoAmostra } from "@/types";

const columns: Column<TipoAmostra>[] = [
  { key: "nome", label: "Nome" },
  { key: "descricao", label: "Descrição", render: (item) => item.descricao ?? "—" },
];

const fields: FieldConfig[] = [
  { key: "nome", label: "Nome", required: true, placeholder: "Nome do tipo" },
  { key: "descricao", label: "Descrição", placeholder: "Descrição (opcional)" },
];

export default function TiposAmostraPage() {
  return (
    <AdminCrudTable<TipoAmostra>
      title="Tipos de Amostra"
      columns={columns}
      fields={fields}
      service={tiposAmostraService as unknown as CrudService<TipoAmostra>}
    />
  );
}
