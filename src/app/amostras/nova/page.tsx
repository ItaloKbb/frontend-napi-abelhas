"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/atoms";
import { SearchableSelect } from "@/components/atoms/SearchableSelect";
import { amostrasService, type CreateAmostraPayload } from "@/services/amostras-service";
import { pontosColetaService } from "@/services/pontos-coleta-service";
import { abelhasService } from "@/services/abelhas-service";
import { produtoresService } from "@/services/produtores-service";
import { tiposAmostraService } from "@/services/tipos-amostra-service";
import type { PontoColeta, Abelha, Produtor, TipoAmostra } from "@/types";
import { ROUTES } from "@/constants";

type Draft = CreateAmostraPayload & { key: string; error?: string };
const blank = { nome: "", dataColeta: "", pontoColetaId: "", abelhaId: "", produtorId: "", tipoAmostraId: "" };
const messageOf = (error: unknown) => error instanceof Error ? error.message : typeof error === "object" && error && "message" in error ? String(error.message) : "Não foi possível gravar este registro.";

export default function NovaAmostraPage() {
  const router = useRouter();
  const [form, setForm] = useState<CreateAmostraPayload>(blank);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [pontos, setPontos] = useState<PontoColeta[]>([]);
  const [abelhas, setAbelhas] = useState<Abelha[]>([]);
  const [produtores, setProdutores] = useState<Produtor[]>([]);
  const [tipos, setTipos] = useState<TipoAmostra[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { (async () => {
    try {
      const [pc, ab, pr, ta] = await Promise.all([pontosColetaService.list({ pageSize: 200 }), abelhasService.list({ pageSize: 200 }), produtoresService.list({ pageSize: 200 }), tiposAmostraService.list({ pageSize: 200 })]);
      setPontos(pc); setAbelhas(ab); setProdutores(pr); setTipos(ta);
    } catch { setError("Erro ao carregar opções do formulário."); } finally { setLoadingOptions(false); }
  })(); }, []);

  const set = (field: keyof CreateAmostraPayload, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const label = <T extends { id: string }>(items: T[], id: string, render: (item: T) => string) => { const item = items.find((entry) => entry.id === id); return item ? render(item) : "—"; };

  function register(event: FormEvent) {
    event.preventDefault(); setError(null);
    if (Object.values(form).some((value) => !value.trim())) return setError("Preencha todos os campos antes de registrar na lista.");
    setDrafts((current) => [...current, { ...form, key: crypto.randomUUID() }]); setForm(blank);
  }

  async function saveAll() {
    if (!drafts.length) return;
    setSaving(true); setError(null);
    const failed: Draft[] = [];
    for (const draft of drafts) {
      try { const { key: _, error: __, ...payload } = draft; await amostrasService.create(payload); }
      catch (cause) { failed.push({ ...draft, error: messageOf(cause) }); }
    }
    setDrafts(failed); setSaving(false);
    if (!failed.length) router.push(ROUTES.AMOSTRAS); else setError(`${drafts.length - failed.length} registro(s) gravado(s). ${failed.length} permaneceram na lista com erro.`);
  }

  if (loadingOptions) return <div className="flex flex-col items-center gap-2 py-16"><span className="loading loading-spinner loading-lg text-primary" /><span className="text-sm text-base-content/40">Carregando opções…</span></div>;

  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">Cadastro em lote</p><h1 className="text-2xl font-bold tracking-tight">Novas amostras</h1><p className="mt-1 text-sm text-base-content/55">Preencha, registre na lista e grave tudo quando estiver pronto.</p></div><Button variant="ghost" onClick={() => router.push(ROUTES.AMOSTRAS)}>Voltar</Button></div>
    {error && <div role="alert" className="alert alert-warning"><span>{error}</span><button className="btn btn-ghost btn-xs" onClick={() => setError(null)}>✕</button></div>}
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(20rem,0.8fr)_minmax(34rem,1.2fr)]">
      <section className="card border border-base-300 bg-base-100 shadow-sm xl:sticky xl:top-6"><div className="card-body p-4 sm:p-6"><div><h2 className="card-title">Dados da amostra</h2><p className="text-sm text-base-content/50">Os dados ficam apenas na lista até você gravar.</p></div>
        <form onSubmit={register} className="mt-2 grid gap-3">
          <Input label="Nome" placeholder="Nome da amostra" required value={form.nome} onChange={(e) => set("nome", e.target.value)} />
          <Input label="Data de coleta" type="date" required value={form.dataColeta} onChange={(e) => set("dataColeta", e.target.value)} />
          <SearchableSelect label="Tipo de amostra" required options={tipos.map((item) => ({ value: item.id, label: item.nome }))} value={form.tipoAmostraId} onChange={(value) => set("tipoAmostraId", value)} />
          <SearchableSelect label="Abelha" required options={abelhas.map((item) => ({ value: item.id, label: `${item.nomeCientifico}${item.nomePopular ? ` (${item.nomePopular})` : ""}` }))} value={form.abelhaId} onChange={(value) => set("abelhaId", value)} />
          <SearchableSelect label="Produtor" required options={produtores.map((item) => ({ value: item.id, label: item.nome }))} value={form.produtorId} onChange={(value) => set("produtorId", value)} />
          <SearchableSelect label="Ponto de coleta" required options={pontos.map((item) => ({ value: item.id, label: `${item.nome}${item.cidade ? ` — ${item.cidade.cidade}/${item.cidade.estado}` : ""}` }))} value={form.pontoColetaId} onChange={(value) => set("pontoColetaId", value)} />
          <div className="mt-2 grid grid-cols-2 gap-2"><Button type="button" variant="ghost" onClick={() => { setForm(blank); setError(null); }}>Limpar</Button><Button type="submit">Registrar</Button></div>
        </form>
      </div></section>
      <section className="card min-w-0 border border-base-300 bg-base-100 shadow-sm"><div className="card-body p-0"><div className="flex items-center justify-between gap-3 border-b border-base-300 p-4 sm:p-6"><div><h2 className="font-bold">Amostras a gravar</h2><p className="text-sm text-base-content/50">{drafts.length} {drafts.length === 1 ? "registro" : "registros"} na lista</p></div><span className="badge badge-primary badge-lg">{drafts.length}</span></div>
        {!drafts.length ? <div className="grid min-h-72 place-items-center p-8 text-center"><div><div className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-base-200 text-2xl">＋</div><p className="font-semibold">A lista está vazia</p><p className="mt-1 text-sm text-base-content/50">Use o formulário ao lado para registrar amostras.</p></div></div> : <div className="overflow-x-auto"><table className="table"><thead><tr><th>Amostra</th><th>Tipo / Abelha</th><th>Produtor / Local</th><th>Coleta</th><th className="w-12" /></tr></thead><tbody>{drafts.map((item) => <tr key={item.key} className={item.error ? "bg-error/5" : ""}><td><div className="font-semibold">{item.nome}</div>{item.error && <div className="mt-1 max-w-48 text-xs text-error">{item.error}</div>}</td><td><div>{label(tipos,item.tipoAmostraId,x=>x.nome)}</div><div className="text-xs italic text-base-content/50">{label(abelhas,item.abelhaId,x=>x.nomeCientifico)}</div></td><td><div>{label(produtores,item.produtorId,x=>x.nome)}</div><div className="text-xs text-base-content/50">{label(pontos,item.pontoColetaId,x=>x.nome)}</div></td><td className="whitespace-nowrap">{new Date(`${item.dataColeta}T12:00:00`).toLocaleDateString("pt-BR")}</td><td><button className="btn btn-ghost btn-square btn-sm text-error" aria-label={`Remover ${item.nome}`} disabled={saving} onClick={() => setDrafts((current) => current.filter((draft) => draft.key !== item.key))}>✕</button></td></tr>)}</tbody></table></div>}
        <div className="flex flex-col gap-2 border-t border-base-300 p-4 sm:flex-row sm:justify-between sm:p-6"><Button type="button" variant="ghost" disabled={!drafts.length || saving} onClick={() => setDrafts([])}>Limpar lista</Button><Button type="button" loading={saving} disabled={!drafts.length} onClick={saveAll}>Gravar {drafts.length || ""} {drafts.length === 1 ? "amostra" : "amostras"}</Button></div>
      </div></section>
    </div>
  </div>;
}
