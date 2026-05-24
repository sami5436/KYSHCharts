"use client";

import { TIMEFRAMES } from "@/lib/constants";
import type { Timeframe } from "@/lib/types";

type Props = {
  value: Timeframe;
  onChange: (t: Timeframe) => void;
};

export function TimeframeBar({ value, onChange }: Props) {
  return (
    <div className="k-border-t flex items-stretch h-9 shrink-0">
      <div className="px-3 flex items-center k-border-r">
        <span className="k-label">timeframe</span>
      </div>
      {TIMEFRAMES.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={`px-4 k-border-r k-hover ${value === t ? "k-active" : ""}`}
        >
          {t}
        </button>
      ))}
      <div className="flex-1" />
    </div>
  );
}
