export type Market = "crypto" | "stocks";

export type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1D" | "1W";

export type SymbolEntry = {
  symbol: string;
  display: string;
  name: string;
  market: Market;
  exchange?: string;
};

export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type IndicatorKey =
  | "sma20"
  | "sma50"
  | "sma200"
  | "ema9"
  | "ema21"
  | "vwap"
  | "bb"
  | "rsi"
  | "macd";

export type LevelKey =
  | "pdh"
  | "pdl"
  | "pwh"
  | "pwl"
  | "pmh"
  | "pml"
  | "round";

export type Settings = {
  indicators: Record<IndicatorKey, boolean>;
  levels: Record<LevelKey, boolean>;
};

export type ComputedLevel = {
  key: LevelKey | string;
  label: string;
  value: number;
};
