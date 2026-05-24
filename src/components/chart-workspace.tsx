"use client";

import { useState } from "react";
import { DEFAULT_SYMBOL, DEFAULT_TIMEFRAME } from "@/lib/constants";
import { useSettings } from "@/lib/hooks/use-settings";
import type { ComputedLevel, SymbolEntry, Timeframe } from "@/lib/types";
import { ChartPlaceholder } from "./chart-placeholder";
import { LevelReadout } from "./level-readout";
import { SearchBar } from "./search-bar";
import { SettingsPanel } from "./settings-panel";
import { TimeframeBar } from "./timeframe-bar";
import { TopBar } from "./top-bar";

export function ChartWorkspace() {
  const [symbol, setSymbol] = useState<SymbolEntry>(DEFAULT_SYMBOL);
  const [timeframe, setTimeframe] = useState<Timeframe>(DEFAULT_TIMEFRAME);
  const [settings, setSettings] = useSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const lastPrice: number | null = null;
  const levels: ComputedLevel[] = [];

  return (
    <div className="flex flex-col flex-1 min-h-0 relative">
      <TopBar
        symbol={symbol}
        timeframe={timeframe}
        lastPrice={lastPrice}
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
      <ChartPlaceholder settings={settings} />
      <LevelReadout levels={levels} />
      <TimeframeBar value={timeframe} onChange={setTimeframe} />
    </div>
  );
}
