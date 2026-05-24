"use client";

import type { ComputedLevel } from "@/lib/types";

type Props = {
  levels: ComputedLevel[];
};

function fmt(n: number) {
  if (n >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (n >= 1) return n.toFixed(2);
  return n.toPrecision(4);
}

export function LevelReadout({ levels }: Props) {
  return (
    <div className="k-border-t flex items-stretch h-9 shrink-0 overflow-x-auto">
      <div className="px-3 flex items-center k-border-r shrink-0">
        <span className="k-label">levels</span>
      </div>
      {levels.length === 0 ? (
        <div className="px-3 flex items-center text-muted">none enabled</div>
      ) : (
        levels.map((l) => (
          <div key={l.key} className="px-3 flex items-center k-border-r shrink-0">
            <span className="k-label mr-2">{l.label}</span>
            <span className="text-fg k-tabular">{fmt(l.value)}</span>
          </div>
        ))
      )}
      <div className="flex-1" />
    </div>
  );
}
