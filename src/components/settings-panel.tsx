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
      className="w-full flex items-center h-8 px-3 k-hover text-left"
    >
      <span
        className={`inline-block w-3 h-3 mr-3 k-border ${checked ? "bg-accent" : "bg-bg"}`}
        aria-hidden
      />
      <span className="flex-1">{label}</span>
      <span className="k-label">{checked ? "on" : "off"}</span>
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
    <div className="absolute top-10 right-0 z-30 w-72 bg-bg k-border">
      <div className="flex items-center justify-between px-3 h-8 k-border-b">
        <span className="k-label">indicators</span>
        <button type="button" onClick={onClose} className="k-label k-hover px-2">
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
      <div className="px-3 h-8 k-border-b k-border-t flex items-center">
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
