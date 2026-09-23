"use client";

import Link from "next/link";
import { useAuth, useOrganization, useUser } from "@clerk/nextjs";
import { BeeMascot, BrandLogo } from "@/components/atoms/BrandAssets";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { ROUTES } from "@/constants";

type ModuleCardProps = { title: string; description: string; icon: string; href: string; action: string; secondaryHref?: string; secondaryAction?: string; tone?: string };

function ModuleCard({ title, description, icon, href, action, secondaryHref, secondaryAction, tone = "bg-primary/10 text-primary" }: ModuleCardProps) {
  return <article className="group card border border-base-300 bg-base-100 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-lg">
    <div className="card-body gap-4 p-5 sm:p-6"><div className={`grid size-12 place-items-center rounded-2xl text-2xl ${tone}`} aria-hidden="true">{icon}</div><div className="flex-1"><h3 className="text-lg font-bold tracking-tight">{title}</h3><p className="mt-1 text-sm leading-relaxed text-base-content/60">{description}</p></div><div className="card-actions items-center"><Link href={href} className="btn btn-primary btn-sm">{action}</Link>{secondaryHref && <Link href={secondaryHref} className="btn btn-ghost btn-sm">{secondaryAction}</Link>}</div></div>
  </article>;
}

function PublicLanding() {
  return <div className="hero min-h-screen overflow-hidden bg-base-200"><div className="hero-content px-4 text-center"><div className="max-w-lg"><BeeMascot decorative priority className="mx-auto -mb-5 w-36 sm:w-44" /><BrandLogo priority className="justify-center [&>img]:h-20 [&>img]:w-28 [&>span]:text-3xl sm:[&>span]:text-5xl" /><p className="py-6 text-base-content/70">Sistema de Gestão de Amostras Apícolas. Controle de qualidade para mel, própolis, geleia real e outros produtos.</p><Link href={ROUTES.LOGIN} className="btn btn-primary">Entrar na plataforma</Link></div></div></div>;
}

function InternalHome() {
  const { user } = useUser();
  const { organization, membership, isLoaded } = useOrganization();
  const firstName = user?.firstName ?? user?.fullName?.split(" ")[0] ?? "pesquisador";
  const isAdmin = membership?.role === "org:admin";
  return <DashboardTemplate><div className="mx-auto max-w-7xl space-y-8">
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-secondary p-6 text-primary-content shadow-lg sm:p-8"><div className="relative z-10 max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.2em] opacity-70">Central de navegação</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Olá, {firstName}!</h1><p className="mt-3 max-w-xl text-sm leading-relaxed opacity-80 sm:text-base">Acesse rapidamente as ferramentas do NAPI Abelhas{organization ? ` para a organização ${organization.name}` : ""}.</p></div><BeeMascot decorative priority className="absolute -bottom-10 right-2 w-36 opacity-40 sm:right-8 sm:w-52 sm:opacity-70" /></section>
    {!isLoaded ? <div className="grid min-h-40 place-items-center"><span className="loading loading-spinner loading-lg text-primary" /></div> : <>
      {!membership && <div role="status" className="alert alert-warning"><span>Você não possui uma organização ativa. Selecione ou solicite acesso a uma organização para utilizar os módulos operacionais.</span><Link href={ROUTES.PERFIL} className="btn btn-sm">Abrir perfil</Link></div>}
      {membership && <section aria-labelledby="operation-title"><div className="mb-4"><p className="text-xs font-semibold uppercase tracking-[.16em] text-primary">Trabalho diário</p><h2 id="operation-title" className="text-2xl font-bold tracking-tight">Operação</h2></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><ModuleCard title="Amostras" description="Consulte amostras, acompanhe seu andamento e registre novas coletas." icon="◈" href={ROUTES.AMOSTRAS} action="Ver amostras" secondaryHref={ROUTES.AMOSTRAS_NOVA} secondaryAction="Nova amostra" /><ModuleCard title="Produtores" description="Gerencie os produtores vinculados às atividades e amostras da organização." icon="♙" href={ROUTES.PRODUTORES} action="Ver produtores" secondaryHref={ROUTES.PRODUTORES_NOVO} secondaryAction="Novo produtor" tone="bg-success/10 text-success" /><ModuleCard title="Meu perfil" description="Consulte seus dados, organização atual e nível de acesso na plataforma." icon="◎" href={ROUTES.PERFIL} action="Abrir perfil" tone="bg-info/10 text-info" /></div></section>}
      {isAdmin && <section aria-labelledby="admin-title"><div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-secondary">Acesso administrativo</p><h2 id="admin-title" className="text-2xl font-bold tracking-tight">Administração</h2></div><Link href={ROUTES.ADMIN} className="btn btn-ghost btn-sm">Ver painel administrativo →</Link></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"><ModuleCard title="Usuários" description="Convide membros e gerencie os papéis da organização." icon="♟" href={ROUTES.ADMIN_USUARIOS} action="Gerenciar" /><ModuleCard title="Cidades IBGE" description="Consulte e mantenha os municípios de referência." icon="▦" href={ROUTES.ADMIN_CIDADES_IBGE} action="Acessar" /><ModuleCard title="Tipos de amostra" description="Configure as categorias usadas no cadastro de amostras." icon="◇" href={ROUTES.ADMIN_TIPOS_AMOSTRA} action="Gerenciar" /><ModuleCard title="Tipos de análise" description="Configure as análises disponíveis nos fluxos laboratoriais." icon="⌁" href={ROUTES.ADMIN_TIPOS_ANALISE} action="Gerenciar" /><ModuleCard title="Abelhas" description="Mantenha as espécies e informações taxonômicas." icon="⬡" href={ROUTES.ADMIN_ABELHAS} action="Gerenciar" /><ModuleCard title="Pontos de coleta" description="Gerencie locais e coordenadas geográficas de coleta." icon="⌖" href={ROUTES.ADMIN_PONTOS_COLETA} action="Gerenciar" /><ModuleCard title="Responsáveis" description="Cadastre responsáveis por análises e coletas." icon="◉" href={ROUTES.ADMIN_RESPONSAVEIS} action="Gerenciar" /></div></section>}
    </>}
  </div></DashboardTemplate>;
}

export default function Home() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <div className="grid min-h-dvh place-items-center bg-base-100"><span className="loading loading-spinner loading-lg text-primary" /></div>;
  return isSignedIn ? <InternalHome /> : <PublicLanding />;
}
