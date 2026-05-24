"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_SYMBOL, DEFAULT_TIMEFRAME } from "@/lib/constants";
import { useSettings } from "@/lib/hooks/use-settings";
import { computeLevels } from "@/lib/levels";
import type { Candle, SymbolEntry, Timeframe } from "@/lib/types";
import { Chart } from "./chart";
import { LevelReadout } from "./level-readout";
import { SearchBar } from "./search-bar";
import { SettingsPanel } from "./settings-panel";
import { TableView } from "./table-view";
import { TimeframeBar } from "./timeframe-bar";
import { TopBar } from "./top-bar";
import type { ViewMode } from "./view-toggle";

export function ChartWorkspace() {
  const [symbol, setSymbol] = useState<SymbolEntry>(DEFAULT_SYMBOL);
  const [timeframe, setTimeframe] = useState<Timeframe>(DEFAULT_TIMEFRAME);
  const [settings, setSettings] = useSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [view, setView] = useState<ViewMode>("chart");
  const [candles, setCandles] = useState<Candle[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const reqId = useRef(0);

  useEffect(() => {
    const my = ++reqId.current;
    setStatus("loading");
    setError(null);
    const url = `/api/candles?market=${symbol.market}&symbol=${encodeURIComponent(symbol.symbol)}&tf=${timeframe}`;
    fetch(url)
      .then(async (res) => {
        const json = await res.json();
        if (my !== reqId.current) return;
        if (!res.ok) {
          setError(json.error ?? "fetch failed");
          setCandles([]);
          setStatus("error");
          return;
        }
        setCandles(json.candles as Candle[]);
        setStatus("idle");
      })
      .catch((e) => {
        if (my !== reqId.current) return;
        setError(e instanceof Error ? e.message : "fetch failed");
        setCandles([]);
        setStatus("error");
      });
  }, [symbol, timeframe]);

  const levels = useMemo(
    () => computeLevels(candles, symbol.market, settings),
    [candles, symbol.market, settings],
  );

  const lastPrice = candles.length > 0 ? candles[candles.length - 1].close : null;

  return (
    <div className="flex flex-col flex-1 min-h-0 relative">
      <TopBar
        symbol={symbol}
        timeframe={timeframe}
        lastPrice={lastPrice}
        view={view}
        onViewChange={setView}
        onToggleSettings={() => setSettingsOpen((v) => !v)}
        settingsOpen={settingsOpen}
      />
      {settingsOpen && (
        <SettingsPanel
          settings={settings}
          onChange={setSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}
      <SearchBar onSelect={setSymbol} />
      <div className="flex-1 flex flex-col min-h-0 relative">
        {view === "chart" ? (
          <Chart candles={candles} settings={settings} levels={levels} />
        ) : (
          <TableView candles={candles} settings={settings} levels={levels} />
        )}
        {status === "loading" && (
          <div className="absolute top-2 left-3 k-label z-10">loading...</div>
        )}
        {status === "error" && (
          <div className="absolute top-2 left-3 text-bear z-10">error: {error}</div>
        )}
      </div>
      {view === "chart" && <LevelReadout levels={levels} />}
      <TimeframeBar value={timeframe} onChange={setTimeframe} />
    </div>
  );
}
