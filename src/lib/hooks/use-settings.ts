"use client";

import { useEffect, useState } from "react";
import { DEFAULT_SETTINGS } from "../constants";
import type { Settings } from "../types";

const STORAGE_KEY = "kysh:settings:v1";

function deepMerge(base: Settings, partial: Partial<Settings>): Settings {
  return {
    indicators: { ...base.indicators, ...(partial.indicators ?? {}) },
    levels: { ...base.levels, ...(partial.levels ?? {}) },
  };
}

export function useSettings(): [Settings, (next: Settings) => void] {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings(deepMerge(DEFAULT_SETTINGS, JSON.parse(raw)));
    } catch {
      // ignore
    }
  }, []);

  const persist = (next: Settings) => {
    setSettings(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  return [settings, persist];
}
