import { Sidebar } from "@/components/organisms";
import { AuthTokenProvider } from "@/providers";

interface DashboardTemplateProps {
  children: React.ReactNode;
}

export function DashboardTemplate({ children }: DashboardTemplateProps) {
  return (
    <AuthTokenProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 bg-base-100">{children}</main>
      </div>
    </AuthTokenProvider>
  );
}
