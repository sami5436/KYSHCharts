import type { Candle, Market, SymbolEntry, Timeframe } from "../types";
import { fetchBinanceCandles, searchBinance } from "./binance";
import { fetchYahooCandles, searchYahoo } from "./yahoo";

export async function fetchCandles(
  market: Market,
  symbol: string,
  timeframe: Timeframe,
): Promise<Candle[]> {
  if (market === "crypto") return fetchBinanceCandles(symbol, timeframe);
  return fetchYahooCandles(symbol, timeframe);
}

export async function searchSymbols(query: string): Promise<SymbolEntry[]> {
  const [crypto, stocks] = await Promise.all([
    searchBinance(query, 6).catch(() => []),
    searchYahoo(query, 6).catch(() => []),
  ]);
  return [...crypto, ...stocks];
}
