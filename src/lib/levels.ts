import type { Candle, ComputedLevel, Market, Settings } from "./types";

function dayKey(timeSec: number): string {
  const d = new Date(timeSec * 1000);
  return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
}

function groupByDay(candles: Candle[]): Map<string, Candle[]> {
  const m = new Map<string, Candle[]>();
  for (const c of candles) {
    const k = dayKey(c.time);
    const list = m.get(k);
    if (list) list.push(c);
    else m.set(k, [c]);
  }
  return m;
}

function nyc(timeSec: number): { y: number; m: number; d: number; h: number; min: number } {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(new Date(timeSec * 1000));
  const get = (t: string) => parseInt(parts.find((p) => p.type === t)!.value, 10);
  return { y: get("year"), m: get("month"), d: get("day"), h: get("hour"), min: get("minute") };
}

export function computeLevels(
  candles: Candle[],
  market: Market,
  settings: Settings,
): ComputedLevel[] {
  if (candles.length === 0) return [];
  const out: ComputedLevel[] = [];
  const byDay = groupByDay(candles);
  const dayKeys = [...byDay.keys()];
  const lastKey = dayKeys[dayKeys.length - 1];
  const prevKey = dayKeys[dayKeys.length - 2];

  if (prevKey) {
    const prev = byDay.get(prevKey)!;
    if (settings.levels.pdh) {
      out.push({ key: "pdh", label: "PDH", value: Math.max(...prev.map((c) => c.high)) });
    }
    if (settings.levels.pdl) {
      out.push({ key: "pdl", label: "PDL", value: Math.min(...prev.map((c) => c.low)) });
    }
  }

  if (settings.levels.pwh || settings.levels.pwl) {
    const lastTime = candles[candles.length - 1].time;
    const lastDate = new Date(lastTime * 1000);
    const dow = lastDate.getUTCDay();
    const startOfWeek = lastTime - dow * 86400;
    const startOfPrevWeek = startOfWeek - 7 * 86400;
    const prevWeek = candles.filter((c) => c.time >= startOfPrevWeek && c.time < startOfWeek);
    if (prevWeek.length > 0) {
      if (settings.levels.pwh) {
        out.push({ key: "pwh", label: "PWH", value: Math.max(...prevWeek.map((c) => c.high)) });
      }
      if (settings.levels.pwl) {
        out.push({ key: "pwl", label: "PWL", value: Math.min(...prevWeek.map((c) => c.low)) });
      }
    }
  }

  if (market === "stocks" && lastKey && (settings.levels.pmh || settings.levels.pml)) {
    const today = byDay.get(lastKey)!;
    const premarket = today.filter((c) => {
      const nyt = nyc(c.time);
      const minutes = nyt.h * 60 + nyt.min;
      return minutes >= 4 * 60 && minutes < 9 * 60 + 30;
    });
    if (premarket.length > 0) {
      if (settings.levels.pmh) {
        out.push({ key: "pmh", label: "PMH", value: Math.max(...premarket.map((c) => c.high)) });
      }
      if (settings.levels.pml) {
        out.push({ key: "pml", label: "PML", value: Math.min(...premarket.map((c) => c.low)) });
      }
    }
  }

  if (settings.levels.round) {
    const last = candles[candles.length - 1].close;
    const mag = Math.pow(10, Math.floor(Math.log10(last)));
    const step = mag / 2;
    const lower = Math.floor(last / step) * step;
    const upper = lower + step;
    out.push({ key: "round-l", label: "Round", value: lower });
    out.push({ key: "round-u", label: "Round", value: upper });
  }

  return out;
}
