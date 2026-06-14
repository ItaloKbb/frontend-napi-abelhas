"use client";

import { AdminCrudTable, type Column, type FieldConfig, type SelectOption, type CrudService } from "@/components/organisms/AdminCrudTable";
import { pontosColetaService } from "@/services/pontos-coleta-service";
import { cidadesIbgeService } from "@/services/cidades-ibge-service";
import type { PontoColeta } from "@/types";
import { formatCoordinates } from "@/utils";

const loadCidades = async (): Promise<SelectOption[]> => {
  const cidades = await cidadesIbgeService.list({ pageSize: 10000 });
  return cidades.map((c) => ({ value: c.id, label: `${c.cidade} - ${c.estado}` }));
};

const columns: Column<PontoColeta>[] = [
  { key: "nome", label: "Nome" },
  {
    key: "coordenadas",
    label: "Coordenadas",
    render: (item) => formatCoordinates(item.latitude, item.longitude),
  },
  { key: "raio", label: "Raio (m)", render: (item) => item.raio != null ? `${item.raio} m` : "—" },
  { key: "cidade", label: "Cidade", render: (item) => item.cidade ? `${item.cidade.cidade} - ${item.cidade.estado}` : item.cidadeId },
];

const fields: FieldConfig[] = [
  { key: "nome", label: "Nome", required: true, placeholder: "Nome do ponto" },
  { key: "latitude", label: "Latitude", type: "number", required: true, placeholder: "-23.5505" },
  { key: "longitude", label: "Longitude", type: "number", required: true, placeholder: "-46.6333" },
  { key: "raio", label: "Raio (metros)", type: "number", placeholder: "Opcional" },
  { key: "cidadeId", label: "Cidade", type: "select", required: true, placeholder: "Selecione a cidade", loadOptions: loadCidades },
];

export default function PontosColetaPage() {
  return (
    <AdminCrudTable<PontoColeta>
      title="Pontos de Coleta"
      columns={columns}
      fields={fields}
      service={pontosColetaService as unknown as CrudService<PontoColeta>}
    />
  );
}
