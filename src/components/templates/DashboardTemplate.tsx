"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/organisms";
import { BrandLogo } from "@/components/atoms/BrandAssets";
import { AuthTokenProvider } from "@/providers";

export function DashboardTemplate({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow; document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") return setMenuOpen(false);
      if (event.key !== "Tab") return;
      const focusable = document.getElementById("mobile-navigation")?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusable?.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", handleKeyDown); };
  }, [menuOpen]);
  return <AuthTokenProvider><div className="min-h-dvh min-w-0 bg-base-100"><Sidebar className="fixed inset-y-0 left-0 z-40 hidden lg:flex" /><div className="flex min-h-dvh min-w-0 flex-col lg:pl-64"><header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-base-300 bg-base-100/95 px-4 backdrop-blur lg:hidden"><button type="button" className="btn btn-ghost btn-square min-h-11 min-w-11" aria-label="Abrir menu de navegação" aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(true)}><svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button><BrandLogo compact className="min-w-0 [&>span]:truncate" /></header><main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</main></div>{menuOpen && <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu de navegação"><button type="button" className="absolute inset-0 bg-black/45" aria-label="Fechar menu de navegação" onClick={() => setMenuOpen(false)} /><Sidebar id="mobile-navigation" mobile className="relative z-10 flex shadow-2xl" onClose={() => setMenuOpen(false)} /></div>}</div></AuthTokenProvider>;
}
