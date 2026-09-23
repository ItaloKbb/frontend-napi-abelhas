"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

export type SearchableOption = { value: string; label: string };
type Props = { label: string; options: SearchableOption[]; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean; disabled?: boolean; emptyLabel?: string };
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");

export function SearchableSelect({ label, options, value, onChange, placeholder = "Digite para pesquisar…", required, disabled, emptyLabel = "Nenhum resultado encontrado" }: Props) {
  const id = useId();
  const rootRef = useRef<HTMLFieldSetElement>(null);
  const selected = options.find((option) => option.value === value);
  const [query, setQuery] = useState(selected?.label ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => { setQuery(selected?.label ?? ""); }, [selected?.label]);
  useEffect(() => {
    const close = (event: PointerEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  const filtered = useMemo(() => {
    if (!query || selected?.label === query) return options.slice(0, 50);
    const term = normalize(query);
    return options.filter((option) => normalize(option.label).includes(term)).slice(0, 50);
  }, [options, query, selected?.label]);

  function choose(option: SearchableOption) { onChange(option.value); setQuery(option.label); setOpen(false); setActive(0); }

  return <fieldset className="fieldset" ref={rootRef}>
    <legend className="fieldset-legend">{label}{required && <span className="text-error" aria-hidden="true"> *</span>}</legend>
    <div className="relative">
      <input id={id} className="input w-full pr-10" role="combobox" aria-expanded={open} aria-controls={`${id}-options`} aria-autocomplete="list" aria-activedescendant={open && filtered[active] ? `${id}-${active}` : undefined} autoComplete="off" disabled={disabled} placeholder={placeholder} value={query}
        onFocus={() => setOpen(true)}
        onChange={(event) => { setQuery(event.target.value); onChange(""); setOpen(true); setActive(0); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") { event.preventDefault(); setOpen(true); setActive((current) => Math.min(current + 1, filtered.length - 1)); }
          if (event.key === "ArrowUp") { event.preventDefault(); setActive((current) => Math.max(current - 1, 0)); }
          if (event.key === "Enter" && open && filtered[active]) { event.preventDefault(); choose(filtered[active]); }
          if (event.key === "Escape") { setOpen(false); setQuery(selected?.label ?? ""); }
        }} />
      <button type="button" tabIndex={-1} className="absolute inset-y-0 right-0 grid w-10 place-items-center text-base-content/45" onClick={() => setOpen((current) => !current)} aria-label={`Abrir opções de ${label}`} disabled={disabled}>
        <svg className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.2 7.2a.75.75 0 0 1 1.1 0l3.7 3.7 3.7-3.7a.75.75 0 1 1 1.1 1.1l-4.2 4.2a.75.75 0 0 1-1.1 0L5.2 8.3a.75.75 0 0 1 0-1.1Z" clipRule="evenodd" /></svg>
      </button>
      {open && !disabled && <ul id={`${id}-options`} role="listbox" className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-box border border-base-300 bg-base-100 p-1 shadow-xl">
        {filtered.length ? filtered.map((option, index) => <li key={option.value} id={`${id}-${index}`} role="option" aria-selected={option.value === value}>
          <button type="button" className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${index === active ? "bg-base-200" : "hover:bg-base-200"}`} onMouseEnter={() => setActive(index)} onClick={() => choose(option)}><span className="break-anywhere">{option.label}</span>{option.value === value && <span className="text-primary">✓</span>}</button>
        </li>) : <li className="px-3 py-4 text-center text-sm text-base-content/50">{emptyLabel}</li>}
      </ul>}
    </div>
  </fieldset>;
}
