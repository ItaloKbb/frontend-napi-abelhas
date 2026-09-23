import Image from "next/image";

type BrandLogoProps = { compact?: boolean; className?: string; priority?: boolean };

export function BrandLogo({ compact = false, className = "", priority = false }: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`.trim()}>
      <Image src="/logo.png" alt="" width={96} height={64} priority={priority} className={`${compact ? "h-9 w-12" : "h-11 w-16"} shrink-0 object-contain`} />
      <span className={compact ? "text-lg font-bold tracking-tight" : "text-xl font-bold tracking-tight"}>NAPI Abelhas</span>
    </span>
  );
}

type BeeMascotProps = { className?: string; decorative?: boolean; priority?: boolean };

export function BeeMascot({ className = "", decorative = false, priority = false }: BeeMascotProps) {
  return <Image src="/bee.gif" alt={decorative ? "" : "Abelha mascote do NAPI Abelhas"} aria-hidden={decorative || undefined} width={400} height={340} priority={priority} unoptimized className={`object-contain ${className}`.trim()} />;
}
