import type { Candle } from "./types";

export type LinePoint = { time: number; value: number };
export type BandPoint = { time: number; upper: number; middle: number; lower: number };
export type MacdPoint = { time: number; macd: number; signal: number; hist: number };

export function sma(candles: Candle[], period: number): LinePoint[] {
  if (candles.length < period) return [];
  const out: LinePoint[] = [];
  let sum = 0;
  for (let i = 0; i < candles.length; i++) {
    sum += candles[i].close;
    if (i >= period) sum -= candles[i - period].close;
    if (i >= period - 1) out.push({ time: candles[i].time, value: sum / period });
  }
  return out;
}

export function ema(candles: Candle[], period: number): LinePoint[] {
  if (candles.length < period) return [];
  const k = 2 / (period + 1);
  const out: LinePoint[] = [];
  let seedSum = 0;
  for (let i = 0; i < period; i++) seedSum += candles[i].close;
  let prev = seedSum / period;
  out.push({ time: candles[period - 1].time, value: prev });
  for (let i = period; i < candles.length; i++) {
    prev = candles[i].close * k + prev * (1 - k);
    out.push({ time: candles[i].time, value: prev });
  }
  return out;
}

function emaFromValues(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
  if (values.length < period) return out;
  const k = 2 / (period + 1);
  let seedSum = 0;
  for (let i = 0; i < period; i++) seedSum += values[i];
  let prev = seedSum / period;
  out[period - 1] = prev;
  for (let i = period; i < values.length; i++) {
    prev = values[i] * k + prev * (1 - k);
    out[i] = prev;
  }
  return out;
}

export function bollinger(candles: Candle[], period = 20, mult = 2): BandPoint[] {
  if (candles.length < period) return [];
  const out: BandPoint[] = [];
  for (let i = period - 1; i < candles.length; i++) {
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) sum += candles[j].close;
    const mean = sum / period;
    let varSum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const d = candles[j].close - mean;
      varSum += d * d;
    }
    const std = Math.sqrt(varSum / period);
    out.push({
      time: candles[i].time,
      middle: mean,
      upper: mean + mult * std,
      lower: mean - mult * std,
    });
  }
  return out;
}

export function rsi(candles: Candle[], period = 14): LinePoint[] {
  if (candles.length <= period) return [];
  const gains: number[] = [];
  const losses: number[] = [];
  for (let i = 1; i < candles.length; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    gains.push(Math.max(diff, 0));
    losses.push(Math.max(-diff, 0));
  }
  let avgGain = 0;
  let avgLoss = 0;
  for (let i = 0; i < period; i++) {
    avgGain += gains[i];
    avgLoss += losses[i];
  }
  avgGain /= period;
  avgLoss /= period;
  const out: LinePoint[] = [];
  const first = candles[period];
  const rs0 = avgLoss === 0 ? 100 : avgGain / avgLoss;
  out.push({ time: first.time, value: avgLoss === 0 ? 100 : 100 - 100 / (1 + rs0) });
  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    out.push({
      time: candles[i + 1].time,
      value: avgLoss === 0 ? 100 : 100 - 100 / (1 + rs),
    });
  }
  return out;
}

export function macd(
  candles: Candle[],
  fast = 12,
  slow = 26,
  signal = 9,
): MacdPoint[] {
  if (candles.length < slow + signal) return [];
  const closes = candles.map((c) => c.close);
  const fastE = emaFromValues(closes, fast);
  const slowE = emaFromValues(closes, slow);
  const macdLine: (number | null)[] = closes.map((_, i) =>
    fastE[i] != null && slowE[i] != null ? (fastE[i] as number) - (slowE[i] as number) : null,
  );
  const firstIdx = macdLine.findIndex((v) => v != null);
  if (firstIdx < 0) return [];
  const trimmed = macdLine.slice(firstIdx).map((v) => v as number);
  const signalArr = emaFromValues(trimmed, signal);
  const out: MacdPoint[] = [];
  for (let i = 0; i < trimmed.length; i++) {
    if (signalArr[i] == null) continue;
    const t = candles[firstIdx + i].time;
    const m = trimmed[i];
    const s = signalArr[i] as number;
    out.push({ time: t, macd: m, signal: s, hist: m - s });
  }
  return out;
}

export function vwap(candles: Candle[]): LinePoint[] {
  if (candles.length === 0) return [];
  const out: LinePoint[] = [];
  let cumPV = 0;
  let cumV = 0;
  let prevDayKey = "";
  for (const c of candles) {
    const d = new Date(c.time * 1000);
    const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
    if (key !== prevDayKey) {
      cumPV = 0;
      cumV = 0;
      prevDayKey = key;
    }
    const typical = (c.high + c.low + c.close) / 3;
    cumPV += typical * c.volume;
    cumV += c.volume;
    out.push({ time: c.time, value: cumV ? cumPV / cumV : typical });
  }
  return out;
}
