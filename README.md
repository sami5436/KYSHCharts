# KYSH / charts

Quick charts. Free data. No noise.

A minimal alternative to TradingView for personal use. Brutalist mono aesthetic, free-only data sources, multiple timeframes, the usual indicators, key price levels, and a settings dropdown to toggle anything off.

## Data sources

- **Crypto:** Binance.US public REST. No key required. (`api.binance.com` is geo-blocked from US, which is where Vercel serverless functions run by default.)
- **Stocks:** Yahoo Finance via the `yahoo-finance2` npm package. No key required.

## Stack

- Next.js 16 (App Router, TypeScript, src/)
- Tailwind CSS v4 (CSS-based config)
- `lightweight-charts` (TradingView's open-source charting library)
- Deployed on Vercel from this repo.

## Develop

```
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy

Connect this repo to a new Vercel project. No environment variables required.

## Scope

In: candles, timeframes (1m to 1W), moving averages, VWAP, Bollinger, RSI, MACD, prior-day/week highs and lows, premarket H/L, round-number levels, symbol search across both markets, per-overlay toggles persisted to localStorage.

Out: order book / DOM (not free for stocks), drawing tools, alerts, accounts, broker integration.
