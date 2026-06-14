"use client";

import { AdminCrudTable, type Column, type FieldConfig, type CrudService } from "@/components/organisms/AdminCrudTable";
import { tiposAnaliseService } from "@/services/tipos-analise-service";
import type { TipoAnalise } from "@/types";

const columns: Column<TipoAnalise>[] = [
  { key: "nome", label: "Nome" },
];

const fields: FieldConfig[] = [
  { key: "nome", label: "Nome", required: true, placeholder: "Nome do tipo" },
];

export default function TiposAnalisePage() {
  return (
    <AdminCrudTable<TipoAnalise>
      title="Tipos de Análise"
      columns={columns}
      fields={fields}
      service={tiposAnaliseService as unknown as CrudService<TipoAnalise>}
    />
  );
}
