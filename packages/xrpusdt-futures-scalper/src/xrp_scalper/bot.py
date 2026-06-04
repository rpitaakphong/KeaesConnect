from __future__ import annotations

import argparse
import asyncio
import json
import signal
from decimal import Decimal
from pathlib import Path
from typing import Any

import websockets

from .binance import BinanceFuturesClient, websocket_url
from .config import AppConfig, load_config
from .risk import RiskManager
from .strategy import EmaScalpStrategy, Side


class ScalperBot:
    def __init__(self, config: AppConfig) -> None:
        self.config = config
        self.client = BinanceFuturesClient(config.api_key, config.api_secret, config.trading.testnet)
        self.strategy = EmaScalpStrategy(config.strategy, config.risk)
        self.risk = RiskManager(config.trading, config.risk)
        self.stop = asyncio.Event()

    async def run(self) -> None:
        rules = self.client.symbol_rules(self.config.symbol)
        if not self.config.trading.dry_run:
            self.client.set_leverage(self.config.symbol, self.config.trading.leverage)

        url = websocket_url(self.config.symbol, self.config.stream_interval, self.config.trading.testnet)
        print(f"starting symbol={self.config.symbol} dry_run={self.config.trading.dry_run} testnet={self.config.trading.testnet}")
        print(f"websocket={url}")

        while not self.stop.is_set():
            try:
                async with websockets.connect(url, ping_interval=None) as ws:
                    async for message in ws:
                        if self.stop.is_set():
                            return
                        await self._handle_message(json.loads(message), rules)
            except Exception as exc:
                print(f"stream_error={exc}; reconnecting in 5s")
                await asyncio.sleep(5)

    async def _handle_message(self, event: dict[str, Any], rules: Any) -> None:
        data = event.get("data", event)
        kline = data.get("k")
        if not kline or not kline.get("x"):
            return

        close_price = float(kline["c"])
        await self._maybe_close(close_price)

        signal_result = self.strategy.update(close_price)
        if signal_result.side is None:
            print(f"close={close_price:.6f} signal=none reason={signal_result.reason} strength_bps={signal_result.strength_bps:.2f}")
            return

        allowed, reason = self.risk.can_open()
        if not allowed:
            print(f"close={close_price:.6f} signal={signal_result.side.value} blocked={reason}")
            return

        spread_bps = self._current_spread_bps()
        if spread_bps > self.config.risk.max_spread_bps:
            print(f"close={close_price:.6f} signal={signal_result.side.value} blocked=wide_spread spread_bps={spread_bps:.2f}")
            return

        raw_qty = Decimal(str(self.config.trading.position_notional_usdt)) / Decimal(str(close_price))
        quantity = self.client.round_qty(raw_qty, rules)
        if quantity <= 0 or quantity * Decimal(str(close_price)) < rules.min_notional:
            print(f"order_blocked=quantity_too_small qty={quantity} price={close_price}")
            return

        await self._open(signal_result.side, quantity, close_price, signal_result.reason)

    def _current_spread_bps(self) -> float:
        ticker = self.client.book_ticker(self.config.symbol)
        bid = float(ticker["bidPrice"])
        ask = float(ticker["askPrice"])
        mid = (bid + ask) / 2
        return ((ask - bid) / mid) * 10_000 if mid > 0 else float("inf")

    async def _open(self, side: Side, quantity: Decimal, price: float, reason: str) -> None:
        if self.config.trading.dry_run:
            print(f"dry_open side={side.value} qty={quantity} price={price:.6f} reason={reason}")
        else:
            result = self.client.market_order(self.config.symbol, side.value, quantity)
            print(f"live_open side={side.value} qty={quantity} result={result}")
        self.risk.open_position(side, quantity, price)

    async def _maybe_close(self, price: float) -> None:
        should_close, reason = self.risk.should_close(price)
        if not should_close or self.risk.position is None:
            return

        position = self.risk.position
        close_side = Side.SELL if position.side == Side.BUY else Side.BUY
        if self.config.trading.dry_run:
            print(f"dry_close side={close_side.value} qty={position.quantity} price={price:.6f} reason={reason}")
        else:
            result = self.client.market_order(self.config.symbol, close_side.value, position.quantity, reduce_only=True)
            print(f"live_close side={close_side.value} qty={position.quantity} reason={reason} result={result}")
        _, pnl = self.risk.close_position(price)
        print(f"closed reason={reason} pnl_usdt={pnl:.4f} daily_pnl_usdt={self.risk.realized_pnl:.4f}")


async def async_main(config_path: Path) -> None:
    bot = ScalperBot(load_config(config_path))
    loop = asyncio.get_running_loop()
    for sig in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(sig, bot.stop.set)
    await bot.run()


def main() -> None:
    parser = argparse.ArgumentParser(description="XRPUSDT Binance USD-M futures scalper")
    parser.add_argument("--config", type=Path, default=Path("config.json"))
    args = parser.parse_args()
    asyncio.run(async_main(args.config))
