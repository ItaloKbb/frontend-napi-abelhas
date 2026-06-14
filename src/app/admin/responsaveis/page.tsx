"use client";

import { AdminCrudTable, type Column, type FieldConfig, type SelectOption, type CrudService } from "@/components/organisms/AdminCrudTable";
import { responsaveisService } from "@/services/responsaveis-service";
import { cidadesIbgeService } from "@/services/cidades-ibge-service";
import type { Responsavel } from "@/types";

const loadCidades = async (): Promise<SelectOption[]> => {
  const cidades = await cidadesIbgeService.list({ pageSize: 10000 });
  return cidades.map((c) => ({ value: c.id, label: `${c.cidade} - ${c.estado}` }));
};

const columns: Column<Responsavel>[] = [
  { key: "nome", label: "Nome" },
  { key: "cidade", label: "Cidade", render: (item) => item.cidade ? `${item.cidade.cidade} - ${item.cidade.estado}` : "—" },
];

const fields: FieldConfig[] = [
  { key: "nome", label: "Nome", required: true, placeholder: "Nome do responsável" },
  { key: "instituicaoId", label: "ID da Instituição", required: true, placeholder: "ID da organização" },
  { key: "cidadeId", label: "Cidade", type: "select", placeholder: "Selecione a cidade (opcional)", loadOptions: loadCidades },
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
