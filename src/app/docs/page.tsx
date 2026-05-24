import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KYSH / docs",
  description: "How to read each indicator and key level, and which timeframes to use them on.",
};

type Entry = {
  name: string;
  what: string;
  how: string;
  best: string;
  watch?: string;
};

type Section = { title: string; intro?: string; entries: Entry[] };

const INDICATORS: Section = {
  title: "indicators",
  intro:
    "Indicators are math run over the candle history. Each one answers a different question. Stack two or three at most; more becomes noise.",
  entries: [
    {
      name: "SMA 20",
      what: "Simple moving average of the last 20 closes. Slow, lagging trend line that smooths out short-term noise.",
      how: "Above SMA 20: short-term bullish. Below: short-term bearish. A clean break that holds for several bars is more meaningful than a single piercing wick.",
      best: "5m, 15m, 1h. Useful intraday for stocks and on hourlies for crypto.",
      watch: "Whippy when price chops sideways. Don't trade pure crosses without confluence.",
    },
    {
      name: "SMA 50",
      what: "Average of the last 50 closes. Medium-term trend.",
      how: "Common 'institutional' average — many algos and discretionary traders watch the 50. Price reclaiming or losing it after a long absence is a meaningful event.",
      best: "1h, 4h, 1D. Strong on the daily for swing setups.",
    },
    {
      name: "SMA 200",
      what: "Average of the last 200 closes. The textbook bull/bear divider.",
      how: "Above the 200D: long-term bull regime. Below: bear regime. Price reclaiming the 200 after months below is a major narrative shift.",
      best: "1D, 1W. Almost meaningless on 1m/5m.",
    },
    {
      name: "EMA 9",
      what: "Exponential moving average — weighted toward recent closes, so it reacts faster than SMA.",
      how: "Quick read on short-term momentum. EMA 9 hugging price upward = active trend.",
      best: "1m, 5m. Scalping aid; falls behind on higher timeframes.",
    },
    {
      name: "EMA 21",
      what: "Exponential 21-period average. Faster than SMA 20 with similar period intent.",
      how: "Commonly paired with EMA 9 — when EMA 9 is above EMA 21 and rising, momentum is up.",
      best: "5m, 15m, 1h. The default for intraday momentum readers.",
    },
    {
      name: "VWAP",
      what: "Volume-weighted average price for the current session. Each bar's typical price is weighted by its volume.",
      how: "The 'fair price' for the session in the eyes of size. Price above VWAP = buyers in control today. Big rejections at VWAP from below = supply is still there.",
      best: "1m, 5m, 15m for stocks. Crypto runs 24/7 so the session reset is less meaningful — VWAP there resets at UTC midnight in this app.",
      watch: "Less useful overnight or on the weekly chart.",
    },
    {
      name: "Bollinger 20/2",
      what: "20-period SMA (the middle band) with upper/lower bands at 2 standard deviations.",
      how: "Wide bands = volatile; narrow bands ('squeeze') = energy building. Tags of the outer bands aren't sell signals on their own — strong trends ride the band.",
      best: "Any timeframe. Particularly good on 1h and 4h for breakouts after a squeeze.",
      watch: "Mean-reversion trades against the trend are how people blow up.",
    },
    {
      name: "RSI 14",
      what: "Relative strength index. 0 to 100. Compares average gains to average losses over 14 bars.",
      how: "Above 70 = overbought; below 30 = oversold — but trends can stay 'overbought' for a long time. More useful: bullish/bearish divergence (price makes a new high; RSI doesn't).",
      best: "15m, 1h, 4h. The 1h RSI is a classic swing-trade trigger.",
      watch: "Don't short just because RSI > 70. Look for divergence + a structure break.",
    },
    {
      name: "MACD 12/26/9",
      what: "Difference between the 12-EMA and 26-EMA (MACD line), with a 9-EMA of that as the signal line. Histogram is MACD minus signal.",
      how: "Histogram flipping positive after a stretch negative = momentum turning up. MACD line crossing zero from below = trend likely turning bullish.",
      best: "1h, 4h, 1D. The daily MACD cross is a swing-trader staple.",
      watch: "Choppy on 1m/5m and lags by design. Use as confirmation, not entry trigger.",
    },
  ],
};

const LEVELS: Section = {
  title: "key levels",
  intro:
    "Horizontal price levels where decisions get made. Most are simple to compute, but they matter because so many traders watch the exact same line.",
  entries: [
    {
      name: "HOD / LOD",
      what: "High and low of the current trading day.",
      how: "Breaks of HOD or LOD with volume are continuation signals. Rejections at HOD/LOD with volume are reversal candidates.",
      best: "All intraday timeframes (1m to 1h).",
    },
    {
      name: "PDH / PDL",
      what: "Prior day high and prior day low.",
      how: "Often the first place price reacts after the open. PDH break in premarket is bullish bias; PDL loss is bearish bias.",
      best: "1m, 5m, 15m, 1h. Foundational for day trading stocks.",
      watch: "Less meaningful on crypto since there is no formal close, but still tracked.",
    },
    {
      name: "PWH / PWL",
      what: "Prior week high and prior week low.",
      how: "Major weekly inflection points. Trending markets often retest PWH/PWL before continuing.",
      best: "1h, 4h, 1D. Use as bias filters for swing trades.",
    },
    {
      name: "Premarket H / L",
      what: "Stocks only. High and low set between 4:00 and 9:30 NY time.",
      how: "Premarket range often defines the day's opening range. Failure to hold premarket low after the bell is a red flag; breaking premarket high in the first 30 minutes is strong.",
      best: "1m, 5m, 15m on US stocks. Not meaningful for crypto.",
    },
    {
      name: "Round numbers",
      what: "Psychological levels at major round-number prices near the current price.",
      how: "100, 1000, 50000 — humans love round numbers and stops cluster there. Expect reactions on first touch.",
      best: "Any timeframe. Especially obvious on 1D as resistance/support during major moves.",
    },
  ],
};

