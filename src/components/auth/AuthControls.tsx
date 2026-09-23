"use client";

import type { InputHTMLAttributes } from "react";
import { useEffect, useState } from "react";

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.5-.2-2.2H12v4.3h5.4a4.7 4.7 0 0 1-2 3v2.8h3.4c2-1.9 2.8-4.6 2.8-7.9Z" />
      <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.8-2.4l-3.4-2.8c-.9.6-2.1 1-3.4 1a6 6 0 0 1-5.6-4.1H2.9v2.9A10.3 10.3 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.4 13.7A6 6 0 0 1 6.1 12c0-.6.1-1.2.3-1.7V7.4H2.9A10.3 10.3 0 0 0 1.8 12c0 1.7.4 3.2 1.1 4.6l3.5-2.9Z" />
      <path fill="#EA4335" d="M12 6.1c1.5 0 2.8.5 3.8 1.5l3-3A10 10 0 0 0 2.9 7.4l3.5 2.9A6 6 0 0 1 12 6.1Z" />
    </svg>
  );
}

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement> & { label: string };

export function PasswordInput({ label, id, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="auth-field" htmlFor={id}>
      <span>{label}</span>
      <span className="auth-password-wrap">
        <input id={id} type={visible ? "text" : "password"} {...props} />
        <button
          type="button"
          className="auth-password-toggle"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={visible}
        >
          {visible ? (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3.3 2-1.3 1.3 3 3A11.8 11.8 0 0 0 1 12s4 7 11 7c1.7 0 3.2-.4 4.5-1l4.2 4.2 1.3-1.3L3.3 2ZM12 17c-4.6 0-7.7-3.8-8.7-5 .7-.8 1.8-2.2 3.2-3.2l2 2A4 4 0 0 0 13.2 15l1.7 1.7c-.9.2-1.9.3-2.9.3Zm1.4-5.6-4.8-4.8c1-.4 2.1-.6 3.4-.6 4.6 0 7.7 3.8 8.7 5-.5.6-1.2 1.5-2.2 2.3L16.2 11a4 4 0 0 0-3.2-3.2l-1.6-1.6A5.8 5.8 0 0 1 12 6c3.3 0 6.4 2.1 8.7 6-.7 1.2-1.6 2.2-2.5 3l-1.4-1.4c.7-.6 1.3-1.2 1.9-1.9-1-1.2-3.3-3.7-6.7-3.7l1.4 1.4Z" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5C5 5 1 12 1 12s4 7 11 7 11-7 11-7-4-7-11-7Zm0 12c-4.6 0-7.7-3.8-8.7-5 1-1.2 4.1-5 8.7-5s7.7 3.8 8.7 5c-1 1.2-4.1 5-8.7 5Zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" /></svg>
          )}
        </button>
      </span>
    </label>
  );
}

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  autoFocus?: boolean;
};

export function OtpInput({ value, onChange, disabled, invalid, autoFocus }: OtpInputProps) {
  return (
    <label className={`otp otp-lg auth-otp${invalid ? " otp-error" : ""}`}>
      {Array.from({ length: 6 }, (_, index) => <span key={index} />)}
      <input
        type="text"
        name="code"
        aria-label="Código de verificação com 6 dígitos"
        aria-invalid={invalid}
        autoComplete="one-time-code"
        inputMode="numeric"
        maxLength={6}
        pattern="[0-9]{6}"
        required
        disabled={disabled}
        autoFocus={autoFocus}
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, 6))}
      />
    </label>
  );
}

export function useResendTimer(initialSeconds = 30) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setTimeout(() => setSeconds((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  return { seconds, restart: () => setSeconds(initialSeconds) };
}

export function clerkErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object") {
    const candidate = error as { longMessage?: string; message?: string; errors?: Array<{ longMessage?: string; message?: string }> };
    return candidate.errors?.[0]?.longMessage ?? candidate.errors?.[0]?.message ?? candidate.longMessage ?? candidate.message ?? fallback;
  }
  return fallback;
}

export function AuthAlert({ message, success = false }: { message: string; success?: boolean }) {
  if (!message) return null;
  return (
    <div className={`auth-alert ${success ? "auth-alert-success" : "auth-alert-error"}`} role={success ? "status" : "alert"} aria-live="polite">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d={success ? "M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z" : "M11 7h2v6h-2V7Zm0 8h2v2h-2v-2Zm1-13a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"} /></svg>
      <span>{message}</span>
    </div>
  );
}

