"use client";

import Link from "next/link";
import { TIMEFRAMES } from "@/lib/constants";
import type { Timeframe } from "@/lib/types";

type Props = {
  value: Timeframe;
  onChange: (t: Timeframe) => void;
};

export function TimeframeBar({ value, onChange }: Props) {
  return (
    <div className="k-border-t flex flex-wrap items-stretch">
      <div className="px-3 py-2 flex items-center k-border-r k-border-b">
        <span className="k-label">timeframe</span>
      </div>
      {TIMEFRAMES.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={`px-4 py-2 k-border-r k-border-b k-hover ${value === t ? "k-active" : ""}`}
        >
          {t}
        </button>
      ))}
      <div className="hidden md:block flex-1 k-border-b" />
      <Link
        href="/docs"
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 flex items-center k-border-r k-border-b k-hover"
      >
        docs
      </Link>
    </div>
  );
}
