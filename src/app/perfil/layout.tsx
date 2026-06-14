import { DashboardTemplate } from "@/components/templates";

export const metadata = { title: "Meu Perfil – NAPI Abelhas" };

export default function PerfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardTemplate>{children}</DashboardTemplate>;
}
