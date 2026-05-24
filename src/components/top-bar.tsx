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
    <header className="k-border-b flex items-stretch h-10 shrink-0 overflow-x-auto">
      <div className="px-3 flex items-center k-border-r shrink-0">
        <span className="text-fg">KYSH</span>
        <span className="text-muted px-2">/</span>
        <span className="text-fg">charts</span>
      </div>
      <div className="px-3 flex items-center k-border-r shrink-0">
        <span className="k-label mr-2">symbol</span>
        <span className="text-fg">{symbol.display}</span>
      </div>
      <div className="px-3 flex items-center k-border-r shrink-0">
        <span className="k-label mr-2">tf</span>
        <span className="text-fg">{timeframe}</span>
      </div>
      <div className="px-3 flex items-center k-border-r shrink-0">
        <span className="k-label mr-2">market</span>
        <span className="text-fg">{symbol.market}</span>
      </div>
      <div className="px-3 flex items-center k-border-r shrink-0">
        <span className="k-label mr-2">last</span>
        <span className="text-fg k-tabular">{formatPrice(lastPrice)}</span>
      </div>
      <div className="flex-1" />
      <Clock />
      <button
        type="button"
        onClick={onToggleSettings}
        className={`px-4 k-border-l k-hover shrink-0 ${settingsOpen ? "k-active" : ""}`}
      >
        settings
      </button>
      <ViewToggle value={view} onChange={onViewChange} />
    </header>
  );
}
