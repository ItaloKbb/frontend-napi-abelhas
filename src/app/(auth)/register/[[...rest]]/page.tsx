"use client";

import { AuthenticateWithRedirectCallback, useAuth, useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AuthLoading, AuthShell } from "@/components/auth/AuthShell";
import { AuthAlert, GoogleIcon, OtpInput, PasswordInput, clerkErrorMessage, useResendTimer } from "@/components/auth/AuthControls";
import { ROUTES } from "@/constants";

const target = () => {
  if (typeof window === "undefined") return ROUTES.AMOSTRAS;
  const value = new URLSearchParams(window.location.search).get("redirect_url");
  return value?.startsWith("/") && !value.startsWith("//") ? value : ROUTES.AMOSTRAS;
};

export default function RegisterPage() {
  const auth = useAuth();
  const { signUp, fetchStatus } = useSignUp();
  const pathname = usePathname();
  const router = useRouter();
  const [verifying, setVerifying] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [working, setWorking] = useState(false);
  const resend = useResendTimer(30);
  const busy = working || fetchStatus === "fetching";

  useEffect(() => { if (auth.isLoaded && auth.isSignedIn) router.replace(target()); }, [auth.isLoaded, auth.isSignedIn, router]);

  if (pathname.endsWith("/sso-callback")) return <AuthShell mode="register"><div className="auth-callback"><span className="loading loading-spinner loading-lg" /><h1>Criando sua conta</h1><p>Aguarde enquanto validamos sua conta Google.</p><AuthenticateWithRedirectCallback /></div></AuthShell>;
  if (!auth.isLoaded || !signUp || auth.isSignedIn) return <AuthLoading />;

  async function finalize() {
    if (signUp.status !== "complete") return false;
    const result = await signUp.finalize();
    if (result.error) throw result.error;
    router.replace(target());
    return true;
  }

  async function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (password !== confirm) return setError("As senhas não coincidem."); setError(""); setNotice(""); setWorking(true);
    try {
      await signUp.reset();
      const result = await signUp.password({ emailAddress: email.trim(), password, firstName: name.trim(), locale: "pt-BR" });
      if (result.error) throw result.error;
      if (await finalize()) return;
      const sent = await signUp.verifications.sendEmailCode(); if (sent.error) throw sent.error;
      setVerifying(true); resend.restart(); setNotice("Enviamos um código de 6 dígitos para confirmar seu e-mail.");
    } catch (cause) { setError(clerkErrorMessage(cause, "Não foi possível criar sua conta.")); } finally { setWorking(false); }
  }

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (code.length !== 6) return setError("Digite os 6 dígitos do código."); setError(""); setWorking(true);
    try {
      const result = await signUp.verifications.verifyEmailCode({ code }); if (result.error) throw result.error;
      if (!(await finalize())) setError("Ainda há informações pendentes para concluir o cadastro.");
    } catch (cause) { setError(clerkErrorMessage(cause, "Código incorreto ou expirado.")); } finally { setWorking(false); }
  }

  async function sendAgain() {
    setError(""); setNotice(""); setWorking(true);
    try { const result = await signUp.verifications.sendEmailCode(); if (result.error) throw result.error; resend.restart(); setNotice("Um novo código foi enviado."); }
    catch (cause) { setError(clerkErrorMessage(cause, "Não foi possível reenviar o código.")); } finally { setWorking(false); }
  }

  async function google() {
    setError(""); setWorking(true);
    try {
      const redirectUrl = target();
      const result = await signUp.sso({ strategy: "oauth_google", redirectUrl, redirectCallbackUrl: `/register/sso-callback?redirect_url=${encodeURIComponent(redirectUrl)}`, locale: "pt-BR" });
      if (result.error) throw result.error;
    } catch (cause) { setError(clerkErrorMessage(cause, "Não foi possível continuar com o Google.")); setWorking(false); }
  }

  function edit() { void signUp.reset(); setVerifying(false); setCode(""); setError(""); setNotice(""); }

  return <AuthShell mode="register">
    {!verifying ? <>
      <header className="auth-form-header"><span className="auth-kicker">COMECE AGORA</span><h1>Crie sua conta</h1><p>Centralize e acompanhe suas amostras em um só lugar.</p></header>
      <AuthAlert message={error} />
      <button type="button" className="auth-google-button" onClick={google} disabled={busy}><GoogleIcon /> Continuar com Google</button>
      <div className="auth-divider"><span>ou cadastre-se com e-mail</span></div>
      <form onSubmit={register} className="auth-form">
        <label className="auth-field" htmlFor="name"><span>Nome</span><input id="name" type="text" autoComplete="given-name" placeholder="Como podemos chamar você?" required value={name} onChange={e => setName(e.target.value)} /></label>
        <label className="auth-field" htmlFor="email"><span>E-mail</span><input id="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" required value={email} onChange={e => setEmail(e.target.value)} /></label>
        <PasswordInput id="password" label="Senha" autoComplete="new-password" minLength={8} placeholder="Mínimo de 8 caracteres" required value={password} onChange={e => setPassword(e.target.value)} />
        <PasswordInput id="confirm-password" label="Confirmar senha" autoComplete="new-password" minLength={8} placeholder="Digite a senha novamente" required value={confirm} onChange={e => setConfirm(e.target.value)} />
        <button className="auth-primary-button" disabled={busy}>{busy && <span className="loading loading-spinner loading-sm" />} Criar conta</button>
      </form>
      <p className="auth-switch">Já possui uma conta? <Link href="/login">Entrar</Link></p>
    </> : <>
      <button type="button" className="auth-back-button" onClick={edit}>← Alterar dados</button>
      <header className="auth-form-header"><span className="auth-kicker">CONFIRME SEU E-MAIL</span><h1>Falta só uma etapa</h1><p>Digite o código enviado para <strong>{email}</strong>.</p></header>
      <AuthAlert message={error} /><AuthAlert message={notice} success />
      <form onSubmit={verify} className="auth-form auth-code-form"><OtpInput value={code} onChange={setCode} disabled={busy} invalid={Boolean(error)} autoFocus /><button className="auth-primary-button" disabled={busy || code.length !== 6}>{busy && <span className="loading loading-spinner loading-sm" />} Confirmar e-mail</button></form>
      <button type="button" className="auth-text-button auth-resend" onClick={sendAgain} disabled={busy || resend.seconds > 0}>{resend.seconds ? `Reenviar código em ${resend.seconds}s` : "Reenviar código"}</button>
    </>}
  </AuthShell>;
}
