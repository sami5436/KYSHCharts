"use client";

import { INDICATOR_LABELS, LEVEL_LABELS } from "@/lib/constants";
import type { IndicatorKey, LevelKey, Settings } from "@/lib/types";

type Props = {
  settings: Settings;
  onChange: (s: Settings) => void;
  onClose: () => void;
};

function Row({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center min-h-9 px-3 py-2 k-hover text-left"
    >
      <span
        className={`inline-block w-3 h-3 mr-3 shrink-0 k-border ${checked ? "bg-accent" : "bg-bg"}`}
        aria-hidden
      />
      <span className="flex-1 break-words pr-2">{label}</span>
      <span className="k-label shrink-0">{checked ? "on" : "off"}</span>
    </button>
  );
}

export function SettingsPanel({ settings, onChange, onClose }: Props) {
  const setIndicator = (k: IndicatorKey) =>
    onChange({
      ...settings,
      indicators: { ...settings.indicators, [k]: !settings.indicators[k] },
    });
  const setLevel = (k: LevelKey) =>
    onChange({
      ...settings,
      levels: { ...settings.levels, [k]: !settings.levels[k] },
    });

  return (
    <div
      className="absolute right-0 top-full z-30 w-72 max-w-[calc(100vw-0.5rem)] max-h-[calc(100dvh-6rem)] overflow-y-auto bg-bg k-border"
    >
      <div className="flex items-center justify-between px-3 h-8 k-border-b sticky top-0 bg-bg">
        <span className="k-label">indicators</span>
        <button type="button" onClick={onClose} className="k-label k-hover px-2 py-1">
          close
        </button>
      </div>
      {(Object.keys(INDICATOR_LABELS) as IndicatorKey[]).map((k) => (
        <Row
          key={k}
          label={INDICATOR_LABELS[k]}
          checked={settings.indicators[k]}
          onToggle={() => setIndicator(k)}
        />
      ))}
      <div className="px-3 h-8 k-border-b k-border-t flex items-center sticky top-8 bg-bg">
        <span className="k-label">key levels</span>
      </div>
      {(Object.keys(LEVEL_LABELS) as LevelKey[]).map((k) => (
        <Row
          key={k}
          label={LEVEL_LABELS[k]}
          checked={settings.levels[k]}
          onToggle={() => setLevel(k)}
        />
      ))}
    </div>
  );
}
