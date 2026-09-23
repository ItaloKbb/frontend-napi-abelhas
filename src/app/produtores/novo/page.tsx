"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/atoms";
import { SearchableSelect } from "@/components/atoms/SearchableSelect";
import { produtoresService, type CreateProdutorPayload } from "@/services/produtores-service";
import { cidadesIbgeService } from "@/services/cidades-ibge-service";
import type { CidadeIBGE } from "@/types";
import { ROUTES } from "@/constants";

type Draft = CreateProdutorPayload & { key: string; error?: string };
const blank: CreateProdutorPayload = { nome: "", cidadeId: undefined };
const messageOf = (error: unknown) => error instanceof Error ? error.message : typeof error === "object" && error && "message" in error ? String(error.message) : "Não foi possível gravar este registro.";

export default function NovoProdutorPage() {
  const router = useRouter();
  const [form, setForm] = useState<CreateProdutorPayload>(blank);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [cidades, setCidades] = useState<CidadeIBGE[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { (async () => { try { setCidades(await cidadesIbgeService.list({ pageSize: 5000 })); } catch { setError("Erro ao carregar cidades."); } finally { setLoadingOptions(false); } })(); }, []);

  function register(event: FormEvent) {
    event.preventDefault(); setError(null);
    if (!form.nome.trim()) return setError("Informe o nome do produtor antes de registrar na lista.");
    setDrafts((current) => [...current, { ...form, nome: form.nome.trim(), key: crypto.randomUUID() }]); setForm(blank);
  }

  async function saveAll() {
    if (!drafts.length) return;
    setSaving(true); setError(null);
    const failed: Draft[] = [];
    for (const draft of drafts) {
      try { const { key: _, error: __, ...payload } = draft; await produtoresService.create(payload); }
      catch (cause) { failed.push({ ...draft, error: messageOf(cause) }); }
    }
    setDrafts(failed); setSaving(false);
    if (!failed.length) router.push(ROUTES.PRODUTORES); else setError(`${drafts.length - failed.length} registro(s) gravado(s). ${failed.length} permaneceram na lista com erro.`);
  }

  const cityName = (id?: string) => { const city = cidades.find((item) => item.id === id); return city ? `${city.cidade} — ${city.estado}` : "Sem cidade informada"; };
  if (loadingOptions) return <div className="flex flex-col items-center gap-2 py-16"><span className="loading loading-spinner loading-lg text-primary" /><span className="text-sm text-base-content/40">Carregando cidades…</span></div>;

  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">Cadastro em lote</p><h1 className="text-2xl font-bold tracking-tight">Novos produtores</h1><p className="mt-1 text-sm text-base-content/55">Monte sua lista e grave todos os produtores de uma vez.</p></div><Button variant="ghost" onClick={() => router.push(ROUTES.PRODUTORES)}>Voltar</Button></div>
    {error && <div role="alert" className="alert alert-warning"><span>{error}</span><button className="btn btn-ghost btn-xs" onClick={() => setError(null)}>✕</button></div>}
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(20rem,0.8fr)_minmax(34rem,1.2fr)]">
      <section className="card border border-base-300 bg-base-100 shadow-sm xl:sticky xl:top-6"><div className="card-body p-4 sm:p-6"><div><h2 className="card-title">Dados do produtor</h2><p className="text-sm text-base-content/50">Registre quantos produtores precisar antes de gravar.</p></div>
        <form onSubmit={register} className="mt-2 grid gap-3">
          <Input label="Nome" placeholder="Nome do produtor" required value={form.nome} onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))} />
          <SearchableSelect label="Cidade (opcional)" options={cidades.map((city) => ({ value: city.id, label: `${city.cidade} — ${city.estado}` }))} value={form.cidadeId ?? ""} onChange={(value) => setForm((current) => ({ ...current, cidadeId: value || undefined }))} />
          <div className="mt-2 grid grid-cols-2 gap-2"><Button type="button" variant="ghost" onClick={() => { setForm(blank); setError(null); }}>Limpar</Button><Button type="submit">Registrar</Button></div>
        </form>
      </div></section>
      <section className="card min-w-0 border border-base-300 bg-base-100 shadow-sm"><div className="card-body p-0"><div className="flex items-center justify-between gap-3 border-b border-base-300 p-4 sm:p-6"><div><h2 className="font-bold">Produtores a gravar</h2><p className="text-sm text-base-content/50">{drafts.length} {drafts.length === 1 ? "registro" : "registros"} na lista</p></div><span className="badge badge-primary badge-lg">{drafts.length}</span></div>
        {!drafts.length ? <div className="grid min-h-72 place-items-center p-8 text-center"><div><div className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-base-200 text-2xl">＋</div><p className="font-semibold">A lista está vazia</p><p className="mt-1 text-sm text-base-content/50">Use o formulário ao lado para registrar produtores.</p></div></div> : <div className="overflow-x-auto"><table className="table"><thead><tr><th>#</th><th>Produtor</th><th>Cidade</th><th>Situação</th><th className="w-12" /></tr></thead><tbody>{drafts.map((item,index) => <tr key={item.key} className={item.error ? "bg-error/5" : ""}><td className="text-base-content/35">{String(index+1).padStart(2,"0")}</td><td className="font-semibold">{item.nome}</td><td>{cityName(item.cidadeId)}</td><td>{item.error ? <div><span className="badge badge-error badge-sm">Erro</span><p className="mt-1 max-w-56 text-xs text-error">{item.error}</p></div> : <span className="badge badge-ghost badge-sm">Pronto</span>}</td><td><button className="btn btn-ghost btn-square btn-sm text-error" aria-label={`Remover ${item.nome}`} disabled={saving} onClick={() => setDrafts((current) => current.filter((draft) => draft.key !== item.key))}>✕</button></td></tr>)}</tbody></table></div>}
        <div className="flex flex-col gap-2 border-t border-base-300 p-4 sm:flex-row sm:justify-between sm:p-6"><Button type="button" variant="ghost" disabled={!drafts.length || saving} onClick={() => setDrafts([])}>Limpar lista</Button><Button type="button" loading={saving} disabled={!drafts.length} onClick={saveAll}>Gravar {drafts.length || ""} {drafts.length === 1 ? "produtor" : "produtores"}</Button></div>
      </div></section>
    </div>
  </div>;
}
