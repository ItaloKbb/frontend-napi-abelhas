"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { BeeMascot, BrandLogo } from "@/components/atoms/BrandAssets";

type AuthShellProps = { children: ReactNode; mode: "login" | "register" };

export function AuthShell({ children, mode }: AuthShellProps) {
  const isLogin = mode === "login";
  return <main className="auth-shell">
    <section className="auth-form-panel" aria-label={isLogin ? "Acesso à plataforma" : "Cadastro na plataforma"}>
      <Link href="/" className="auth-brand" aria-label="NAPI Abelhas — página inicial"><BrandLogo compact priority /></Link>
      <div className="auth-form-stage"><div className="hover-3d auth-form-3d"><div className="auth-form-card">{children}</div></div></div>
      <p className="auth-security-note"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 4.5 5v6.2c0 4.8 3.2 9.2 7.5 10.8 4.3-1.6 7.5-6 7.5-10.8V5L12 2Zm3.4 8.2-4.1 4.1a1 1 0 0 1-1.4 0l-2-2 1.4-1.4 1.3 1.3 3.4-3.4 1.4 1.4Z" /></svg>Autenticação protegida pelo Clerk</p>
    </section>
    <aside className="auth-story-panel">
      <div className="auth-honeycomb" aria-hidden="true" />
      <BeeMascot decorative priority className="auth-story-bee" />
      <div className="auth-story-top"><span>Pesquisa • Campo • Laboratório</span><Link href={isLogin ? "/register" : "/login"} className="auth-outline-button">{isLogin ? "Inscreva-se" : "Entrar"}</Link></div>
      <div className="auth-story-content"><span className="auth-eyebrow">NAPI ABELHAS</span><h2>Gestão de amostras apícolas, do campo ao laboratório.</h2><p>Uma plataforma integrada para organizar coletas, acompanhar análises e transformar dados em conhecimento para a apicultura.</p><ul className="auth-benefits"><li>Rastreabilidade das amostras</li><li>Dados centralizados e seguros</li><li>Colaboração entre equipes</li></ul><Link href={isLogin ? "/register" : "/login"} className="auth-story-cta">{isLogin ? "Criar minha conta" : "Acessar a plataforma"}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13 5-1.4 1.4 4.6 4.6H4v2h12.2l-4.6 4.6L13 19l7-7-7-7Z" /></svg></Link></div>
      <p className="auth-story-footer">Sistema de Gestão de Amostras Apícolas</p>
    </aside>
  </main>;
}

export function AuthLoading() {
  return <div className="auth-loading" role="status"><BeeMascot decorative className="w-24" /><span>Carregando ambiente seguro…</span></div>;
}
