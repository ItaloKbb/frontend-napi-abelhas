"use client";

import Link from "next/link";
import { useOrganization } from "@clerk/nextjs";
import { ROUTES } from "@/constants";

export default function AdminPage() {
  const { organization, membership, isLoaded } = useOrganization();

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center gap-2 py-16">
        <span className="loading loading-spinner loading-lg text-primary" />
        <span className="text-sm text-base-content/40">Carregando…</span>
      </div>
    );
  }

  if (membership?.role !== "org:admin") {
    return (
      <div role="alert" className="alert alert-error shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>Acesso negado. Você não tem permissão de administrador.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Painel de Administração</h1>
        <p className="text-sm text-base-content/60 mt-1">Gerencie os recursos da organização {organization?.name}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href={ROUTES.ADMIN_USUARIOS} className="card bg-base-100 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
          <div className="card-body">
            <h2 className="card-title">👥 Usuários</h2>
            <p className="text-base-content/60">
              Gerencie os membros da organização, convide novos usuários e
              altere cargos.
            </p>
          </div>
        </Link>

        <Link href={ROUTES.ADMIN_CIDADES_IBGE} className="card bg-base-100 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
          <div className="card-body">
            <h2 className="card-title">🏙️ Cidades IBGE</h2>
            <p className="text-base-content/60">Consulte os dados de referência de cidades do IBGE.</p>
          </div>
        </Link>

        <Link href={ROUTES.ADMIN_TIPOS_AMOSTRA} className="card bg-base-100 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
          <div className="card-body">
            <h2 className="card-title">🧪 Tipos de Amostra</h2>
            <p className="text-base-content/60">Cadastre e gerencie os tipos de amostra disponíveis.</p>
          </div>
        </Link>

        <Link href={ROUTES.ADMIN_TIPOS_ANALISE} className="card bg-base-100 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
          <div className="card-body">
            <h2 className="card-title">🔬 Tipos de Análise</h2>
            <p className="text-base-content/60">Cadastre e gerencie os tipos de análise disponíveis.</p>
          </div>
        </Link>

        <Link href={ROUTES.ADMIN_ABELHAS} className="card bg-base-100 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
          <div className="card-body">
            <h2 className="card-title">🐝 Abelhas</h2>
            <p className="text-base-content/60">Cadastre espécies de abelhas com informações taxonômicas.</p>
          </div>
        </Link>

        <Link href={ROUTES.ADMIN_PONTOS_COLETA} className="card bg-base-100 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
          <div className="card-body">
            <h2 className="card-title">📍 Pontos de Coleta</h2>
            <p className="text-base-content/60">Gerencie os pontos de coleta com coordenadas geográficas.</p>
          </div>
        </Link>

        <Link href={ROUTES.ADMIN_RESPONSAVEIS} className="card bg-base-100 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
          <div className="card-body">
            <h2 className="card-title">👤 Responsáveis</h2>
            <p className="text-base-content/60">Cadastre responsáveis pelas análises e coletas.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
