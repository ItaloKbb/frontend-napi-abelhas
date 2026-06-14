"use client";

import {
  useUser,
  useOrganization,
  OrganizationSwitcher,
} from "@clerk/nextjs";

const roleLabels: Record<string, string> = {
  "org:admin": "Administrador",
  "org:member": "Membro",
};

export default function PerfilPage() {
  const { user, isLoaded: userLoaded } = useUser();
  const { organization, membership, isLoaded: orgLoaded } = useOrganization();

  if (!userLoaded || !orgLoaded) {
    return (
      <div className="flex flex-col items-center gap-2 py-16">
        <span className="loading loading-spinner loading-lg text-primary" />
        <span className="text-sm text-base-content/40">Carregando…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Meu Perfil</h1>

      {/* Dados do Usuário */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-lg">Informações Pessoais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-xs text-base-content/50 uppercase tracking-wider">Nome</p>
              <p className="font-medium">{user?.fullName ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-base-content/50 uppercase tracking-wider">E-mail</p>
              <p className="font-medium">
                {user?.primaryEmailAddress?.emailAddress ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-base-content/50 uppercase tracking-wider">ID</p>
              <p className="font-mono text-sm">{user?.id}</p>
            </div>
            <div>
              <p className="text-xs text-base-content/50 uppercase tracking-wider">
                Criado em
              </p>
              <p className="font-medium">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("pt-BR")
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Organização */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-lg">Organização</h2>
          {organization ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-xs text-base-content/50 uppercase tracking-wider">Nome</p>
                <p className="font-medium">{organization.name}</p>
              </div>
              <div>
                <p className="text-xs text-base-content/50 uppercase tracking-wider">Slug</p>
                <p className="font-mono text-sm">{organization.slug}</p>
              </div>
              <div>
                <p className="text-xs text-base-content/50 uppercase tracking-wider">
                  Meu Cargo
                </p>
                <span className="badge badge-primary">
                  {roleLabels[membership?.role ?? ""] ?? membership?.role}
                </span>
              </div>
              <div>
                <p className="text-xs text-base-content/50 uppercase tracking-wider">
                  ID da Org
                </p>
                <p className="font-mono text-sm">{organization.id}</p>
              </div>
            </div>
          ) : (
            <p className="text-base-content/60 mt-2">
              Você não está em nenhuma organização.
            </p>
          )}
          <div className="mt-4">
            <p className="text-xs text-base-content/50 uppercase tracking-wider mb-2">
              Trocar Organização
            </p>
            <OrganizationSwitcher
              afterSelectOrganizationUrl="/amostras"
              afterCreateOrganizationUrl="/amostras"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
