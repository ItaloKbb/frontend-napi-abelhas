"use client";

import { useState } from "react";
import { AdminCrudTable, type Column, type FieldConfig, type CrudService } from "@/components/organisms/AdminCrudTable";
import { tiposAmostraService } from "@/services/tipos-amostra-service";
import type { TipoAmostra } from "@/types";

const padroes = [
  { nome: "Mel de florada silvestre", descricao: "Mel" },
  { nome: "Mel monofloral", descricao: "Mel de uma única florada, como laranjeira ou eucalipto" },
  { nome: "Mel multifloral", descricao: "Mel" },
  { nome: "Mel de melato", descricao: "Mel" },
  { nome: "Mel de abelhas sem ferrão", descricao: "Mel de jataí, mandaçaia ou uruçu" },
  { nome: "Mel recém-extraído", descricao: "Mel" },
  { nome: "Mel armazenado ou cristalizado", descricao: "Mel" },
  { nome: "Pólen coletado das flores", descricao: "Pólen" },
  { nome: "Pólen apícola", descricao: "Pólen recolhido pelas abelhas e retirado na entrada da colmeia" },
  { nome: "Pólen armazenado nos favos", descricao: "Pólen" },
  { nome: "Pólen de abelhas sem ferrão", descricao: "Pólen armazenado em potes da colônia" },
  { nome: "Pólen monofloral", descricao: "Pólen" },
  { nome: "Pólen multifloral", descricao: "Pólen" },
  { nome: "Pólen fresco, congelado ou desidratado", descricao: "Pólen" },
];

const columns: Column<TipoAmostra>[] = [
  { key: "nome", label: "Nome" },
  { key: "descricao", label: "Descrição", render: (item) => item.descricao ?? "—" },
];

const fields: FieldConfig[] = [
  { key: "nome", label: "Nome", required: true, placeholder: "Nome do tipo" },
  { key: "descricao", label: "Descrição", placeholder: "Descrição (opcional)" },
];

export default function TiposAmostraPage() {
  const [loadingPatterns, setLoadingPatterns] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const cadastrarPadroes = async () => {
    setLoadingPatterns(true);
    try {
      const existentes = await tiposAmostraService.list({ pageSize: 200 });
      const nomesExistentes = new Set(
        existentes.map((item) => item.nome.trim().toLocaleLowerCase()),
      );
      const faltantes = padroes.filter(
        (padrao) => !nomesExistentes.has(padrao.nome.toLocaleLowerCase()),
      );

      await Promise.all(
        faltantes.map((padrao) => tiposAmostraService.create(padrao)),
      );
      setReloadKey((key) => key + 1);
    } finally {
      setLoadingPatterns(false);
    }
  };

  return (
    <AdminCrudTable<TipoAmostra>
      key={reloadKey}
      title="Tipos de Amostra"
      columns={columns}
      fields={fields}
      service={tiposAmostraService as unknown as CrudService<TipoAmostra>}
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
