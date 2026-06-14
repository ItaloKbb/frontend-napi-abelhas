import Link from "next/link";
import { Show } from "@clerk/nextjs";
import { ROUTES } from "@/constants";

export default function Home() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">🍯 NAPI Abelhas</h1>
          <p className="py-6 text-base-content/70">
            Sistema de Gestão de Amostras Apícolas. Controle de qualidade para
            mel, própolis, geleia real e outros produtos.
          </p>
          <div className="flex gap-3 justify-center">
            <Show when="signed-out">
              <Link href={ROUTES.LOGIN} className="btn btn-primary">
                Entrar
              </Link>
            </Show>
            <Show when="signed-in">
              <Link href={ROUTES.AMOSTRAS} className="btn btn-primary">
                Ir para o Painel
              </Link>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}

