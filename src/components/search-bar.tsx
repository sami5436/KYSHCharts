"use client";

import { useEffect, useRef, useState } from "react";
import type { SymbolEntry } from "@/lib/types";

type Props = {
  onSelect: (entry: SymbolEntry) => void;
};

export function SearchBar({ onSelect }: Props) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SymbolEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const reqId = useRef(0);
  const wrap = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const my = ++reqId.current;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
        const data = (await res.json()) as { results: SymbolEntry[] };
        if (my === reqId.current) {
          setResults(data.results.slice(0, 12));
          setActive(0);
          setOpen(true);
        }
      } catch {
        if (my === reqId.current) setResults([]);
      } finally {
        if (my === reqId.current) setLoading(false);
      }
    }, 180);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function pick(e: SymbolEntry) {
    onSelect(e);
    setQ("");
    setResults([]);
    setOpen(false);
  }

  return (
    <div ref={wrap} className="k-border-b relative">
      <div className="flex items-center min-h-9 px-3 gap-2">
        <span className="text-muted shrink-0">{">"}</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          onKeyDown={(e) => {
            if (!open || !results.length) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((i) => Math.min(i + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              pick(results[active]);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder="search — btc, aapl, eth, tsla..."
          className="flex-1 min-w-0 placeholder:text-muted text-base"
        />
        <span className="k-label shrink-0">{loading ? "..." : `${results.length || 0}`}</span>
      </div>
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-20 bg-bg k-border max-h-72 overflow-y-auto">
          {results.map((r, i) => (
            <button
              key={`${r.market}:${r.symbol}`}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                pick(r);
              }}
              onMouseEnter={() => setActive(i)}
              className={`w-full text-left flex items-center gap-2 min-h-9 px-3 py-1.5 ${i === active ? "k-active" : "k-hover"}`}
            >
              <span className="shrink-0 min-w-16 truncate">{r.display}</span>
              <span className="flex-1 min-w-0 truncate text-muted">{r.name}</span>
              <span className="k-label shrink-0">{r.market}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
