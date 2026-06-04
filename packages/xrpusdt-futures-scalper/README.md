# XRPUSDT Futures Scalper

Python scaffold for a Binance USD-M futures scalp trading robot on `XRPUSDT`.

This is engineering infrastructure, not a profitable strategy guarantee. Run dry-run first, then Binance futures testnet, then very small size if you decide to go live.

## What It Does

- Streams Binance USD-M futures kline data for `XRPUSDT`.
- Generates a simple EMA momentum scalp signal.
- Sizes trades from fixed USDT notional.
- Enforces risk limits:
  - dry-run default
  - one open position at a time
  - max daily loss stop
  - max consecutive losses stop
  - cooldown between trades
  - spread and volatility guards
- Can submit Binance USD-M futures market orders when `dry_run` is disabled.

## Setup

```bash
cd "/Users/pitaakphong/Documents/New project/packages/xrpusdt-futures-scalper"
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
cp config.example.json config.json
```

Add API keys to `.env` only when you need authenticated endpoints:

```bash
BINANCE_API_KEY=...
BINANCE_API_SECRET=...
```

## Run

Dry run:

```bash
PYTHONPATH=src python -m xrp_scalper --config config.json
```

Live/testnet order mode requires changing:

```json
{
  "trading": {
    "dry_run": false,
    "testnet": true
  }
}
```

Keep `testnet` true until you have verified order placement, rounding, disconnect handling, and risk limits.

## Notes

- Binance USD-M futures REST production base URL is `https://fapi.binance.com`.
- Binance USD-M futures REST testnet base URL is `https://testnet.binancefuture.com`.
- Current Binance USD-M websocket docs route streams under `wss://fstream.binance.com/public`, `/market`, or `/private`. This bot uses market stream routing for kline data.
- Binance futures are high-risk. Add exchange-side stop orders and user data stream reconciliation before considering unattended live use.