const TIMEFRAMES_SEC: Section = {
  title: "timeframes",
  intro:
    "What each timeframe is built for. The bigger the timeframe, the more meaningful the level and the slower the trade.",
  entries: [
    {
      name: "1m",
      what: "One-minute candles. ~390 bars in a US stock session, continuous for crypto.",
      how: "Scalping, news reactions, exact entry/exit timing. Pair with a 5m or 15m bias.",
      best: "Active intraday execution, not bias.",
    },
    {
      name: "5m / 15m",
      what: "5- and 15-minute bars. The intraday workhorse timeframes.",
      how: "Most day-trade setups (opening range, VWAP reclaim, PDH break) live here. RSI and EMA 9/21 shine.",
      best: "Day trading stocks and crypto.",
    },
    {
      name: "1h",
      what: "Hourly candles.",
      how: "Bridges intraday and swing. The 1h SMA 50 + 1h RSI is a powerful pair for multi-day momentum.",
      best: "Swing entries, multi-session bias.",
    },
    {
      name: "4h",
      what: "Four-hour candles. Yahoo doesn't natively expose 4h, so it's aggregated from 1h in this app.",
      how: "Crypto trend timeframe. Cleans up noise without losing reactivity.",
      best: "Crypto swing trading, position trading on stocks.",
    },
    {
      name: "1D",
      what: "Daily candles. One bar per session.",
      how: "Where structure lives. PDH/PDL, 200D SMA, daily MACD — all the regime-level information.",
      best: "Bias, swing trades, longer-term positions.",
    },
    {
      name: "1W",
      what: "Weekly candles.",
      how: "Macro view. A weekly close above or below a major level (200D area, ATH retest) is a big deal.",
      best: "Long-term context. Check before opening any swing position.",
    },
  ],
};

const SECTIONS = [INDICATORS, LEVELS, TIMEFRAMES_SEC];

function EntryCard({ e }: { e: Entry }) {
  return (
    <article className="k-border-b">
      <header className="px-4 py-3 k-border-b">
        <h3 className="text-fg">{e.name}</h3>
      </header>
      <dl className="grid grid-cols-1 md:grid-cols-4">
        <div className="md:col-span-2 px-4 py-3 md:k-border-r k-border-b md:k-border-b-0">
          <dt className="k-label mb-1">what it is</dt>
          <dd className="text-fg">{e.what}</dd>
        </div>
        <div className="md:col-span-2 px-4 py-3 k-border-b md:k-border-b-0">
          <dt className="k-label mb-1">how to read it</dt>
          <dd className="text-fg">{e.how}</dd>
        </div>
        <div className={`px-4 py-3 ${e.watch ? "md:col-span-2 md:k-border-r" : "md:col-span-4"}`}>
          <dt className="k-label mb-1">best timeframes</dt>
          <dd className="text-fg">{e.best}</dd>
        </div>
        {e.watch && (
          <div className="md:col-span-2 px-4 py-3 k-border-t md:k-border-t-0">
            <dt className="k-label mb-1">watch for</dt>
            <dd className="text-bear">{e.watch}</dd>
          </div>
        )}
      </dl>
    </article>
  );
}

export default function DocsPage() {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <header className="k-border-b flex items-stretch h-10 shrink-0">
        <div className="px-3 flex items-center k-border-r">
          <span className="text-fg">KYSH</span>
          <span className="text-muted px-2">/</span>
          <span className="text-fg">docs</span>
        </div>
        <div className="px-3 flex items-center text-muted">
          how to read the chart
        </div>
        <div className="flex-1" />
        <Link
          href="/"
          className="px-4 flex items-center k-border-l k-hover"
        >
          back to chart
        </Link>
      </header>

      <main className="flex-1 overflow-auto">
        <section className="px-4 py-6 k-border-b max-w-4xl">
          <p className="text-fg leading-relaxed">
            KYSH is a free chart tool. The math behind each indicator is standard; the trick is
            knowing which to look at on which timeframe and which question each one answers. Pick
            one from each row below — a trend tool, an oscillator, a level — and you have enough
            to read most setups.
          </p>
          <p className="text-muted mt-3 leading-relaxed">
            Nothing here is financial advice. Markets are reflexive and indicators describe the
            past.
          </p>
        </section>

        {SECTIONS.map((s) => (
          <section key={s.title} className="k-border-b">
            <div className="px-4 py-3 k-border-b flex items-baseline gap-3">
              <h2 className="text-fg uppercase">{s.title}</h2>
              {s.intro && <p className="text-muted text-sm">{s.intro}</p>}
            </div>
            {s.entries.map((e) => (
              <EntryCard key={e.name} e={e} />
            ))}
          </section>
        ))}

        <section className="px-4 py-6 max-w-4xl">
          <h2 className="text-fg uppercase mb-3">data sources</h2>
          <ul className="space-y-1 text-fg">
            <li><span className="k-label mr-2">crypto</span>Binance.US public REST. No key.</li>
            <li><span className="k-label mr-2">stocks</span>Yahoo Finance via yahoo-finance2. No key.</li>
          </ul>
          <p className="text-muted text-sm mt-4">
            Yahoo limits intraday history to recent days (1m: ~5 days, 15m: ~60 days). Daily and
            weekly go back years. Binance.US covers majors and most popular pairs but has a
            smaller universe than Binance.com.
          </p>
        </section>
      </main>
    </div>
  );
}
