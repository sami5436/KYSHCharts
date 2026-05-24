import type { Candle, SymbolEntry, Timeframe } from "../types";

const BINANCE_BASE = "https://api.binance.us";

const BINANCE_INTERVALS: Record<Timeframe, string> = {
  "1m": "1m",
  "5m": "5m",
  "15m": "15m",
  "1h": "1h",
  "4h": "4h",
  "1D": "1d",
  "1W": "1w",
};

type BinanceKline = [
  number, // open time (ms)
  string, // open
  string, // high
  string, // low
  string, // close
  string, // volume
  number, // close time (ms)
  string, // quote volume
  number, // trades
  string, // taker buy base
  string, // taker buy quote
  string, // ignore
];

export async function fetchBinanceCandles(
  symbol: string,
  timeframe: Timeframe,
  limit = 500,
): Promise<Candle[]> {
  const url = new URL(`${BINANCE_BASE}/api/v3/klines`);
  url.searchParams.set("symbol", symbol.toUpperCase());
  url.searchParams.set("interval", BINANCE_INTERVALS[timeframe]);
  url.searchParams.set("limit", String(Math.min(limit, 1000)));
  const res = await fetch(url, { next: { revalidate: 15 } });
  if (!res.ok) throw new Error(`binance ${res.status}`);
  const rows = (await res.json()) as BinanceKline[];
  return rows.map((r) => ({
    time: Math.floor(r[0] / 1000),
    open: parseFloat(r[1]),
    high: parseFloat(r[2]),
    low: parseFloat(r[3]),
    close: parseFloat(r[4]),
    volume: parseFloat(r[5]),
  }));
}

type ExchangeSymbol = {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  status: string;
  isSpotTradingAllowed: boolean;
};

let symbolCache: SymbolEntry[] | null = null;
let symbolCacheAt = 0;
const SYMBOL_TTL = 6 * 60 * 60 * 1000;

async function loadSymbols(): Promise<SymbolEntry[]> {
  const now = Date.now();
  if (symbolCache && now - symbolCacheAt < SYMBOL_TTL) return symbolCache;
  const res = await fetch(`${BINANCE_BASE}/api/v3/exchangeInfo`, {
    next: { revalidate: 21600 },
  });
  if (!res.ok) throw new Error(`binance exchangeInfo ${res.status}`);
  const data = (await res.json()) as { symbols: ExchangeSymbol[] };
  const entries: SymbolEntry[] = data.symbols
    .filter((s) => s.status === "TRADING" && s.isSpotTradingAllowed)
    .map((s) => ({
      symbol: s.symbol,
      display: s.symbol,
      name: `${s.baseAsset} / ${s.quoteAsset}`,
      market: "crypto" as const,
      exchange: "binance",
    }));
  symbolCache = entries;
  symbolCacheAt = now;
  return entries;
}

export async function searchBinance(query: string, limit = 8): Promise<SymbolEntry[]> {
  const q = query.trim().toUpperCase();
  if (!q) return [];
  const all = await loadSymbols();
  const exact: SymbolEntry[] = [];
  const startsWith: SymbolEntry[] = [];
  const contains: SymbolEntry[] = [];
  for (const e of all) {
    if (e.symbol === q) exact.push(e);
    else if (e.symbol.startsWith(q)) startsWith.push(e);
    else if (e.symbol.includes(q) || e.name.toUpperCase().includes(q)) contains.push(e);
    if (exact.length + startsWith.length + contains.length >= limit * 3) break;
  }
  const priority = (s: SymbolEntry) => {
    if (s.symbol.endsWith("USDT")) return 0;
    if (s.symbol.endsWith("USD")) return 1;
    if (s.symbol.endsWith("USDC")) return 2;
    if (s.symbol.endsWith("BTC")) return 3;
    return 4;
  };
  const sort = (a: SymbolEntry, b: SymbolEntry) => priority(a) - priority(b);
  return [...exact, ...startsWith.sort(sort), ...contains.sort(sort)].slice(0, limit);
}
