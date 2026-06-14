import { DashboardTemplate } from "@/components/templates";

export const metadata = { title: "Amostras – NAPI Abelhas" };

export default function AmostraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardTemplate>{children}</DashboardTemplate>;
}
