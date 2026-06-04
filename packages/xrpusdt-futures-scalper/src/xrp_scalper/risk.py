from __future__ import annotations

import time
from dataclasses import dataclass
from decimal import Decimal

from .config import RiskConfig, TradingConfig
from .strategy import Side


@dataclass
class Position:
    side: Side
    quantity: Decimal
    entry_price: float
    opened_at: float


class RiskManager:
    def __init__(self, trading: TradingConfig, risk: RiskConfig) -> None:
        self.trading = trading
        self.risk = risk
        self.position: Position | None = None
        self.realized_pnl = 0.0
        self.consecutive_losses = 0
        self.last_trade_at = 0.0

    def can_open(self) -> tuple[bool, str]:
        now = time.time()
        if self.position is not None:
            return False, "position_open"
        if now - self.last_trade_at < self.trading.cooldown_seconds:
            return False, "cooldown"
        if self.realized_pnl <= -abs(self.risk.max_daily_loss_usdt):
            return False, "daily_loss_limit"
        if self.consecutive_losses >= self.risk.max_consecutive_losses:
            return False, "consecutive_loss_limit"
        return True, "ok"

    def open_position(self, side: Side, quantity: Decimal, entry_price: float) -> None:
        self.position = Position(side=side, quantity=quantity, entry_price=entry_price, opened_at=time.time())
        self.last_trade_at = time.time()

    def should_close(self, current_price: float) -> tuple[bool, str]:
        if self.position is None:
            return False, "no_position"

        pnl_bps = self.unrealized_pnl_bps(current_price)
        if pnl_bps >= self.trading.take_profit_bps:
            return True, "take_profit"
        if pnl_bps <= -abs(self.trading.stop_loss_bps):
            return True, "stop_loss"
        if time.time() - self.position.opened_at >= self.trading.max_hold_seconds:
            return True, "max_hold"
        return False, "hold"

    def close_position(self, exit_price: float) -> tuple[Position, float]:
        if self.position is None:
            raise RuntimeError("No position to close")
        position = self.position
        direction = 1 if position.side == Side.BUY else -1
        pnl = (exit_price - position.entry_price) * float(position.quantity) * direction
        self.realized_pnl += pnl
        self.consecutive_losses = self.consecutive_losses + 1 if pnl < 0 else 0
        self.position = None
        self.last_trade_at = time.time()
        return position, pnl

    def unrealized_pnl_bps(self, current_price: float) -> float:
        if self.position is None:
            return 0.0
        direction = 1 if self.position.side == Side.BUY else -1
        return ((current_price - self.position.entry_price) / self.position.entry_price) * 10_000 * direction

