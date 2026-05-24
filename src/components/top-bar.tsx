"use client";

import type { SymbolEntry, Timeframe } from "@/lib/types";
import { Clock } from "./clock";
import { ViewToggle, type ViewMode } from "./view-toggle";

type Props = {
  symbol: SymbolEntry;
  timeframe: Timeframe;
  lastPrice: number | null;
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
  onToggleSettings: () => void;
  settingsOpen: boolean;
};

function formatPrice(p: number | null) {
  if (p == null) return "—";
  if (p >= 1000) return p.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (p >= 1) return p.toFixed(2);
  return p.toPrecision(4);
}

function Cell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`px-3 py-2 flex items-center k-border-r k-border-b min-w-0 ${className}`}
    >
      {children}
    </div>
  );
}

export function TopBar({
  symbol,
  timeframe,
  lastPrice,
  view,
  onViewChange,
  onToggleSettings,
  settingsOpen,
}: Props) {
  return (
    <header className="flex flex-wrap items-stretch">
      <Cell>
        <span className="text-fg">KYSH</span>
        <span className="text-muted px-2">/</span>
        <span className="text-fg">charts</span>
      </Cell>
      <Cell className="min-w-0 max-w-full">
        <span className="k-label mr-2 shrink-0">symbol</span>
        <span className="text-fg truncate">{symbol.display}</span>
      </Cell>
      <Cell>
        <span className="k-label mr-2">tf</span>
        <span className="text-fg">{timeframe}</span>
      </Cell>
      <Cell>
        <span className="k-label mr-2">market</span>
        <span className="text-fg">{symbol.market}</span>
      </Cell>
      <Cell>
        <span className="k-label mr-2">last</span>
        <span className="text-fg k-tabular">{formatPrice(lastPrice)}</span>
      </Cell>
      <div className="hidden lg:block flex-1 k-border-b" />
      <Clock />
      <button
        type="button"
        onClick={onToggleSettings}
        className={`px-4 py-2 k-border-r k-border-b k-hover ${settingsOpen ? "k-active" : ""}`}
      >
        settings
      </button>
      <ViewToggle value={view} onChange={onViewChange} />
    </header>
  );
}
