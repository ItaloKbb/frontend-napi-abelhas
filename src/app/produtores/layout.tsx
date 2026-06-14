import { DashboardTemplate } from "@/components/templates";

export const metadata = { title: "Produtores – NAPI Abelhas" };

export default function ProdutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardTemplate>{children}</DashboardTemplate>;
}
