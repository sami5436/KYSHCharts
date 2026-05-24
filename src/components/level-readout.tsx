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
    <div className="k-border-t flex flex-wrap items-stretch">
      <div className="px-3 py-2 flex items-center k-border-r k-border-b">
        <span className="k-label">levels</span>
      </div>
      {levels.length === 0 ? (
        <div className="px-3 py-2 flex items-center k-border-b text-muted">none enabled</div>
      ) : (
        levels.map((l, i) => (
          <div
            key={`${l.key}-${i}`}
            className="px-3 py-2 flex items-center k-border-r k-border-b"
          >
            <span className="k-label mr-2">{l.label}</span>
            <span className="text-fg k-tabular">{fmt(l.value)}</span>
          </div>
        ))
      )}
      <div className="hidden md:block flex-1 k-border-b" />
    </div>
  );
}
