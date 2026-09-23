import Link from "next/link";
import { Show } from "@clerk/nextjs";
import { BeeMascot, BrandLogo } from "@/components/atoms/BrandAssets";
import { ROUTES } from "@/constants";

export default function Home() {
  return <div className="hero min-h-screen overflow-hidden bg-base-200"><div className="hero-content px-4 text-center"><div className="max-w-lg"><BeeMascot decorative priority className="mx-auto -mb-5 w-36 sm:w-44" /><BrandLogo priority className="justify-center [&>img]:h-20 [&>img]:w-28 [&>span]:text-3xl sm:[&>span]:text-5xl" /><p className="py-6 text-base-content/70">Sistema de Gestão de Amostras Apícolas. Controle de qualidade para mel, própolis, geleia real e outros produtos.</p><div className="flex justify-center gap-3"><Show when="signed-out"><Link href={ROUTES.LOGIN} className="btn btn-primary">Entrar</Link></Show><Show when="signed-in"><Link href={ROUTES.AMOSTRAS} className="btn btn-primary">Ir para o Painel</Link></Show></div></div></div></div>;
}
