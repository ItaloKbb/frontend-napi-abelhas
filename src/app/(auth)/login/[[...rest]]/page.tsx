"use client";

import { SignIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/constants";

export default function LoginPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace(ROUTES.AMOSTRAS);
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col text-center">
          <span className="loading loading-spinner loading-lg" />
          <p className="text-base-content/70">
            Você já está logado. Redirecionando...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col w-full max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold">🍯 NAPI Abelhas</h1>
          <p className="py-4 text-base-content/70">
            Sistema de Gestão de Amostras Apícolas
          </p>
        </div>
        <SignIn fallbackRedirectUrl="/amostras" signUpUrl="/register" />
      </div>
    </div>
  );
}
