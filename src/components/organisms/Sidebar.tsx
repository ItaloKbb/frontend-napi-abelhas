"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser, useOrganization } from "@clerk/nextjs";
import { ROUTES } from "@/constants";
import { ThemeSwitcher } from "@/components/molecules";
import { BrandLogo } from "@/components/atoms/BrandAssets";

const navItems = [{ href: ROUTES.AMOSTRAS, label: "Amostras" }, { href: ROUTES.PRODUTORES, label: "Produtores" }];
const adminItems = [{ href: ROUTES.ADMIN, label: "Painel Admin" }, { href: ROUTES.ADMIN_USUARIOS, label: "Usuários" }];
const adminCrudItems = [
  { href: ROUTES.ADMIN_CIDADES_IBGE, label: "Cidades IBGE" }, { href: ROUTES.ADMIN_TIPOS_AMOSTRA, label: "Tipos de Amostra" },
  { href: ROUTES.ADMIN_TIPOS_ANALISE, label: "Tipos de Análise" }, { href: ROUTES.ADMIN_ABELHAS, label: "Abelhas" },
  { href: ROUTES.ADMIN_PONTOS_COLETA, label: "Pontos de Coleta" }, { href: ROUTES.ADMIN_RESPONSAVEIS, label: "Responsáveis" },
];
const roleLabels: Record<string, string> = { "org:admin": "Admin", "org:member": "Membro" };
type Props = { id?: string; className?: string; mobile?: boolean; onClose?: () => void };

export function Sidebar({ id, className = "", mobile = false, onClose }: Props) {
  const pathname = usePathname();
  const { user } = useUser();
  const { organization, membership } = useOrganization();
  const role = membership?.role;
  const active = (href: string, exact = false) => exact ? pathname === href : pathname.startsWith(href);
  return <aside id={id} className={`h-dvh w-[min(20rem,88vw)] shrink-0 flex-col overflow-y-auto bg-base-200 lg:w-64 ${className}`.trim()} aria-label="Navegação principal">
    <div className="flex min-h-20 items-center justify-between border-b border-base-300 px-4 py-2"><Link href="/" onClick={onClose} aria-label="NAPI Abelhas — início"><BrandLogo compact /></Link>{mobile && <button type="button" autoFocus className="btn btn-ghost btn-square min-h-11 min-w-11" aria-label="Fechar menu" onClick={onClose}><span aria-hidden="true" className="text-xl">✕</span></button>}</div>
    {organization && <div className="border-b border-base-300 px-4 py-3"><p className="text-xs uppercase tracking-wider text-base-content/50">Organização</p><p className="truncate text-sm font-semibold">{organization.name}</p>{role && <span className="badge badge-primary badge-outline badge-sm mt-1">{roleLabels[role] ?? role}</span>}</div>}
    <ul className="menu flex-1 gap-1 p-4">
      {navItems.map((item) => <li key={item.href}><Link href={item.href} className={active(item.href) ? "active" : ""} onClick={onClose}>{item.label}</Link></li>)}
      <li><Link href={ROUTES.PERFIL} className={active(ROUTES.PERFIL, true) ? "active" : ""} onClick={onClose}>Meu Perfil</Link></li>
      {role === "org:admin" && <><li className="menu-title mt-4"><span>Administração</span></li>{adminItems.map((item) => <li key={item.href}><Link href={item.href} className={active(item.href, true) ? "active" : ""} onClick={onClose}>{item.label}</Link></li>)}<li className="menu-title mt-4"><span>Cadastros</span></li>{adminCrudItems.map((item) => <li key={item.href}><Link href={item.href} className={active(item.href, true) ? "active" : ""} onClick={onClose}>{item.label}</Link></li>)}</>}
    </ul>
    <div className="border-t border-base-300 px-4 py-3"><p className="mb-1 text-xs uppercase tracking-wider text-base-content/50">Tema</p><ThemeSwitcher /></div>
    <div className="flex items-center gap-3 border-t border-base-300 p-4"><UserButton appearance={{ elements: { avatarBox: "w-10 h-10" } }} />{user && <div className="min-w-0"><p className="truncate text-sm font-medium">{user.fullName ?? user.primaryEmailAddress?.emailAddress}</p></div>}</div>
  </aside>;
}
