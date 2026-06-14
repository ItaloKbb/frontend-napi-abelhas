import { Badge } from "@/components/atoms";
import type { Amostra } from "@/types";
import { StatusAmostra } from "@/constants";
import { formatDate } from "@/utils";

const statusVariant: Record<
  StatusAmostra,
  "info" | "warning" | "success" | "error"
> = {
  [StatusAmostra.PENDENTE]: "warning",
  [StatusAmostra.EM_ANALISE]: "info",
  [StatusAmostra.CONCLUIDA]: "success",
  [StatusAmostra.REJEITADA]: "error",
};

const statusLabel: Record<StatusAmostra, string> = {
  [StatusAmostra.PENDENTE]: "Pendente",
  [StatusAmostra.EM_ANALISE]: "Em Análise",
  [StatusAmostra.CONCLUIDA]: "Concluída",
  [StatusAmostra.REJEITADA]: "Rejeitada",
};

interface AmostraTableProps {
  amostras: Amostra[];
  onSelect?: (amostra: Amostra) => void;
}

export function AmostraTable({ amostras = [], onSelect }: AmostraTableProps) {
  if (amostras.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <div className="size-16 rounded-full bg-base-200 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-8 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <p className="font-medium text-base-content/50">Nenhuma amostra encontrada</p>
        <p className="text-sm text-base-content/30">Tente ajustar os filtros de busca.</p>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="bg-base-200/60">
              <th className="text-xs uppercase tracking-wider font-semibold text-base-content/70">Nome</th>
              <th className="text-xs uppercase tracking-wider font-semibold text-base-content/70">Tipo</th>
              <th className="text-xs uppercase tracking-wider font-semibold text-base-content/70">Produtor</th>
              <th className="text-xs uppercase tracking-wider font-semibold text-base-content/70">Data Coleta</th>
              <th className="text-xs uppercase tracking-wider font-semibold text-base-content/70">Status</th>
            </tr>
          </thead>
          <tbody>
            {amostras.map((amostra) => (
              <tr
                key={amostra.id}
                className={`hover:bg-base-200/30 transition-colors ${onSelect ? "cursor-pointer" : ""}`}
                onClick={() => onSelect?.(amostra)}
              >
                <td className="font-mono">{amostra.nome}</td>
                <td>{amostra.tipoAmostra?.nome ?? amostra.tipoAmostraId}</td>
                <td>{amostra.produtor?.nome ?? amostra.produtorId}</td>
                <td>{formatDate(amostra.dataColeta)}</td>
                <td>
                  <Badge
                    label={statusLabel[amostra.status]}
                    variant={statusVariant[amostra.status]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
