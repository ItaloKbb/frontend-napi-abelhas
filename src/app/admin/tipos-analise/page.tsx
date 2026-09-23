"use client";

import { useState } from "react";
import { AdminCrudTable, type Column, type FieldConfig, type CrudService } from "@/components/organisms/AdminCrudTable";
import { tiposAnaliseService } from "@/services/tipos-analise-service";
import type { TipoAnalise } from "@/types";

const padroes = [
  "Umidade",
  "pH e acidez",
  "Açúcares (frutose, glicose e sacarose)",
  "Hidroximetilfurfural (HMF)",
  "Atividade diastásica",
  "Cor e condutividade elétrica",
  "Análise polínica para identificar a origem floral",
  "Pesquisa de adulteração",
  "Análise microbiológica",
  "Pesquisa de resíduos de agrotóxicos e medicamentos veterinários",
  "Umidade e atividade de água",
  "Identificação botânica dos grãos de pólen",
  "Proteínas, lipídios, carboidratos e fibras",
  "Cinzas e minerais",
  "Compostos fenólicos e atividade antioxidante",
  "Pesquisa de resíduos de agrotóxicos",
  "Avaliação sensorial: cor, aroma e aparência",
];

const columns: Column<TipoAnalise>[] = [
  { key: "nome", label: "Nome" },
];

const fields: FieldConfig[] = [
  { key: "nome", label: "Nome", required: true, placeholder: "Nome do tipo" },
];

export default function TiposAnalisePage() {
  const [loadingPatterns, setLoadingPatterns] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const cadastrarPadroes = async () => {
    setLoadingPatterns(true);
    try {
      const existentes = await tiposAnaliseService.list({ pageSize: 200 });
      const nomesExistentes = new Set(
        existentes.map((item) => item.nome.trim().toLocaleLowerCase()),
      );
      const faltantes = padroes.filter(
        (padrao) => !nomesExistentes.has(padrao.toLocaleLowerCase()),
      );

      await Promise.all(
        faltantes.map((nome) => tiposAnaliseService.create({ nome })),
      );
      setReloadKey((key) => key + 1);
    } finally {
      setLoadingPatterns(false);
    }
  };

  return (
    <AdminCrudTable<TipoAnalise>
      key={reloadKey}
      title="Tipos de Análise"
      columns={columns}
      fields={fields}
      service={tiposAnaliseService as unknown as CrudService<TipoAnalise>}
      headerActions={(
        <button
          type="button"
          className="btn btn-outline btn-sm min-h-11 w-full sm:w-auto"
          disabled={loadingPatterns}
          onClick={cadastrarPadroes}
        >
          {loadingPatterns ? <span className="loading loading-spinner loading-sm" /> : null}
          Cadastrar padrões
        </button>
      )}
    />
  );
}
