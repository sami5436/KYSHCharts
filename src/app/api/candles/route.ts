import { NextResponse } from "next/server";
import { fetchCandles } from "@/lib/data";
import type { Market, Timeframe } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TIMEFRAMES: Timeframe[] = ["1m", "5m", "15m", "1h", "4h", "1D", "1W"];
const MARKETS: Market[] = ["crypto", "stocks"];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const market = url.searchParams.get("market") as Market | null;
  const symbol = url.searchParams.get("symbol");
  const timeframe = url.searchParams.get("tf") as Timeframe | null;

  if (!market || !MARKETS.includes(market)) {
    return NextResponse.json({ error: "invalid market" }, { status: 400 });
  }
  if (!symbol) {
    return NextResponse.json({ error: "missing symbol" }, { status: 400 });
  }
  if (!timeframe || !TIMEFRAMES.includes(timeframe)) {
    return NextResponse.json({ error: "invalid timeframe" }, { status: 400 });
  }

  try {
    const candles = await fetchCandles(market, symbol, timeframe);
    return NextResponse.json({ candles });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
