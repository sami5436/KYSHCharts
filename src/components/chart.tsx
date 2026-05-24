"use client";

import { useEffect, useRef } from "react";
import {
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  HistogramSeries,
  LineSeries,
  LineStyle,
  createChart,
  type IChartApi,
  type IPriceLine,
  type ISeriesApi,
  type LineWidth,
  type UTCTimestamp,
} from "lightweight-charts";
import { bollinger, ema, macd, rsi, sma, vwap } from "@/lib/indicators";
import type { Candle, ComputedLevel, Settings } from "@/lib/types";

const C = {
  bg: "#0a0a0a",
  fg: "#f5f5f5",
  muted: "#6b6b6b",
  border: "#262626",
  accent: "#ffb000",
  bull: "#4ade80",
  bear: "#f87171",
  sma20: "#60a5fa",
  sma50: "#a78bfa",
  sma200: "#ec4899",
  ema9: "#fbbf24",
  ema21: "#34d399",
  vwap: "#22d3ee",
  bb: "#94a3b8",
  signal: "#9ca3af",
};

type LinePt = { time: number; value: number };

function toUtc<T extends { time: number }>(arr: T[]): (Omit<T, "time"> & { time: UTCTimestamp })[] {
  return arr.map((p) => ({ ...p, time: p.time as UTCTimestamp }));
}

type Props = {
  candles: Candle[];
  settings: Settings;
  levels: ComputedLevel[];
};

