"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser, useOrganization } from "@clerk/nextjs";
import { ROUTES } from "@/constants";
import { ThemeSwitcher } from "@/components/molecules";

const navItems = [
  { href: ROUTES.AMOSTRAS, label: "Amostras" },
  { href: ROUTES.PRODUTORES, label: "Produtores" },
];

const adminItems = [
  { href: ROUTES.ADMIN, label: "Painel Admin" },
  { href: ROUTES.ADMIN_USUARIOS, label: "Usuários" },
];

const adminCrudItems = [
  { href: ROUTES.ADMIN_CIDADES_IBGE, label: "Cidades IBGE" },
  { href: ROUTES.ADMIN_TIPOS_AMOSTRA, label: "Tipos de Amostra" },
  { href: ROUTES.ADMIN_TIPOS_ANALISE, label: "Tipos de Análise" },
  { href: ROUTES.ADMIN_ABELHAS, label: "Abelhas" },
  { href: ROUTES.ADMIN_PONTOS_COLETA, label: "Pontos de Coleta" },
  { href: ROUTES.ADMIN_RESPONSAVEIS, label: "Responsáveis" },
];

const roleLabels: Record<string, string> = {
  "org:admin": "Admin",
  "org:member": "Membro",
};

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { organization, membership } = useOrganization();

  const orgRole = membership?.role;
  const isAdmin = orgRole === "org:admin";

  return (
    <aside className="min-h-screen w-64 bg-base-200 flex flex-col">
      <div className="px-6 py-5 text-xl font-bold tracking-wide border-b border-base-300">
        🍯 NAPI Abelhas
      </div>

      {organization && (
        <div className="px-4 py-3 border-b border-base-300">
          <p className="text-xs text-base-content/50 uppercase tracking-wider">
            Organização
          </p>
          <p className="font-semibold text-sm truncate">
            {organization.name}
          </p>
          {orgRole && (
            <span className="badge badge-sm badge-outline badge-primary mt-1">
              {roleLabels[orgRole] ?? orgRole}
            </span>
          )}
        </div>
      )}

      <ul className="menu flex-1 p-4 gap-1">
        {navItems.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={pathname.startsWith(href) ? "active" : ""}
            >
              {label}
            </Link>
          </li>
        ))}

        <li>
          <Link
            href={ROUTES.PERFIL}
            className={pathname === ROUTES.PERFIL ? "active" : ""}
          >
            Meu Perfil
          </Link>
        </li>

        {isAdmin && (
          <>
            <li className="menu-title mt-4">
              <span>Administração</span>
            </li>
            {adminItems.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={pathname === href ? "active" : ""}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="menu-title mt-4">
              <span>Cadastros</span>
            </li>
            {adminCrudItems.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={pathname === href ? "active" : ""}
                >
                  {label}
                </Link>
              </li>
            ))}
          </>
        )}
      </ul>

      <div className="px-4 py-3 border-t border-base-300">
        <p className="text-xs text-base-content/50 uppercase tracking-wider mb-1">Tema</p>
        <ThemeSwitcher />
      </div>

      <div className="p-4 border-t border-base-300 flex items-center gap-3">
        <UserButton
          appearance={{
            elements: { avatarBox: "w-10 h-10" },
          }}
        />
        {user && (
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">
              {user.fullName ?? user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
