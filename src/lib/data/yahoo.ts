import YahooFinance from "yahoo-finance2";
import type { Candle, SymbolEntry, Timeframe } from "../types";

const yahoo = new YahooFinance({
  suppressNotices: ["yahooSurvey", "ripHistorical"],
});

type YahooInterval =
  | "1m"
  | "2m"
  | "5m"
  | "15m"
  | "30m"
  | "60m"
  | "90m"
  | "1h"
  | "1d"
  | "5d"
  | "1wk"
  | "1mo";

const YAHOO_INTERVAL: Record<Timeframe, YahooInterval> = {
  "1m": "1m",
  "5m": "5m",
  "15m": "15m",
  "1h": "60m",
  "4h": "60m",
  "1D": "1d",
  "1W": "1wk",
};

const RANGE_SECONDS: Record<Timeframe, number> = {
  "1m": 5 * 86400,
  "5m": 30 * 86400,
  "15m": 60 * 86400,
  "1h": 180 * 86400,
  "4h": 365 * 86400,
  "1D": 5 * 365 * 86400,
  "1W": 10 * 365 * 86400,
};

function aggregate4h(candles: Candle[]): Candle[] {
  if (candles.length === 0) return [];
  const bucket = 4 * 60 * 60;
  const out: Candle[] = [];
  let cur: Candle | null = null;
  for (const c of candles) {
    const start = Math.floor(c.time / bucket) * bucket;
    if (!cur || cur.time !== start) {
      if (cur) out.push(cur);
      cur = { time: start, open: c.open, high: c.high, low: c.low, close: c.close, volume: c.volume };
    } else {
      cur.high = Math.max(cur.high, c.high);
      cur.low = Math.min(cur.low, c.low);
      cur.close = c.close;
      cur.volume += c.volume;
    }
  }
  if (cur) out.push(cur);
  return out;
}

export async function fetchYahooCandles(
  symbol: string,
  timeframe: Timeframe,
): Promise<Candle[]> {
  const interval = YAHOO_INTERVAL[timeframe];
  const period2 = new Date();
  const period1 = new Date(period2.getTime() - RANGE_SECONDS[timeframe] * 1000);
  const res = await yahoo.chart(symbol, {
    period1,
    period2,
    interval,
    includePrePost: true,
    return: "array",
  });
  const candles: Candle[] = [];
  for (const q of res.quotes) {
    if (q.open == null || q.high == null || q.low == null || q.close == null || !q.date) {
      continue;
    }
    candles.push({
      time: Math.floor(new Date(q.date).getTime() / 1000),
      open: q.open,
      high: q.high,
      low: q.low,
      close: q.close,
      volume: q.volume ?? 0,
    });
  }
  return timeframe === "4h" ? aggregate4h(candles) : candles;
}

export async function searchYahoo(query: string, limit = 8): Promise<SymbolEntry[]> {
  const q = query.trim();
  if (!q) return [];
  try {
    const res = await yahoo.search(q, { quotesCount: limit * 2, newsCount: 0 });
    const out: SymbolEntry[] = [];
    for (const raw of res.quotes ?? []) {
      const r = raw as Record<string, unknown>;
      const symbol = typeof r.symbol === "string" ? r.symbol : null;
      if (!symbol) continue;
      if (r.quoteType === "CRYPTOCURRENCY") continue;
      const name =
        (typeof r.shortname === "string" && r.shortname) ||
        (typeof r.longname === "string" && r.longname) ||
        symbol;
      const exchange = typeof r.exchange === "string" ? r.exchange : undefined;
      out.push({
        symbol,
        display: symbol,
        name,
        market: "stocks",
        exchange,
      });
      if (out.length >= limit) break;
    }
    return out;
  } catch {
    return [];
  }
}