export function Chart({ candles, settings, levels }: Props) {
  const wrap = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const mainRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const overlays = useRef<ISeriesApi<"Line">[]>([]);
  const oscillators = useRef<ISeriesApi<"Line" | "Histogram">[]>([]);
  const priceLines = useRef<IPriceLine[]>([]);

  useEffect(() => {
    if (!wrap.current) return;
    const chart = createChart(wrap.current, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: C.bg },
        textColor: C.muted,
        fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
        fontSize: 11,
        panes: {
          separatorColor: C.border,
          separatorHoverColor: C.border,
          enableResize: true,
        },
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: C.border, style: LineStyle.Dotted },
        horzLines: { color: C.border, style: LineStyle.Dotted },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: C.accent, labelBackgroundColor: C.accent, width: 1, style: LineStyle.Dashed },
        horzLine: { color: C.accent, labelBackgroundColor: C.accent, width: 1, style: LineStyle.Dashed },
      },
      rightPriceScale: { borderColor: C.border, scaleMargins: { top: 0.08, bottom: 0.08 } },
      timeScale: { borderColor: C.border, timeVisible: true, secondsVisible: false, rightOffset: 6 },
    });
    chartRef.current = chart;
    const main = chart.addSeries(CandlestickSeries, {
      upColor: C.bull,
      downColor: C.bear,
      borderUpColor: C.bull,
      borderDownColor: C.bear,
      wickUpColor: C.bull,
      wickDownColor: C.bear,
    });
    mainRef.current = main;
    return () => {
      chart.remove();
      chartRef.current = null;
      mainRef.current = null;
      overlays.current = [];
      oscillators.current = [];
      priceLines.current = [];
    };
  }, []);

  useEffect(() => {
    const main = mainRef.current;
    const chart = chartRef.current;
    if (!main || !chart) return;
    if (candles.length === 0) {
      main.setData([]);
      return;
    }
    main.setData(
      candles.map((c) => ({
        time: c.time as UTCTimestamp,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      })),
    );
    chart.timeScale().fitContent();
  }, [candles]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    for (const s of overlays.current) {
      try {
        chart.removeSeries(s);
      } catch {}
    }
    overlays.current = [];
    for (const s of oscillators.current) {
      try {
        chart.removeSeries(s);
      } catch {}
    }
    oscillators.current = [];
    while (chart.panes().length > 1) {
      try {
        chart.removePane(chart.panes().length - 1);
      } catch {
        break;
      }
    }

    if (candles.length === 0) return;

    const addOverlay = (data: LinePt[], color: string, lw: LineWidth = 1, style?: LineStyle) => {
      if (data.length === 0) return;
      const s = chart.addSeries(LineSeries, {
        color,
        lineWidth: lw,
        lineStyle: style,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
      });
      s.setData(toUtc(data));
      overlays.current.push(s);
    };

    if (settings.indicators.sma20) addOverlay(sma(candles, 20), C.sma20);
    if (settings.indicators.sma50) addOverlay(sma(candles, 50), C.sma50);
    if (settings.indicators.sma200) addOverlay(sma(candles, 200), C.sma200);
    if (settings.indicators.ema9) addOverlay(ema(candles, 9), C.ema9);
    if (settings.indicators.ema21) addOverlay(ema(candles, 21), C.ema21);
    if (settings.indicators.vwap) addOverlay(vwap(candles), C.vwap, 2);
    if (settings.indicators.bb) {
      const bb = bollinger(candles, 20, 2);
      addOverlay(
        bb.map((p) => ({ time: p.time, value: p.upper })),
        C.bb,
      );
      addOverlay(
        bb.map((p) => ({ time: p.time, value: p.middle })),
        C.bb,
        1,
        LineStyle.Dotted,
      );
      addOverlay(
        bb.map((p) => ({ time: p.time, value: p.lower })),
        C.bb,
      );
    }

    let nextPane = 1;
    if (settings.indicators.rsi) {
      const r = rsi(candles);
      if (r.length) {
        const pane = nextPane++;
        const s = chart.addSeries(
          LineSeries,
          {
            color: C.accent,
            lineWidth: 1,
            priceLineVisible: false,
            lastValueVisible: true,
            crosshairMarkerVisible: false,
          },
          pane,
        );
        s.setData(toUtc(r));
        s.createPriceLine({
          price: 70,
          color: C.border,
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          axisLabelVisible: true,
          title: "70",
        });
        s.createPriceLine({
          price: 30,
          color: C.border,
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          axisLabelVisible: true,
          title: "30",
        });
        oscillators.current.push(s);
      }
    }

    if (settings.indicators.macd) {
      const m = macd(candles);
      if (m.length) {
        const pane = nextPane++;
        const hist = chart.addSeries(
          HistogramSeries,
          {
            priceLineVisible: false,
            lastValueVisible: false,
          },
          pane,
        );
        hist.setData(
          m.map((p) => ({
            time: p.time as UTCTimestamp,
            value: p.hist,
            color: p.hist >= 0 ? C.bull : C.bear,
          })),
        );
        oscillators.current.push(hist);
        const macdLine = chart.addSeries(
          LineSeries,
          {
            color: C.accent,
            lineWidth: 1,
            priceLineVisible: false,
            lastValueVisible: true,
            crosshairMarkerVisible: false,
          },
          pane,
        );
        macdLine.setData(toUtc(m.map((p) => ({ time: p.time, value: p.macd }))));
        oscillators.current.push(macdLine);
        const sigLine = chart.addSeries(
          LineSeries,
          {
            color: C.signal,
            lineWidth: 1,
            priceLineVisible: false,
            lastValueVisible: true,
            crosshairMarkerVisible: false,
          },
          pane,
        );
        sigLine.setData(toUtc(m.map((p) => ({ time: p.time, value: p.signal }))));
        oscillators.current.push(sigLine);
      }
    }

    const panes = chart.panes();
    panes[0]?.setStretchFactor(3);
    for (let i = 1; i < panes.length; i++) panes[i]?.setStretchFactor(1);
  }, [candles, settings.indicators]);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    for (const pl of priceLines.current) {
      try {
        main.removePriceLine(pl);
      } catch {}
    }
    priceLines.current = [];
    for (const lvl of levels) {
      const pl = main.createPriceLine({
        price: lvl.value,
        color: C.accent,
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: lvl.label,
      });
      priceLines.current.push(pl);
    }
  }, [levels]);

  return <div ref={wrap} className="flex-1 min-h-0 w-full" />;
}
