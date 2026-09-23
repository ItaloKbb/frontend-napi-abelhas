"use client";

import { useState } from "react";
import { AdminCrudTable, type Column, type FieldConfig, type CrudService } from "@/components/organisms/AdminCrudTable";
import { abelhasService } from "@/services/abelhas-service";
import { Badge } from "@/components/atoms";
import type { Abelha } from "@/types";

const padroes = [
  {
    nomeCientifico: "Tetragonisca angustula",
    nomePopular: "Jataí",
    descricao: "Abelha pequena, de coloração dourada e comportamento geralmente dócil.",
  },
  {
    nomeCientifico: "Melipona quadrifasciata",
    nomePopular: "Mandaçaia",
    descricao: "Abelha de corpo escuro com faixas amarelas no abdômen.",
  },
  {
    nomeCientifico: "Melipona scutellaris",
    nomePopular: "Uruçu",
    descricao: "Espécie criada para produção de mel e importante para a polinização.",
  },
  {
    nomeCientifico: "Scaptotrigona bipunctata",
    nomePopular: "Tubuna",
    descricao: "Abelha escura que vive em colônias e visita diversas flores.",
  },
  {
    nomeCientifico: "Trigona spinipes",
    nomePopular: "Irapuá",
    descricao: "Abelha escura de ampla ocorrência no Brasil.",
  },
  {
    nomeCientifico: "Nannotrigona testaceicornis",
    nomePopular: "Iraí",
    descricao: "Abelha pequena que pode formar colônias em cavidades.",
  },
  {
    nomeCientifico: "Plebeia droryana",
    nomePopular: "Mirim",
    descricao: "Espécie de pequeno porte encontrada em diferentes ambientes.",
  },
  {
    nomeCientifico: "Melipona bicolor",
    nomePopular: "Guaraipo",
    descricao: "Abelha sem ferrão conhecida pelo comportamento geralmente dócil.",
  },
  {
    nomeCientifico: "Melipona flavolineata",
    nomePopular: "Uruçu-amarela",
    descricao: "Espécie do gênero Melipona associada à produção de mel.",
  },
  {
    nomeCientifico: "Melipona rufiventris",
    nomePopular: "Tujuba",
    descricao: "Abelha sem ferrão do gênero Melipona.",
  },
  {
    nomeCientifico: "Melipona mondury",
    nomePopular: "Bugia",
    descricao: "Espécie nativa do gênero Melipona, importante na polinização.",
  },
  {
    nomeCientifico: "Scaptotrigona postica",
    nomePopular: "Mandaguari",
    descricao: "Abelha social que constrói ninhos em cavidades.",
  },
];

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
  const [loadingPatterns, setLoadingPatterns] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const cadastrarPadroes = async () => {
    setLoadingPatterns(true);
    try {
      const existentes = await abelhasService.list({ pageSize: 200 });
      const nomesExistentes = new Set(
        existentes.map((abelha) => abelha.nomeCientifico.trim().toLocaleLowerCase()),
      );
      const faltantes = padroes.filter(
        (padrao) => !nomesExistentes.has(padrao.nomeCientifico.toLocaleLowerCase()),
      );

      await Promise.all(
        faltantes.map((padrao) =>
          abelhasService.create({
            ...padrao,
            semFerrao: true,
            nativa: true,
          }),
        ),
      );
      setReloadKey((key) => key + 1);
    } finally {
      setLoadingPatterns(false);
    }
  };

  return (
    <AdminCrudTable<Abelha>
      key={reloadKey}
      title="Abelhas"
      columns={columns}
      fields={fields}
      service={abelhasService as unknown as CrudService<Abelha>}
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
