"use client";

import type { Settings } from "@/lib/types";

type Props = {
  settings: Settings;
};

export function ChartPlaceholder({ settings }: Props) {
  const oscillators: string[] = [];
  if (settings.indicators.rsi) oscillators.push("RSI");
  if (settings.indicators.macd) oscillators.push("MACD");

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 k-border-b flex items-center justify-center text-muted relative">
        <div className="absolute top-2 left-3 k-label">candles · awaiting data</div>
        <span>[ chart will render here ]</span>
      </div>
      {oscillators.map((name) => (
        <div
          key={name}
          className="h-28 k-border-b flex items-center justify-center text-muted relative"
        >
          <div className="absolute top-2 left-3 k-label">{name}</div>
          <span>[ {name} panel ]</span>
        </div>
      ))}
    </div>
  );
}
