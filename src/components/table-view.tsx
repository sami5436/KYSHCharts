"use client";

import { useMemo } from "react";
import { INDICATOR_LABELS } from "@/lib/constants";
import { bollinger, ema, macd, rsi, sma, vwap } from "@/lib/indicators";
import type { Candle, ComputedLevel, IndicatorKey, Settings } from "@/lib/types";

function fmtPrice(n: number | null | undefined): string {
  if (n == null || !isFinite(n)) return "—";
  if (Math.abs(n) >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (Math.abs(n) >= 1) return n.toFixed(2);
  return n.toPrecision(4);
}

function fmtNum(n: number | null | undefined, digits = 2): string {
  if (n == null || !isFinite(n)) return "—";
  return n.toFixed(digits);
}

function fmtVol(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(2)}K`;
  return n.toFixed(2);
}

function fmtPct(n: number | null | undefined): string {
  if (n == null || !isFinite(n)) return "—";
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

function fmtTime(t: number): string {
  const d = new Date(t * 1000);
  const date = d.toISOString().slice(0, 10);
  const time = d.toISOString().slice(11, 16);
  return `${date} ${time}`;
}

type Cell = { label: string; value: string; tone?: "muted" | "bull" | "bear" };

function Cell({ label, value, tone }: Cell) {
  const color = tone === "bull" ? "text-bull" : tone === "bear" ? "text-bear" : "text-fg";
  return (
    <div className="k-border-r k-border-b px-3 py-2 min-w-0">
      <div className="k-label truncate">{label}</div>
      <div className={`${color} k-tabular text-sm mt-1 truncate`}>{value}</div>
    </div>
  );
}

type Props = {
  candles: Candle[];
  settings: Settings;
  levels: ComputedLevel[];
};

export function TableView({ candles, settings, levels }: Props) {
  const indicatorCells = useMemo(() => {
    if (candles.length === 0) return [] as Cell[];
    const out: Cell[] = [];
    const push = (label: string, v: number | undefined) => {
      if (v != null && isFinite(v)) out.push({ label, value: fmtPrice(v) });
    };
    if (settings.indicators.sma20) push(INDICATOR_LABELS.sma20, sma(candles, 20).at(-1)?.value);
    if (settings.indicators.sma50) push(INDICATOR_LABELS.sma50, sma(candles, 50).at(-1)?.value);
    if (settings.indicators.sma200) push(INDICATOR_LABELS.sma200, sma(candles, 200).at(-1)?.value);
    if (settings.indicators.ema9) push(INDICATOR_LABELS.ema9, ema(candles, 9).at(-1)?.value);
    if (settings.indicators.ema21) push(INDICATOR_LABELS.ema21, ema(candles, 21).at(-1)?.value);
    if (settings.indicators.vwap) push(INDICATOR_LABELS.vwap, vwap(candles).at(-1)?.value);
    if (settings.indicators.bb) {
      const last = bollinger(candles, 20, 2).at(-1);
      if (last) {
        out.push({ label: "BB upper", value: fmtPrice(last.upper) });
        out.push({ label: "BB middle", value: fmtPrice(last.middle) });
        out.push({ label: "BB lower", value: fmtPrice(last.lower) });
      }
    }
    if (settings.indicators.rsi) {
      const r = rsi(candles).at(-1)?.value;
      if (r != null) {
        const tone = r >= 70 ? "bear" : r <= 30 ? "bull" : undefined;
        out.push({ label: INDICATOR_LABELS.rsi, value: fmtNum(r), tone });
      }
    }
    if (settings.indicators.macd) {
      const m = macd(candles).at(-1);
      if (m) {
        const tone = m.hist >= 0 ? "bull" : "bear";
        out.push({ label: "MACD", value: fmtPrice(m.macd) });
        out.push({ label: "MACD signal", value: fmtPrice(m.signal) });
        out.push({ label: "MACD hist", value: fmtPrice(m.hist), tone });
      }
    }
    return out;
  }, [candles, settings.indicators]);

  const overview = useMemo<Cell[]>(() => {
    if (candles.length === 0) return [];
    const last = candles[candles.length - 1];
    const prev = candles[candles.length - 2];
    const chg = prev ? ((last.close - prev.close) / prev.close) * 100 : null;
    const chgTone = chg == null ? undefined : chg >= 0 ? "bull" : "bear";
    return [
      { label: "Last", value: fmtPrice(last.close) },
      { label: "Change", value: fmtPct(chg), tone: chgTone },
      { label: "Bar high", value: fmtPrice(last.high) },
      { label: "Bar low", value: fmtPrice(last.low) },
      { label: "Bar volume", value: fmtVol(last.volume) },
      { label: "Bars", value: String(candles.length) },
    ];
  }, [candles]);

  const levelCells = useMemo<Cell[]>(() => {
    return levels.map((l) => ({ label: l.label, value: fmtPrice(l.value) }));
  }, [levels]);

  const rows = useMemo(() => {
    const slice = candles.slice(-300).reverse();
    return slice.map((c, i) => {
      const prev = slice[i + 1];
      const chg = prev ? ((c.close - prev.close) / prev.close) * 100 : null;
      return { c, chg };
    });
  }, [candles]);

  if (candles.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted">no data</div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <section className="k-border-b">
        <div className="px-3 h-7 flex items-center k-border-b">
          <span className="k-label">overview</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {overview.map((c) => (
            <Cell key={c.label} {...c} />
          ))}
        </div>
      </section>

      {levelCells.length > 0 && (
        <section className="k-border-b">
          <div className="px-3 h-7 flex items-center k-border-b">
            <span className="k-label">levels</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {levelCells.map((c, i) => (
              <Cell key={`${c.label}-${i}`} {...c} />
            ))}
          </div>
        </section>
      )}

      {indicatorCells.length > 0 && (
        <section className="k-border-b">
          <div className="px-3 h-7 flex items-center k-border-b">
            <span className="k-label">indicators</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {indicatorCells.map((c, i) => (
              <Cell key={`${c.label}-${i}`} {...c} />
            ))}
          </div>
        </section>
      )}

      <section className="flex-1 flex flex-col min-h-0">
        <div className="px-3 h-7 flex items-center k-border-b shrink-0">
          <span className="k-label">candles · most recent first · last 300</span>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full k-tabular text-xs">
            <thead className="sticky top-0 bg-bg z-10">
              <tr className="k-border-b">
                <th className="text-left font-normal k-label px-3 py-2">time (utc)</th>
                <th className="text-right font-normal k-label px-3 py-2">open</th>
                <th className="text-right font-normal k-label px-3 py-2">high</th>
                <th className="text-right font-normal k-label px-3 py-2">low</th>
                <th className="text-right font-normal k-label px-3 py-2">close</th>
                <th className="text-right font-normal k-label px-3 py-2">vol</th>
                <th className="text-right font-normal k-label px-3 py-2">chg</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ c, chg }) => {
                const bullish = c.close >= c.open;
                const closeColor = bullish ? "text-bull" : "text-bear";
                const chgColor = chg == null ? "text-muted" : chg >= 0 ? "text-bull" : "text-bear";
                return (
                  <tr key={c.time} className="k-border-b">
                    <td className="px-3 py-1.5">{fmtTime(c.time)}</td>
                    <td className="px-3 py-1.5 text-right">{fmtPrice(c.open)}</td>
                    <td className="px-3 py-1.5 text-right">{fmtPrice(c.high)}</td>
                    <td className="px-3 py-1.5 text-right">{fmtPrice(c.low)}</td>
                    <td className={`px-3 py-1.5 text-right ${closeColor}`}>{fmtPrice(c.close)}</td>
                    <td className="px-3 py-1.5 text-right text-muted">{fmtVol(c.volume)}</td>
                    <td className={`px-3 py-1.5 text-right ${chgColor}`}>{fmtPct(chg)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
