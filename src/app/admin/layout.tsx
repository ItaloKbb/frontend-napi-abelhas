import { DashboardTemplate } from "@/components/templates";

export const metadata = { title: "Admin – NAPI Abelhas" };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardTemplate>{children}</DashboardTemplate>;
}
