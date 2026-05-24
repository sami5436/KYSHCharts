import type { IndicatorKey, LevelKey, Settings, SymbolEntry, Timeframe } from "./types";

export const TIMEFRAMES: Timeframe[] = ["1m", "5m", "15m", "1h", "4h", "1D", "1W"];

export const INDICATOR_LABELS: Record<IndicatorKey, string> = {
  sma20: "SMA 20",
  sma50: "SMA 50",
  sma200: "SMA 200",
  ema9: "EMA 9",
  ema21: "EMA 21",
  vwap: "VWAP",
  bb: "Bollinger 20/2",
  rsi: "RSI 14",
  macd: "MACD 12/26/9",
};

export const LEVEL_LABELS: Record<LevelKey, string> = {
  pdh: "Prior day high",
  pdl: "Prior day low",
  pwh: "Prior week high",
  pwl: "Prior week low",
  pmh: "Premarket high",
  pml: "Premarket low",
  round: "Round numbers",
};

export const DEFAULT_SETTINGS: Settings = {
  indicators: {
    sma20: true,
    sma50: true,
    sma200: false,
    ema9: false,
    ema21: true,
    vwap: false,
    bb: false,
    rsi: true,
    macd: false,
  },
  levels: {
    pdh: true,
    pdl: true,
    pwh: false,
    pwl: false,
    pmh: false,
    pml: false,
    round: false,
  },
};

export const DEFAULT_SYMBOL: SymbolEntry = {
  symbol: "BTCUSDT",
  display: "BTCUSDT",
  name: "Bitcoin / Tether",
  market: "crypto",
  exchange: "binance",
};

export const DEFAULT_TIMEFRAME: Timeframe = "1h";
