"use client";

import { useOrganization } from "@clerk/nextjs";
import { useEffect, useState } from "react";

interface OrgMember {
  id: string;
  role: string;
  publicUserData: {
    userId: string;
    identifier: string;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string;
  };
}

const roleLabels: Record<string, string> = {
  "org:admin": "Admin",
  "org:member": "Membro",
};

export default function UsuariosAdminPage() {
  const { organization, membership, isLoaded } = useOrganization();
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!organization) return;
    organization
      .getMemberships()
      .then((res) => setMembers(res.data as unknown as OrgMember[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [organization]);

  if (!isLoaded || loading) {
    return (
      <div className="flex flex-col items-center gap-2 py-16">
        <span className="loading loading-spinner loading-lg text-primary" />
        <span className="text-sm text-base-content/40">Carregando…</span>
      </div>
    );
  }

  if (membership?.role !== "org:admin") {
    return (
      <div role="alert" className="alert alert-error shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>Acesso negado.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Usuários da Organização</h1>
        <span className="badge badge-info">{members.length} membros</span>
      </div>

      <div className="card bg-base-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200/60">
                <th className="text-xs uppercase tracking-wider font-semibold text-base-content/70">Usuário</th>
                <th className="text-xs uppercase tracking-wider font-semibold text-base-content/70">E-mail</th>
                <th className="text-xs uppercase tracking-wider font-semibold text-base-content/70">Cargo</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-base-200/30 transition-colors">
                  <td className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-8 rounded-full">
                        <img
                          src={m.publicUserData.imageUrl}
                          alt={m.publicUserData.firstName ?? ""}
                        />
                      </div>
                    </div>
                    <span>
                      {[
                        m.publicUserData.firstName,
                        m.publicUserData.lastName,
                      ]
                        .filter(Boolean)
                        .join(" ") || "—"}
                    </span>
                  </td>
                  <td>{m.publicUserData.identifier}</td>
                  <td>
                    <span
                      className={`badge badge-sm ${
                        m.role === "org:admin"
                          ? "badge-primary"
                          : "badge-ghost"
                      }`}
                    >
                      {roleLabels[m.role] ?? m.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
