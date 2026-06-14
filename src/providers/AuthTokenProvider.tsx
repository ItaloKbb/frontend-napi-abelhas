"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { setTokenProvider } from "@/services/api";

export function AuthTokenProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  const initialized = useRef(false);

  // Set the token provider synchronously on first render so it's
  // available before any child useEffect fires an API call.
  if (!initialized.current) {
    initialized.current = true;
    setTokenProvider(() => getToken());
  }

  // Keep the provider in sync when getToken identity changes.
  useEffect(() => {
    setTokenProvider(() => getToken());
  }, [getToken]);

  return <>{children}</>;
}
