"use client";

import { AuthenticateWithRedirectCallback, useAuth, useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AuthLoading, AuthShell } from "@/components/auth/AuthShell";
import { AuthAlert, GoogleIcon, OtpInput, PasswordInput, clerkErrorMessage, useResendTimer } from "@/components/auth/AuthControls";
import { ROUTES } from "@/constants";

type Step = "login" | "forgot-email" | "forgot-code" | "new-password";
const target = () => {
  if (typeof window === "undefined") return ROUTES.HOME;
  const value = new URLSearchParams(window.location.search).get("redirect_url");
  return value?.startsWith("/") && !value.startsWith("//") ? value : ROUTES.HOME;
};

export default function LoginPage() {
  const auth = useAuth();
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();
  const pathname = usePathname();
  const [step, setStep] = useState<Step>("login");
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

  if (pathname.endsWith("/sso-callback")) return <AuthShell mode="login"><div className="auth-callback"><span className="loading loading-spinner loading-lg" /><h1>Concluindo seu acesso</h1><p>Aguarde enquanto validamos sua conta Google.</p><AuthenticateWithRedirectCallback /></div></AuthShell>;
  if (!auth.isLoaded || !signIn || auth.isSignedIn) return <AuthLoading />;

  async function finalize() {
    if (signIn.status === "complete") {
      const result = await signIn.finalize();
      if (result.error) throw result.error;
      router.replace(target());
      return true;
    }
    if (["needs_second_factor", "needs_client_trust"].includes(signIn.status)) setError("Esta conta exige uma etapa adicional de segurança. Entre em contato com o administrador.");
    return false;
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setNotice(""); setWorking(true);
    try {
      const result = await signIn.password({ emailAddress: email.trim(), password });
      if (result.error) throw result.error;
      if (!(await finalize())) setError("Não foi possível concluir o login. Verifique seus dados e tente novamente.");
    } catch (cause) { setError(clerkErrorMessage(cause, "E-mail ou senha inválidos.")); } finally { setWorking(false); }
  }

  async function google() {
    setError(""); setWorking(true);
    try {
      const redirectUrl = target();
      const result = await signIn.sso({ strategy: "oauth_google", redirectUrl, redirectCallbackUrl: `/login/sso-callback?redirect_url=${encodeURIComponent(redirectUrl)}` });
      if (result.error) throw result.error;
    } catch (cause) { setError(clerkErrorMessage(cause, "Não foi possível continuar com o Google.")); setWorking(false); }
  }

  async function sendCode(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault(); setError(""); setNotice(""); setWorking(true);
    try {
      await signIn.reset();
      const created = await signIn.create({ identifier: email.trim() }); if (created.error) throw created.error;
      const sent = await signIn.resetPasswordEmailCode.sendCode(); if (sent.error) throw sent.error;
      setCode(""); setStep("forgot-code"); resend.restart(); setNotice("Enviamos um código de 6 dígitos para o seu e-mail.");
    } catch (cause) { setError(clerkErrorMessage(cause, "Não foi possível enviar o código de recuperação.")); } finally { setWorking(false); }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (code.length !== 6) return setError("Digite os 6 dígitos do código."); setError(""); setWorking(true);
    try { const result = await signIn.resetPasswordEmailCode.verifyCode({ code }); if (result.error) throw result.error; setPassword(""); setStep("new-password"); }
    catch (cause) { setError(clerkErrorMessage(cause, "Código incorreto ou expirado.")); } finally { setWorking(false); }
  }

  async function newPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (password !== confirm) return setError("As senhas não coincidem."); setError(""); setWorking(true);
    try {
      const result = await signIn.resetPasswordEmailCode.submitPassword({ password, signOutOfOtherSessions: true }); if (result.error) throw result.error;
      if (!(await finalize())) { setStep("login"); setNotice("Senha redefinida. Entre com sua nova senha."); }
    } catch (cause) { setError(clerkErrorMessage(cause, "Não foi possível redefinir a senha.")); } finally { setWorking(false); }
  }

  function back() { void signIn.reset(); setStep("login"); setCode(""); setPassword(""); setConfirm(""); setError(""); setNotice(""); }

  return <AuthShell mode="login">
    {step === "login" && <>
      <header className="auth-form-header"><span className="auth-kicker">BEM-VINDO DE VOLTA</span><h1>Acesse sua conta</h1><p>Continue para gerenciar suas amostras apícolas.</p></header>
      <AuthAlert message={error} /><AuthAlert message={notice} success />
      <button type="button" className="auth-google-button" onClick={google} disabled={busy}><GoogleIcon /> Continuar com Google</button>
      <div className="auth-divider"><span>ou entre com seu e-mail</span></div>
      <form onSubmit={login} className="auth-form">
        <label className="auth-field" htmlFor="email"><span>E-mail</span><input id="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" required value={email} onChange={e => setEmail(e.target.value)} /></label>
        <PasswordInput id="password" label="Senha" autoComplete="current-password" placeholder="Digite sua senha" required value={password} onChange={e => setPassword(e.target.value)} />
        <button type="button" className="auth-text-button auth-forgot-link" onClick={() => { setStep("forgot-email"); setError(""); }}>Esqueci minha senha</button>
        <button className="auth-primary-button" type="submit" disabled={busy}>{busy && <span className="loading loading-spinner loading-sm" />} Entrar</button>
      </form>
      <p className="auth-switch">Ainda não tem uma conta? <Link href="/register">Inscreva-se</Link></p>
    </>}
    {step === "forgot-email" && <>
      <button type="button" className="auth-back-button" onClick={back}>← Voltar para o login</button>
      <header className="auth-form-header"><span className="auth-kicker">RECUPERAR ACESSO</span><h1>Esqueceu sua senha?</h1><p>Informe o e-mail da sua conta para receber um código de segurança.</p></header><AuthAlert message={error} />
      <form onSubmit={sendCode} className="auth-form"><label className="auth-field" htmlFor="reset-email"><span>E-mail</span><input id="reset-email" type="email" autoComplete="email" required autoFocus value={email} onChange={e => setEmail(e.target.value)} /></label><button className="auth-primary-button" disabled={busy}>{busy && <span className="loading loading-spinner loading-sm" />} Enviar código</button></form>
    </>}
    {step === "forgot-code" && <>
      <button type="button" className="auth-back-button" onClick={() => setStep("forgot-email")}>← Alterar e-mail</button>
      <header className="auth-form-header"><span className="auth-kicker">VERIFICAÇÃO</span><h1>Confira seu e-mail</h1><p>Digite o código enviado para <strong>{email}</strong>.</p></header><AuthAlert message={error} /><AuthAlert message={notice} success />
      <form onSubmit={verifyCode} className="auth-form auth-code-form"><OtpInput value={code} onChange={setCode} disabled={busy} invalid={Boolean(error)} autoFocus /><button className="auth-primary-button" disabled={busy || code.length !== 6}>{busy && <span className="loading loading-spinner loading-sm" />} Verificar código</button></form>
      <button type="button" className="auth-text-button auth-resend" onClick={() => void sendCode()} disabled={busy || resend.seconds > 0}>{resend.seconds ? `Reenviar código em ${resend.seconds}s` : "Reenviar código"}</button>
    </>}
    {step === "new-password" && <>
      <header className="auth-form-header"><span className="auth-kicker">NOVA SENHA</span><h1>Crie uma nova senha</h1><p>Escolha uma senha segura que você ainda não tenha usado.</p></header><AuthAlert message={error} />
      <form onSubmit={newPassword} className="auth-form"><PasswordInput id="new-password" label="Nova senha" autoComplete="new-password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} /><PasswordInput id="confirm-new-password" label="Confirmar nova senha" autoComplete="new-password" minLength={8} required value={confirm} onChange={e => setConfirm(e.target.value)} /><button className="auth-primary-button" disabled={busy}>{busy && <span className="loading loading-spinner loading-sm" />} Redefinir senha</button></form>
    </>}
  </AuthShell>;
}
